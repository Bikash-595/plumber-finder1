"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaCheck, FaClock, FaEnvelope, FaHistory, FaMapMarkerAlt, FaPhoneAlt, FaRedo, FaSearch, FaTimes, FaUser } from "react-icons/fa";
import { formatVisitDate, notificationsChanged, providerApi, statusInfo, timeAgo, type BookingList, type BookingStatus, type ProviderBase, type ProviderBooking } from "./bookingsApi";

type Tab = BookingStatus | "all";
const tabs: { value: Tab; label: string }[] = [
  { value: "pending", label: "Requests" },
  { value: "scheduled", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
];
const timeSlots = ["8:00 AM – 10:00 AM", "10:00 AM – 12:00 PM", "1:00 PM – 3:00 PM", "3:00 PM – 5:00 PM", "5:00 PM – 7:00 PM"];
const declineReasons = ["Fully booked on that date", "Outside our service area", "We don't offer this service", "Need more details first"];
const byLabel = { customer: "Customer", provider: "You", admin: "Plumber Finder", system: "System" };
const historyLabel: Record<BookingStatus, string> = { pending: "Request sent", scheduled: "Accepted", completed: "Completed", declined: "Declined", cancelled: "Cancelled" };
const input = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const today = () => new Date().toISOString().slice(0, 10);

type Panel = { id: string; kind: "accept" | "decline" | "cancel" } | null;

/**
 * A plumber's booking inbox (company or freelancer): new requests to accept or decline, confirmed jobs to
 * complete or cancel, and the history of each booking. The customer's contact details appear after accepting.
 */
export default function ProviderBookings({ base }: { base: ProviderBase }) {
  const params = useSearchParams();
  const focusId = params.get("booking");
  const [tab, setTab] = useState<Tab>("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [list, setList] = useState<BookingList | null>(null);
  const [focused, setFocused] = useState<ProviderBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const [form, setForm] = useState({ scheduledDate: "", timeSlot: "", note: "", reason: "" });
  const [busy, setBusy] = useState(false);
  const [historyOpen, setHistoryOpen] = useState<string | null>(null);
  const focusRef = useRef<HTMLLIElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await providerApi.list(base, { status: tab, search, page }));
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [base, tab, search, page]);

  useEffect(() => { const timer = window.setTimeout(load, search ? 300 : 0); return () => window.clearTimeout(timer); }, [load, search]);

  // Opened from a notification (?booking=<id>): show that booking first, on its own tab.
  useEffect(() => {
    if (!focusId) return;
    providerApi.getOne(base, focusId).then(({ data }) => { setFocused(data); setTab(data.status); }).catch(() => undefined);
  }, [base, focusId]);
  useEffect(() => { if (focused) focusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [focused]);

  const open = (booking: ProviderBooking, kind: NonNullable<Panel>["kind"]) => {
    setPanel({ id: booking._id, kind });
    setForm({ scheduledDate: booking.scheduledDate?.slice(0, 10) ?? "", timeSlot: booking.timeSlot ?? "", note: "", reason: "" });
    setNotice("");
  };

  const respond = async (booking: ProviderBooking, action: "accept" | "decline" | "complete" | "cancel") => {
    if (action === "accept" && !form.scheduledDate) return setError("Choose the date of the visit.");
    if ((action === "decline" || action === "cancel") && !form.reason.trim()) return setError("Give a reason — the customer will see it.");
    if (action === "complete" && !window.confirm(`Mark ${booking.reference} (${booking.service}) as completed?`)) return;
    setBusy(true);
    setError("");
    try {
      const body = action === "accept" ? { scheduledDate: form.scheduledDate, timeSlot: form.timeSlot || undefined, note: form.note.trim() || undefined }
        : action === "complete" ? {} : { reason: form.reason.trim() };
      const { data, message } = await providerApi.respond(base, booking._id, action, body);
      setNotice(message ?? "Booking updated.");
      setPanel(null);
      // Follow the booking to its new tab (e.g. Confirmed, where the customer's contact details now show).
      setFocused(data);
      setPage(1);
      if (tab !== "all" && tab !== data.status) setTab(data.status);
      else await load();
      notificationsChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update the booking.");
    } finally {
      setBusy(false);
    }
  };

  const counts = list?.counts;
  const bookings = [...(focused && !list?.data.some((item) => item._id === focused._id) && (tab === "all" || tab === focused.status) ? [focused] : []), ...(list?.data ?? [])];
  const pages = list ? Math.ceil(list.total / list.limit) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">Booking requests from customers. Accept or decline new requests — the customer is notified straight away.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><FaRedo className="h-3 w-3" /> Refresh</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([["pending", "Waiting for your reply", "border-amber-200 bg-amber-50 text-amber-900"], ["scheduled", "Confirmed jobs", "border-blue-200 bg-blue-50 text-blue-900"], ["completed", "Completed", "border-emerald-200 bg-emerald-50 text-emerald-900"], ["declined", "Declined / cancelled", "border-gray-200 bg-gray-50 text-gray-800"]] as const).map(([key, label, tone]) => (
          <button key={key} type="button" onClick={() => { setTab(key); setPage(1); }} className={`rounded-2xl border p-4 text-left transition hover:shadow-sm ${tone}`}>
            <p className="text-2xl font-bold">{counts ? (key === "declined" ? counts.declined + counts.cancelled : counts[key]) : "–"}</p>
            <p className="mt-1 text-xs font-semibold">{label}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Booking status">
          {tabs.map(({ value, label }) => (
            <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => { setTab(value); setPage(1); }} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${tab === value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
              {label}
              {counts && value !== "all" && counts[value] > 0 && <span className={`rounded-full px-1.5 text-xs ${value === "pending" ? "bg-red-500 text-white" : tab === value ? "bg-white/20" : "bg-gray-100 text-gray-600"}`}>{counts[value]}</span>}
            </button>
          ))}
        </div>
        <label className="relative w-full lg:w-72">
          <FaSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search reference, customer, service" aria-label="Search bookings" className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FFD60A]" />
        </label>
      </div>

      {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      {loading && !list && <p className="py-10 text-center text-sm text-gray-500">Loading bookings…</p>}
      {!loading && list && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          {tab === "pending" ? "No new requests. When a customer books you, it appears here and you get a notification." : "No bookings here yet."}
        </div>
      )}

      <ul className="space-y-4">
        {bookings.map((booking) => {
          const status = statusInfo[booking.status];
          const isPanel = panel?.id === booking._id;
          const isFocused = focused?._id === booking._id;
          return (
            <li key={booking._id} ref={isFocused ? focusRef : undefined} className={`scroll-mt-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${isFocused ? "border-[#0b1f3b] ring-2 ring-[#FFD60A]/50" : booking.status === "pending" ? "border-amber-200" : "border-gray-200"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-gray-700">{booking.reference}</span>
                    Received {timeAgo(booking.createdAt)}{booking.source === "checkout" ? " · via checkout" : ""}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-gray-900">{booking.service}{booking.quantity > 1 ? ` × ${booking.quantity}` : ""}</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-600"><FaUser className="h-3 w-3 text-gray-400" aria-hidden /> {booking.customerName ?? "Customer"}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${status.tone}`}>{status.label}</span>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Visit</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900"><FaCalendarAlt className="h-3.5 w-3.5 text-[#f7672c]" aria-hidden /> {formatVisitDate(booking.scheduledDate)}</p>
                  <p className="mt-1 flex items-center gap-2 text-gray-700"><FaClock className="h-3.5 w-3.5 text-[#f7672c]" aria-hidden /> {booking.timeSlot || "Any time"}</p>
                  {booking.price != null && <p className="mt-1 text-gray-700">Price: <span className="font-semibold">${(booking.price * booking.quantity).toFixed(2)}</span>{booking.offer ? ` · offer ${booking.offer}` : ""}</p>}
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer contact</p>
                  {booking.contactVisible ? (
                    <div className="mt-1 space-y-1">
                      {booking.phone && <a href={`tel:${booking.phone}`} className="flex items-center gap-2 font-semibold text-[#0b1f3b] hover:underline"><FaPhoneAlt className="h-3 w-3" aria-hidden /> {booking.phone}</a>}
                      {booking.customerEmail && <a href={`mailto:${booking.customerEmail}`} className="flex items-center gap-2 break-all text-[#0b1f3b] hover:underline"><FaEnvelope className="h-3 w-3 shrink-0" aria-hidden /> {booking.customerEmail}</a>}
                      {booking.address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-gray-700 hover:underline"><FaMapMarkerAlt className="mt-0.5 h-3 w-3 shrink-0" aria-hidden /> {booking.address}</a>}
                      {!booking.phone && !booking.customerEmail && !booking.address && <p className="text-gray-500">No contact details given.</p>}
                    </div>
                  ) : <p className="mt-1 text-gray-500">Phone, email, and address are shared once you accept.</p>}
                </div>
              </div>
              {booking.details && <p className="mt-3 rounded-xl border border-gray-100 p-3 text-sm text-gray-700"><span className="font-semibold text-gray-900">Customer notes: </span><span className="whitespace-pre-line">{booking.details}</span></p>}
              {booking.responseNote && <p className="mt-3 rounded-xl bg-[#FFD60A]/10 p-3 text-sm text-gray-800"><span className="font-semibold">{booking.status === "declined" ? "Decline reason" : booking.status === "cancelled" ? "Cancellation reason" : "Your message"}: </span>{booking.responseNote}</p>}

              {/* Answer panels */}
              {isPanel && panel.kind === "accept" && (
                <div className="mt-4 space-y-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                  <p className="text-sm font-bold text-gray-900">Accept {booking.reference}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label><span className="text-xs font-semibold text-gray-700">Visit date <span className="text-red-500">*</span></span><input type="date" min={today()} value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} aria-label="Visit date" className={input} /></label>
                    <label><span className="text-xs font-semibold text-gray-700">Time</span>
                      <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} aria-label="Visit time" className={input}>
                        <option value="">Any time</option>
                        {[...new Set([...(booking.timeSlot ? [booking.timeSlot] : []), ...timeSlots])].map((slot) => <option key={slot}>{slot}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="block"><span className="text-xs font-semibold text-gray-700">Message to the customer (optional)</span><textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Our plumber Sam will call 30 minutes before arriving." aria-label="Message to the customer" className={input} /></label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => respond(booking, "accept")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"><FaCheck className="h-3 w-3" /> {busy ? "Accepting…" : "Confirm booking"}</button>
                    <button type="button" onClick={() => setPanel(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-white">Back</button>
                  </div>
                </div>
              )}
              {isPanel && (panel.kind === "decline" || panel.kind === "cancel") && (
                <div className="mt-4 space-y-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
                  <p className="text-sm font-bold text-gray-900">{panel.kind === "decline" ? "Decline" : "Cancel"} {booking.reference}</p>
                  {panel.kind === "decline" && (
                    <div className="flex flex-wrap gap-2">
                      {declineReasons.map((reason) => <button key={reason} type="button" onClick={() => setForm({ ...form, reason })} className={`rounded-full border px-3 py-1 text-xs font-semibold ${form.reason === reason ? "border-red-400 bg-white text-red-700" : "border-gray-200 bg-white text-gray-700 hover:border-red-300"}`}>{reason}</button>)}
                    </div>
                  )}
                  <label className="block"><span className="text-xs font-semibold text-gray-700">Reason (the customer will see it) <span className="text-red-500">*</span></span><textarea rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} aria-label="Reason" className={input} /></label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => respond(booking, panel.kind)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"><FaTimes className="h-3 w-3" /> {busy ? "Saving…" : panel.kind === "decline" ? "Decline booking" : "Cancel booking"}</button>
                    <button type="button" onClick={() => setPanel(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-white">Back</button>
                  </div>
                </div>
              )}

              {historyOpen === booking._id && (
                <ol className="mt-4 space-y-2 border-l-2 border-gray-200 pl-4">
                  {booking.history.map((entry, index) => (
                    <li key={index} className="relative text-sm">
                      <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0b1f3b]" aria-hidden />
                      <p className="font-semibold text-gray-900">{historyLabel[entry.status]} <span className="font-normal text-gray-500">· {byLabel[entry.by]} · {new Date(entry.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span></p>
                      {entry.note && <p className="text-gray-600">“{entry.note}”</p>}
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                {booking.status === "pending" && !isPanel && (
                  <>
                    <button type="button" onClick={() => open(booking, "accept")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"><FaCheck className="h-3 w-3" /> Accept</button>
                    <button type="button" onClick={() => open(booking, "decline")} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"><FaTimes className="h-3 w-3" /> Decline</button>
                  </>
                )}
                {booking.status === "scheduled" && !isPanel && (
                  <>
                    <button type="button" disabled={busy} onClick={() => respond(booking, "complete")} className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60"><FaCheck className="h-3 w-3" /> Mark completed</button>
                    <button type="button" onClick={() => open(booking, "cancel")} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel booking</button>
                  </>
                )}
                <button type="button" onClick={() => setHistoryOpen(historyOpen === booking._id ? null : booking._id)} className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"><FaHistory className="h-3 w-3" /> {historyOpen === booking._id ? "Hide history" : "History"}</button>
              </div>
            </li>
          );
        })}
      </ul>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button>
          <span className="text-gray-500">Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
