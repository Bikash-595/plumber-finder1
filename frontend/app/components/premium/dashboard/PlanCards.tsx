"use client";

import { FaCheck, FaCrown, FaGem } from "react-icons/fa";
import { money, type Interval, type Plan, type PlanId, type Subscription } from "../premiumApi";

/**
 * Free, Premium and Premium Plus side by side, with a Monthly / Yearly switch. Card mode goes to Stripe's
 * checkout; manual mode sends a request to the team.
 */
export default function PlanCards({ plans, interval, onInterval, subscription, mode, busy, onChoose }: {
  plans: Plan[]; interval: Interval; onInterval: (interval: Interval) => void; subscription: Subscription | null;
  mode: "stripe" | "manual"; busy: boolean; onChoose: (plan: PlanId) => void;
}) {
  const current = subscription?.active ? subscription.plan : null;
  const pending = subscription?.status === "pending";
  return (
    <section aria-labelledby="plans-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="plans-heading" className="text-xl font-extrabold text-gray-900">Choose your plan</h2>
          <p className="text-sm text-gray-500">Cancel any time. Prices include everything listed — no setup fee.</p>
        </div>
        <div className="flex rounded-full border border-gray-200 bg-white p-1 text-sm font-semibold" role="radiogroup" aria-label="Billing period">
          {(["month", "year"] as Interval[]).map((value) => (
            <button key={value} type="button" role="radio" aria-checked={interval === value} onClick={() => onInterval(value)} className={`rounded-full px-4 py-1.5 ${interval === value ? "bg-[#0b1f3b] text-white" : "text-gray-600"}`}>
              {value === "month" ? "Monthly" : <>Yearly <span className={interval === value ? "text-[#FFD60A]" : "text-emerald-600"}>· 2 months free</span></>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-bold text-gray-500">Free</p>
          <p className="mt-2 text-3xl font-black text-gray-900">$0</p>
          <p className="text-xs text-gray-500">forever</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {["Public profile and directory listing", "Booking requests, messages and quotes", "Reviews and analytics"].map((item) => <li key={item} className="flex gap-2"><FaCheck className="mt-1 h-3 w-3 shrink-0 text-gray-400" aria-hidden />{item}</li>)}
          </ul>
          <p className="mt-auto pt-5 text-center text-sm font-semibold text-gray-400">{current ? "" : "Your current plan"}</p>
        </article>

        {plans.map((plan) => {
          const elite = plan.id === "elite";
          const Icon = elite ? FaCrown : FaGem;
          const price = plan.prices[interval];
          const perMonth = interval === "year" ? Math.round(price / 12) : price;
          const isCurrent = current === plan.id;
          return (
            <article key={plan.id} className={`relative flex flex-col rounded-2xl bg-white p-5 ${elite ? "border-2 border-[#FFD60A] shadow-lg shadow-[#FFD60A]/20" : "border border-gray-200"}`}>
              {elite && <span className="absolute -top-3 left-5 rounded-full bg-[#FFD60A] px-3 py-0.5 text-xs font-extrabold text-[#0b1f3b]">Most visibility</span>}
              <p className="flex items-center gap-2 text-sm font-bold text-[#0b1f3b]"><Icon className="h-3.5 w-3.5 text-[#b39200]" aria-hidden /> {plan.name}</p>
              <p className="mt-2 flex items-baseline gap-1"><span className="text-3xl font-black text-gray-900">{money(perMonth)}</span><span className="text-sm text-gray-500">/ month</span></p>
              <p className="text-xs text-gray-500">{interval === "year" ? `${money(price)} billed yearly` : "billed monthly"}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {plan.features.map((item) => <li key={item} className="flex gap-2"><FaCheck className="mt-1 h-3 w-3 shrink-0 text-emerald-600" aria-hidden />{item}</li>)}
              </ul>
              <div className="mt-auto pt-5">
                {isCurrent ? (
                  <p className="rounded-full bg-emerald-50 py-2.5 text-center text-sm font-bold text-emerald-700">Your current plan</p>
                ) : (
                  <button type="button" disabled={busy || pending || Boolean(current)} onClick={() => onChoose(plan.id)}
                    className={`w-full rounded-full py-2.5 text-sm font-extrabold disabled:opacity-50 ${elite ? "bg-[#FFD60A] text-[#0b1f3b] hover:bg-[#f5c400]" : "bg-[#0b1f3b] text-white hover:bg-[#17345a]"}`}>
                    {pending ? "Request sent" : current ? "Change in Manage billing" : mode === "stripe" ? `Upgrade to ${plan.name}` : `Request ${plan.name}`}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {mode === "manual" && <p className="mt-3 text-xs text-gray-500">Online card payments are being set up. Send a request and our team will contact you to complete payment — your badge goes live once it&apos;s confirmed.</p>}
    </section>
  );
}
