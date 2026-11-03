"use client";

import { useEffect, useState } from "react";
import { providerApi, type ProviderBase, type ProviderBooking } from "@/components/bookings/bookingsApi";
import Drawer from "@/components/dashboard/ui/Drawer";
import { formatMoney } from "../companyApi";
import { growthApi, previewTotals, type Quote, type QuoteLine } from "../growthApi";
import LineItemsEditor from "./LineItemsEditor";
import { apiBase } from "@/components/utils/providerSide";

const field = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const inDays = (days: number) => new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
const quotable = (b: ProviderBooking) => !["declined", "cancelled", "completed"].includes(b.status);

/** Create or edit a quote for a booking: lines, discount, tax, validity and a note; save as a draft or send. */
export default function QuoteBuilder({ open, draft, bookingId, onClose, onSaved }: { open: boolean; draft?: Quote | null; bookingId?: string | null; onClose: () => void; onSaved: (quote: Quote, message: string) => void }) {
  const [bookings, setBookings] = useState<ProviderBooking[] | null>(null);
  const [form, setForm] = useState(() => ({
    bookingId: draft?.booking ?? bookingId ?? "", title: draft?.title ?? "",
    items: (draft?.items.map(({ description, quantity, unitPrice }) => ({ description, quantity, unitPrice })) ?? [{ description: "", quantity: 1, unitPrice: 0 }]) as QuoteLine[],
    discount: draft?.discount ?? 0, taxRate: draft?.taxRate ?? 0, notes: draft?.notes ?? "", validUntil: draft?.validUntil?.slice(0, 10) ?? inDays(14),
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!open || draft) return;
    providerApi.list(apiBase() as ProviderBase, { page: 1 }).then((res) => setBookings(res.data.filter(quotable))).catch(() => setBookings([]));
  }, [open, draft]);
  const totals = previewTotals(form.items, form.discount, form.taxRate);

  const save = async (send: boolean) => {
    if (!form.bookingId) return setError("Choose the booking this quote is for.");
    if (form.items.some((item) => !item.description.trim())) return setError("Give every line a description.");
    if (send && totals.total <= 0) return setError("The quote total must be more than $0 to send it.");
    setBusy(true);
    setError("");
    try {
      const body = { title: form.title.trim(), items: form.items.map((i) => ({ description: i.description.trim(), quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })), discount: Number(form.discount) || 0, taxRate: Number(form.taxRate) || 0, notes: form.notes.trim(), validUntil: form.validUntil || null };
      let result = draft ? await growthApi.updateQuote(draft._id, body) : await growthApi.createQuote({ ...body, bookingId: form.bookingId, send });
      if (draft && send) result = await growthApi.sendQuote(draft._id);
      onSaved(result.data, result.message ?? "Saved.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save the quote."); } finally { setBusy(false); }
  };

  return (
    <Drawer open={open} onClose={onClose} title={draft ? `Edit ${draft.number}` : "New quote"} subtitle="The customer can accept it from their dashboard; the total becomes the booking price."
      footer={<div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => save(true)} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-bold text-white disabled:opacity-60">{busy ? "Saving…" : "Send to customer"}</button>
        <button type="button" disabled={busy} onClick={() => save(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60">Save draft</button>
        <span className="ml-auto text-lg font-bold tabular-nums text-gray-900">{formatMoney(totals.total)}</span>
      </div>}>
      <div className="space-y-5">
        {!draft && (
          <label className="block text-sm font-medium text-gray-700">Booking
            <select value={form.bookingId} onChange={(e) => setForm({ ...form, bookingId: e.target.value })} className={field}>
              <option value="">{bookings ? "Choose a booking" : "Loading bookings…"}</option>
              {bookings?.map((b) => <option key={b._id} value={b._id}>{b.reference} · {b.service} · {b.customerName ?? "Customer"}</option>)}
            </select>
          </label>
        )}
        <label className="block text-sm font-medium text-gray-700">Title <span className="font-normal text-gray-400">(optional)</span>
          <input value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Kitchen repipe" className={field} />
        </label>
        <div><p className="mb-2 text-sm font-medium text-gray-700">Line items</p><LineItemsEditor items={form.items} onChange={(items) => setForm({ ...form, items })} /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium text-gray-700">Discount ($)<input type="number" min={0} step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className={field} /></label>
          <label className="text-sm font-medium text-gray-700">Tax rate (%)<input type="number" min={0} max={25} step="0.01" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} className={field} /></label>
          <label className="text-sm font-medium text-gray-700">Valid until<input type="date" min={inDays(0)} value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className={field} /></label>
        </div>
        <dl className="ml-auto max-w-xs space-y-1 rounded-xl bg-gray-50 p-4 text-sm tabular-nums">
          <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
          {totals.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{formatMoney(totals.discount)}</dd></div>}
          <div className="flex justify-between text-gray-600"><dt>Tax ({form.taxRate || 0}%)</dt><dd>{formatMoney(totals.tax)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-1 font-bold text-gray-900"><dt>Total</dt><dd>{formatMoney(totals.total)}</dd></div>
        </dl>
        <label className="block text-sm font-medium text-gray-700">Note to the customer <span className="font-normal text-gray-400">(optional)</span>
          <textarea rows={3} maxLength={2000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="What's included, warranty, payment terms…" className={field} />
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
    </Drawer>
  );
}
