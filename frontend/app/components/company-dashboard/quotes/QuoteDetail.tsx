"use client";

import { useState } from "react";
import Drawer from "@/components/dashboard/ui/Drawer";
import StatusPill from "@/components/dashboard/ui/StatusPill";
import { formatMoney } from "../companyApi";
import { growthApi, type Quote } from "../growthApi";
import { quoteStatus } from "./quoteStatus";

/** A quote as the customer received it, with withdraw (sent) or edit/delete (draft). */
export default function QuoteDetail({ quote, onClose, onEdit, onChanged }: { quote: Quote | null; onClose: () => void; onEdit: (quote: Quote) => void; onChanged: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (action: () => Promise<{ message?: string }>) => {
    setBusy(true);
    try { const { message } = await action(); onChanged(message ?? "Saved."); } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong."); } finally { setBusy(false); }
  };
  return (
    <Drawer open={Boolean(quote)} onClose={onClose} title={quote ? `${quote.title || "Quote"} · ${quote.number}` : "Quote"} subtitle={quote ? `${quote.customerName ?? "Customer"} · booking ${quote.bookingReference}` : undefined}
      footer={quote && (quote.status === "draft" ? (
        <div className="flex gap-2"><button type="button" onClick={() => onEdit(quote)} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-bold text-white">Edit & send</button><button type="button" disabled={busy} onClick={() => { if (window.confirm("Delete this draft?")) run(() => growthApi.deleteQuote(quote._id)); }} className="ml-auto rounded-full px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Delete draft</button></div>
      ) : quote.status === "sent" ? (
        <button type="button" disabled={busy} onClick={() => { if (window.confirm("Withdraw this quote? The customer will be told.")) run(() => growthApi.withdrawQuote(quote._id)); }} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Withdraw quote</button>
      ) : null)}>
      {quote && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2"><StatusPill tone={quoteStatus[quote.status].tone}>{quoteStatus[quote.status].label}</StatusPill>{quote.validUntil && <span className="text-xs text-gray-500">Valid until {new Date(quote.validUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</span>}</div>
          {quote.declineReason && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Customer&apos;s reason: “{quote.declineReason}”</p>}
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500"><th scope="col" className="py-2 font-semibold">Item</th><th scope="col" className="py-2 text-right font-semibold">Qty</th><th scope="col" className="py-2 text-right font-semibold">Price</th><th scope="col" className="py-2 text-right font-semibold">Amount</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{quote.items.map((item, i) => <tr key={i}><td className="py-2 text-gray-900">{item.description}</td><td className="py-2 text-right tabular-nums">{item.quantity}</td><td className="py-2 text-right tabular-nums">{formatMoney(item.unitPrice)}</td><td className="py-2 text-right font-semibold tabular-nums">{formatMoney(item.amount)}</td></tr>)}</tbody>
          </table>
          <dl className="ml-auto max-w-xs space-y-1 text-sm tabular-nums">
            <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd>{formatMoney(quote.subtotal)}</dd></div>
            {quote.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{formatMoney(quote.discount)}</dd></div>}
            <div className="flex justify-between text-gray-600"><dt>Tax ({quote.taxRate}%)</dt><dd>{formatMoney(quote.tax)}</dd></div>
            <div className="flex justify-between border-t border-gray-200 pt-1 text-base font-bold text-gray-900"><dt>Total</dt><dd>{formatMoney(quote.total)}</dd></div>
          </dl>
          {quote.notes && <p className="whitespace-pre-line rounded-xl bg-gray-50 p-3 text-sm text-gray-700">{quote.notes}</p>}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </div>
      )}
    </Drawer>
  );
}
