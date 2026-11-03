"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { isStripeUrl, premiumApi, type Interval, type PlanId, type PremiumPage } from "../premiumApi";
import BillingHistory from "./BillingHistory";
import CurrentPlanCard from "./CurrentPlanCard";
import PlanCards from "./PlanCards";
import PlanComparison from "./PlanComparison";
import PremiumFaq from "./PremiumFaq";

/**
 * Premium & Billing for companies and freelancers (the API follows the signed-in account): current plan,
 * plans with prices, comparison, billing history and FAQs. Payment only ever happens on Stripe's page or
 * through the team — this page never decides that a plan is paid.
 */
export default function PremiumDashboard() {
  const params = useSearchParams();
  const [data, setData] = useState<PremiumPage | null>(null);
  const [interval, setBillingInterval] = useState<Interval>("month");
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(() => {
    const checkout = params.get("checkout");
    return checkout === "success" ? { tone: "success", text: "Thanks! Your payment is being confirmed — your badge appears within a minute." } : checkout === "cancelled" ? { tone: "info", text: "Checkout was cancelled. You haven't been charged." } : null;
  });

  useEffect(() => {
    let cancelled = false;
    const load = () => premiumApi.page().then((page) => { if (!cancelled) setData(page); }).catch((caught) => { if (!cancelled) setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not load your plan." }); });
    load();
    // After returning from Stripe, the webhook may land a moment later: check again a few times.
    const retries = params.get("checkout") === "success" ? [3000, 8000, 15000].map((ms) => window.setTimeout(load, ms)) : [];
    return () => { cancelled = true; retries.forEach(window.clearTimeout); };
  }, [params]);

  const run = async (action: () => Promise<{ data: PremiumPage; message?: string }>) => {
    setBusy(true);
    setNotice(null);
    try { const result = await action(); setData(result.data); if (result.message) setNotice({ tone: "success", text: result.message }); }
    catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Something went wrong." }); }
    finally { setBusy(false); }
  };
  const goTo = async (action: () => Promise<{ data: { url: string } }>) => {
    setBusy(true);
    setNotice(null);
    try {
      const { data: { url } } = await action();
      if (!isStripeUrl(url)) throw new Error("Unexpected payment page.");
      window.location.assign(url);
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not open the payment page." }); setBusy(false); }
  };
  const choose = (plan: PlanId) => (data?.mode === "stripe" ? goTo(() => premiumApi.checkout(plan, interval)) : run(() => premiumApi.request(plan, interval)));

  return (
    <div className="space-y-6">
      <PageHeader icon={FaCrown} title="Premium & Billing" description="Stand out in the directory: a premium badge, a higher position in search, and a highlighted card." />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      {!data ? <SkeletonRows rows={3} className="h-40" /> : (
        <>
          <CurrentPlanCard subscription={data.subscription} busy={busy} onCancel={() => setConfirmCancel(true)} onResume={() => run(premiumApi.resume)} onManage={() => goTo(premiumApi.portal)} />
          <PlanCards plans={data.plans} interval={interval} onInterval={setBillingInterval} subscription={data.subscription} mode={data.mode} busy={busy} onChoose={choose} />
          <PlanComparison />
          <BillingHistory payments={data.payments} />
          <PremiumFaq />
        </>
      )}
      <ConfirmDialog
        open={confirmCancel}
        title={data?.subscription?.status === "pending" ? "Withdraw your request?" : "Cancel renewal?"}
        message={data?.subscription?.status === "pending" ? "We won't contact you about this request." : "You keep premium until the end of the period you've paid for. After that your listing goes back to free."}
        confirmLabel={data?.subscription?.status === "pending" ? "Withdraw" : "Cancel renewal"}
        busy={busy}
        onConfirm={() => { setConfirmCancel(false); run(premiumApi.cancel); }}
        onClose={() => setConfirmCancel(false)}
      />
    </div>
  );
}
