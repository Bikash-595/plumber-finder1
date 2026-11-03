"use client";

import { FaCrown, FaGem, FaRegClock } from "react-icons/fa";
import type { Subscription } from "../premiumApi";

const date = (value: string | null) => (value ? new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "");

/** Where the account stands: free, waiting for setup, active (renews / ends on …), or payment problem. */
export default function CurrentPlanCard({ subscription, busy, onCancel, onResume, onManage }: { subscription: Subscription | null; busy: boolean; onCancel: () => void; onResume: () => void; onManage: () => void }) {
  const active = subscription?.active;
  const elite = subscription?.plan === "elite";
  const Icon = elite ? FaCrown : FaGem;
  const button = "rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60";

  if (subscription?.status === "pending") {
    return (
      <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
        <FaRegClock className="h-6 w-6 shrink-0 text-amber-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-amber-900">{subscription.planName} requested</p>
          <p className="text-sm text-amber-800">Our team will contact you to complete payment. Your badge goes live as soon as it&apos;s confirmed.</p>
        </div>
        <button type="button" disabled={busy} onClick={onCancel} className={`${button} border border-amber-300 bg-white text-amber-900`}>Withdraw request</button>
      </section>
    );
  }

  if (!active || !subscription) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Your plan</p>
        <p className="mt-1 text-xl font-extrabold text-gray-900">Free listing</p>
        <p className="mt-1 text-sm text-gray-600">Upgrade to show above free listings, get a premium badge and stand out in every search.</p>
      </section>
    );
  }

  return (
    <section className={`overflow-hidden rounded-2xl p-5 text-white sm:p-6 ${elite ? "bg-gradient-to-br from-[#0b1f3b] to-[#2a4d7d]" : "bg-[#0b1f3b]"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#FFD60A] text-[#0b1f3b]"><Icon className="h-6 w-6" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FFD60A]">Your plan</p>
          <p className="text-2xl font-extrabold">{subscription.planName}</p>
          <p className="text-sm text-white/75">
            {subscription.status === "past_due" ? "Your last payment didn't go through — update your card to keep premium." :
              subscription.cancelAtPeriodEnd || subscription.status === "canceled" ? `Ends on ${date(subscription.currentPeriodEnd)}. It won't renew.` :
              subscription.source === "stripe" ? `Renews on ${date(subscription.currentPeriodEnd)} (${subscription.interval === "year" ? "yearly" : "monthly"}).` :
              `Paid until ${date(subscription.currentPeriodEnd)}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {subscription.canManageCard && <button type="button" disabled={busy} onClick={onManage} className={`${button} bg-[#FFD60A] text-[#0b1f3b]`}>Manage billing</button>}
          {subscription.cancelAtPeriodEnd
            ? <button type="button" disabled={busy} onClick={onResume} className={`${button} bg-white text-[#0b1f3b]`}>Keep my plan</button>
            : <button type="button" disabled={busy} onClick={onCancel} className={`${button} border border-white/30 text-white`}>Cancel renewal</button>}
        </div>
      </div>
    </section>
  );
}
