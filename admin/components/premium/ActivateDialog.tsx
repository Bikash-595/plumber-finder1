"use client";

import { useState, type FormEvent } from "react";
import type { AdminSubscription } from "@/lib/adminApi";

const field = "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm";

/**
 * Turn premium on (or extend it) after a payment received outside Stripe — bank transfer, cash, invoice.
 * The amount is recorded in the account's billing history.
 */
export default function ActivateDialog({ subscription, busy, onSubmit, onClose }: { subscription: AdminSubscription; busy: boolean; onSubmit: (body: { plan: "premium" | "elite"; months: number; amount: number; note?: string }) => void; onClose: () => void }) {
  const [plan, setPlan] = useState(subscription.plan);
  const [months, setMonths] = useState(subscription.interval === "year" ? 12 : 1);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!(Number(amount) >= 0) || amount === "") return;
    onSubmit({ plan, months, amount: Number(amount), note: note.trim() || undefined });
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Activate premium">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{subscription.active ? "Extend premium" : "Activate premium"}</h2>
          <p className="text-sm text-gray-500">{subscription.name ?? subscription.accountName} · {subscription.providerType}. Only after you&apos;ve received the payment.</p>
        </div>
        <label className="block text-sm font-medium text-gray-700">Plan
          <select value={plan} onChange={(e) => setPlan(e.target.value as "premium" | "elite")} className={field}><option value="premium">Premium</option><option value="elite">Premium Plus</option></select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-gray-700">Months
            <input type="number" min={1} max={24} value={months} onChange={(e) => setMonths(Math.max(1, Math.min(24, Number(e.target.value) || 1)))} className={field} />
          </label>
          <label className="block text-sm font-medium text-gray-700">Amount received ($)
            <input type="number" min={0} step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className={field} />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">Note (payment reference)
          <input value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Bank transfer #4821" className={field} />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600">Cancel</button>
          <button type="submit" disabled={busy || amount === ""} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Activate"}</button>
        </div>
      </form>
    </div>
  );
}
