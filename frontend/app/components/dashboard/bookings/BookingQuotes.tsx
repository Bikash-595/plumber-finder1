"use client";

import { useEffect, useState } from "react";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { formatMoney, userApi, type CustomerQuote } from "@/components/utils/userApi";
import StatusPill from "../ui/StatusPill";

const statusMeta = { sent: { label: "Waiting for you", tone: "warning" }, accepted: { label: "Accepted", tone: "success" }, declined: { label: "Declined", tone: "neutral" }, withdrawn: { label: "Withdrawn", tone: "neutral" }, expired: { label: "Expired", tone: "neutral" } } as const;

/** Quotes the plumber sent for this booking: the lines and total, with Accept / Decline. */
export default function BookingQuotes({ bookingId, onAccepted }: { bookingId: string; onAccepted: () => void }) {
  const [quotes, setQuotes] = useState<CustomerQuote[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    // Any failure (network, or a stale bundle during development) just hides the quotes instead of breaking the page.
    Promise.resolve().then(() => userApi.quotes(bookingId)).then(({ data }) => { if (!cancelled) { setQuotes(data); setOpen(data.find((q) => q.status === "sent")?._id ?? null); } }).catch(() => { if (!cancelled) setQuotes([]); });
    return () => { cancelled = true; };
  }, [bookingId]);
  if (!quotes?.length) return null;

  const answer = async (quote: CustomerQuote, accept: boolean) => {
    const reason = accept ? undefined : window.prompt("Why are you declining? (optional — the plumber will see it)") ?? undefined;
    if (!accept && reason === undefined) return;
    setBusy(true);
    setError("");
    try {
      const { data } = accept ? await userApi.acceptQuote(quote._id) : await userApi.declineQuote(quote._id, reason);
      setQuotes((list) => (list ?? []).map((q) => (q._id === data._id ? data : accept && q.status === "sent" ? { ...q, status: "withdrawn" } : q)));
      if (accept) onAccepted();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not answer the quote."); } finally { setBusy(false); }
  };

  return (
    <div className="mx-5 mb-4 space-y-2 sm:mx-6">
      {quotes.map((quote) => {
        const meta = statusMeta[quote.status] ?? statusMeta.withdrawn;
        return (
          <div key={quote._id} className={`rounded-xl border ${quote.status === "sent" ? "border-[#FFD60A] bg-[#FFD60A]/5" : "border-gray-200 bg-gray-50"}`}>
            <button type="button" onClick={() => setOpen(open === quote._id ? null : quote._id)} aria-expanded={open === quote._id} className="flex w-full items-center gap-3 px-4 py-3 text-left">
              <FaFileInvoiceDollar className="h-4 w-4 shrink-0 text-[#b39200]" />
              <span className="min-w-0 flex-1 text-sm"><span className="font-semibold text-gray-900">{quote.title || "Quote"}</span> <span className="font-mono text-xs text-gray-400">{quote.number}</span></span>
              <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
              <span className="font-bold tabular-nums text-gray-900">{formatMoney(quote.total)}</span>
            </button>
            {open === quote._id && (
              <div className="border-t border-gray-200/70 px-4 py-3 text-sm">
                <ul className="space-y-1">{quote.items.map((item, i) => <li key={i} className="flex justify-between gap-3"><span className="text-gray-700">{item.description} × {item.quantity}</span><span className="tabular-nums">{formatMoney(item.amount)}</span></li>)}</ul>
                <dl className="ml-auto mt-2 max-w-xs space-y-0.5 border-t border-gray-200 pt-2 tabular-nums">
                  {quote.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{formatMoney(quote.discount)}</dd></div>}
                  {quote.tax > 0 && <div className="flex justify-between text-gray-600"><dt>Tax ({quote.taxRate}%)</dt><dd>{formatMoney(quote.tax)}</dd></div>}
                  <div className="flex justify-between font-bold text-gray-900"><dt>Total</dt><dd>{formatMoney(quote.total)}</dd></div>
                </dl>
                {quote.notes && <p className="mt-2 whitespace-pre-line rounded-lg bg-white p-2 text-gray-700">{quote.notes}</p>}
                {quote.validUntil && quote.status === "sent" && <p className="mt-2 text-xs text-gray-500">Valid until {new Date(quote.validUntil).toLocaleDateString(undefined, { month: "long", day: "numeric", timeZone: "UTC" })}</p>}
                {quote.status === "sent" && (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => answer(quote, true)} className="rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Accept quote</button>
                    <button type="button" disabled={busy} onClick={() => answer(quote, false)} className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60">Decline</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
