"use client";

import { useState } from "react";
import { FaCheckCircle, FaClock, FaCreditCard, FaPlus, FaWallet } from "react-icons/fa";
import { formatMoney, userApi, type PaymentMethod } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import ConfirmDialog from "../ui/ConfirmDialog";
import EmptyState from "../ui/EmptyState";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import { Skeleton } from "../ui/Skeleton";
import StatCard from "../ui/StatCard";
import AddCardForm from "./AddCardForm";
import PaymentMethodCard from "./PaymentMethodCard";
import RecentPayments from "./RecentPayments";

/** /dashboard/wallet — what you owe and have paid, your saved cards, and recent payments. */
export default function WalletView() {
  const methods = useUserData(userApi.paymentMethods);
  const summary = useUserData(userApi.dashboard); // shared with the dashboard home and navbar — no extra request
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState("");

  if (!methods.signedIn) return <SignInPrompt what="your wallet" />;

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try { await action(); await methods.reload(); return true; } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong."); return false; } finally { setBusy(false); }
  };
  const cards = methods.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader icon={FaWallet} title="Wallet & Payments" description="Your balance, saved cards and payment history."
        actions={!adding && <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b] hover:brightness-95"><FaPlus className="h-3 w-3" /> Add card</button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Amount due" icon={FaClock} tone="warning" href="/dashboard/invoices" loading={summary.loading} value={formatMoney(summary.data?.amountDue ?? 0)} hint={`${summary.data?.counts.pendingInvoices ?? 0} unpaid invoice(s)`} />
        <StatCard label="Total paid" icon={FaCheckCircle} tone="success" loading={summary.loading} value={formatMoney(summary.data?.totalSpent ?? 0)} hint="All time" />
        <StatCard label="Saved cards" icon={FaCreditCard} tone="info" loading={methods.loading} value={cards.length} hint={cards.find((card) => card.isDefault) ? `Default ends in ${cards.find((card) => card.isDefault)!.last4}` : "No default card"} />
      </div>

      <Notice>{error || methods.error}</Notice>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Payment methods</h2>
        {adding && <AddCardForm busy={busy} onCancel={() => setAdding(false)} onSave={async (values) => { const ok = await run(() => userApi.addPaymentMethod(values)); if (ok) setAdding(false); return ok; }} />}
        {methods.loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><Skeleton className="aspect-[1.7/1] rounded-2xl" /></div> : cards.length === 0 ? (
          !adding && <EmptyState icon={FaCreditCard} title="No saved cards" text="Add a card to pay for bookings faster." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((method) => <PaymentMethodCard key={method._id} method={method} busy={busy} onMakeDefault={() => run(() => userApi.setDefaultPaymentMethod(method._id))} onRemove={() => setRemoving(method)} />)}
          </div>
        )}
      </section>

      <RecentPayments />

      <ConfirmDialog open={Boolean(removing)} title="Remove this card?" confirmLabel="Remove card" busy={busy}
        message={removing ? `${removing.brand.toUpperCase()} ending ${removing.last4} will be removed from your wallet.` : ""}
        onConfirm={() => { const card = removing; setRemoving(null); if (card) run(() => userApi.removePaymentMethod(card._id)); }} onClose={() => setRemoving(null)} />
    </div>
  );
}
