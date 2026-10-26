"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, FilterBar, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, formatMoney, type AdminBookingDetail, type BookingStatus } from "@/lib/adminApi";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
const statuses = [{ value: "all", label: "All" }, { value: "pending", label: "Waiting for plumber" }, { value: "scheduled", label: "Confirmed" }, { value: "completed", label: "Completed" }, { value: "declined", label: "Declined" }, { value: "cancelled", label: "Cancelled" }];
const statusLabels: Record<BookingStatus, string> = { pending: "Waiting for plumber", scheduled: "Confirmed", completed: "Completed", declined: "Declined", cancelled: "Cancelled" };
const historyLabels: Record<BookingStatus, string> = { pending: "Request sent", scheduled: "Accepted", completed: "Completed", declined: "Declined", cancelled: "Cancelled" };
const byLabels = { customer: "Customer", provider: "Plumber", admin: "Admin", system: "System" };
// Mirrors the backend rules: completed, declined, and cancelled are final.
const actions: Record<BookingStatus, { label: string; status: Exclude<BookingStatus, "pending">; tone: string; needsNote?: boolean }[]> = {
  pending: [{ label: "Confirm", status: "scheduled", tone: "bg-blue-600 text-white" }, { label: "Decline", status: "declined", tone: "border border-red-200 text-red-600", needsNote: true }, { label: "Cancel", status: "cancelled", tone: "border border-gray-200 text-gray-700", needsNote: true }],
  scheduled: [{ label: "Complete", status: "completed", tone: "bg-emerald-600 text-white" }, { label: "Cancel", status: "cancelled", tone: "border border-red-200 text-red-600", needsNote: true }],
  completed: [], declined: [], cancelled: [],
};
const fieldClass = "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A]";
const fmtDateTime = (value: string) => new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

/** Side panel: everything about one booking, its timeline, and the admin's actions. */
function BookingDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [booking, setBooking] = useState<AdminBookingDetail | null>(null);
  const [error, setError] = useState("");
  const [action, setAction] = useState<(typeof actions)[BookingStatus][number] | null>(null);
  const [form, setForm] = useState({ note: "", scheduledDate: "", timeSlot: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    adminApi.booking(id).then(({ data }) => live && setBooking(data)).catch((caught: Error) => live && setError(caught.message));
    return () => { live = false; };
  }, [id]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async () => {
    if (!booking || !action) return;
    if (action.needsNote && !form.note.trim()) return setError("Give a reason — the customer and the plumber will see it.");
    if (action.status === "scheduled" && !form.scheduledDate && !booking.scheduledDate) return setError("Choose the visit date to confirm.");
    setBusy(true);
    setError("");
    try {
      await adminApi.setBookingStatus(booking._id, action.status, { note: form.note.trim() || undefined, scheduledDate: form.scheduledDate || undefined, timeSlot: form.timeSlot.trim() || undefined });
      const { data } = await adminApi.booking(booking._id);
      setBooking(data);
      setAction(null);
      onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Booking details" onClick={(event) => event.stopPropagation()} className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div>
            <p className="font-mono text-xs text-gray-500">{booking?.reference ?? "Booking"}</p>
            <h2 className="text-lg font-bold text-gray-900">{booking ? booking.service : "Loading…"}</h2>
            {booking && <div className="mt-1"><StatusBadge value={booking.status} label={statusLabels[booking.status]} /></div>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 text-sm">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{error}</p>}
          {booking && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</h3>
                  <p className="mt-1 font-semibold text-gray-900">{booking.user?.name ?? booking.customerName ?? "Deleted account"}</p>
                  {(booking.user?.email ?? booking.customerEmail) && <a href={`mailto:${booking.user?.email ?? booking.customerEmail}`} className="block break-all text-[#0b1f3b] underline">{booking.user?.email ?? booking.customerEmail}</a>}
                  {booking.phone && <a href={`tel:${booking.phone}`} className="block text-[#0b1f3b] underline">{booking.phone}</a>}
                  {booking.address && <p className="mt-1 text-gray-600">{booking.address}</p>}
                </section>
                <section className="rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Plumber</h3>
                  <p className="mt-1 font-semibold text-gray-900">{booking.providerName} <span className="font-normal capitalize text-gray-500">· {booking.providerType}</span></p>
                  {booking.provider.phone && <p className="text-gray-700">{booking.provider.phone}</p>}
                  {booking.provider.email && <p className="break-all text-gray-700">{booking.provider.email}</p>}
                  <a href={`${FRONTEND_URL}${booking.provider.url}`} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[#0b1f3b] underline">View public profile</a>
                  {!booking.provider.hasAccount && <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-800">Sample plumber with no account — only admins can answer this booking.</p>}
                </section>
              </div>
              <section className="rounded-xl bg-gray-50 p-4">
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div><dt className="text-xs font-semibold uppercase text-gray-500">Visit</dt><dd className="font-medium text-gray-900">{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Flexible"}{booking.timeSlot ? ` · ${booking.timeSlot}` : ""}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase text-gray-500">Booked</dt><dd className="text-gray-900">{fmtDateTime(booking.createdAt)} · {booking.source === "checkout" ? "cart checkout" : "booking request"}</dd></div>
                  {booking.price != null && <div><dt className="text-xs font-semibold uppercase text-gray-500">Price</dt><dd className="text-gray-900">{formatMoney(booking.price * (booking.quantity ?? 1))}</dd></div>}
                  {booking.details && <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase text-gray-500">Customer notes</dt><dd className="whitespace-pre-line text-gray-900">{booking.details}</dd></div>}
                  {booking.responseNote && <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase text-gray-500">Latest message to the customer</dt><dd className="text-gray-900">{booking.responseNote}</dd></div>}
                </dl>
              </section>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Timeline</h3>
                <ol className="mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                  {(booking.history ?? []).map((entry, index) => (
                    <li key={index}>
                      <p className="font-semibold text-gray-900">{historyLabels[entry.status]} <span className="font-normal text-gray-500">· {byLabels[entry.by]} · {fmtDateTime(entry.at)}</span></p>
                      {entry.note && <p className="text-gray-600">“{entry.note}”</p>}
                    </li>
                  ))}
                </ol>
              </section>
              {actions[booking.status].length > 0 && (
                <section className="rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Admin actions</h3>
                  <p className="mt-1 text-xs text-gray-500">The customer and the plumber are notified of any change.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {actions[booking.status].map((item) => (
                      <button key={item.label} type="button" onClick={() => { setAction(item); setForm({ note: "", scheduledDate: booking.scheduledDate?.slice(0, 10) ?? "", timeSlot: booking.timeSlot ?? "" }); setError(""); }} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${item.tone} ${action?.label === item.label ? "ring-2 ring-[#FFD60A]" : ""}`}>{item.label}</button>
                    ))}
                  </div>
                  {action && (
                    <div className="mt-4 space-y-3">
                      {action.status === "scheduled" && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="text-xs font-semibold text-gray-700">Visit date<input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className={fieldClass} /></label>
                          <label className="text-xs font-semibold text-gray-700">Time<input value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} placeholder="e.g. 10:00 AM – 12:00 PM" className={fieldClass} /></label>
                        </div>
                      )}
                      <label className="block text-xs font-semibold text-gray-700">{action.needsNote ? "Reason (required)" : "Message (optional)"}<textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={fieldClass} /></label>
                      <div className="flex gap-2">
                        <button type="button" disabled={busy} onClick={submit} className="rounded-lg bg-[#0b1f3b] px-4 py-2 text-xs font-bold text-white disabled:opacity-60">{busy ? "Saving…" : `${action.label} booking`}</button>
                        <button type="button" onClick={() => setAction(null)} className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100">Back</button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function BookingsManager() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("status");
  const openId = params.get("booking");
  const [status, setStatus] = useState(statuses.some((s) => s.value === initial) ? initial! : "all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery(`bookings|${status}|${search}|${page}`, () => adminApi.bookings({ status: status === "all" ? undefined : status, search, page }));
  const counts = data?.counts;
  const open = (id: string | null) => router.replace(id ? `/bookings?booking=${id}` : "/bookings", { scroll: false });

  return (
    <Panel title="All bookings" description="Every booking between customers and plumbers. Plumbers accept or decline their own requests; you can step in for any booking.">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statuses.slice(1).map((item) => (
          <button key={item.value} type="button" onClick={() => { setStatus(item.value); setPage(1); }} className={`rounded-xl border p-3 text-left transition hover:shadow-sm ${status === item.value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white"}`}>
            <p className="text-xl font-bold">{counts ? counts[item.value as BookingStatus] : "–"}</p>
            <p className={`text-xs font-semibold ${status === item.value ? "text-white/80" : "text-gray-500"}`}>{item.label}</p>
          </button>
        ))}
      </div>
      <FilterBar search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status={status} onStatus={(value) => { setStatus(value); setPage(1); }} statuses={statuses} placeholder="Search reference, customer, plumber, service…" />
      <DataTable head={["Reference", "Customer", "Plumber", "Service", "Visit", "Status", ""]} loading={loading} error={error} empty={!data?.data.length}>
        {data?.data.map((booking) => (
          <tr key={booking._id} onClick={() => open(booking._id)} className="cursor-pointer border-b border-gray-100 align-top hover:bg-gray-50">
            <td className="px-4 py-3"><p className="font-mono text-xs font-semibold text-gray-700">{booking.reference ?? "—"}</p><p className="text-xs text-gray-400">{formatDate(booking.createdAt)}</p></td>
            <td className="px-4 py-3"><p className="font-medium text-gray-900">{booking.user?.name ?? booking.customerName ?? "Deleted account"}</p><p className="text-xs text-gray-500">{booking.user?.email ?? booking.customerEmail}</p></td>
            <td className="px-4 py-3 text-gray-700">{booking.providerName}<p className="text-xs capitalize text-gray-500">{booking.providerType}{booking.providerAccount ? "" : " · sample"}</p></td>
            <td className="px-4 py-3 text-gray-700">{booking.service}{booking.address && <p className="text-xs text-gray-500">{booking.address}</p>}</td>
            <td className="px-4 py-3 text-gray-600">{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Flexible"}{booking.timeSlot && <p className="text-xs text-gray-500">{booking.timeSlot}</p>}</td>
            <td className="px-4 py-3"><StatusBadge value={booking.status} label={statusLabels[booking.status]} /></td>
            <td className="px-4 py-3 text-right"><button type="button" onClick={(event) => { event.stopPropagation(); open(booking._id); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white">View</button></td>
          </tr>
        ))}
      </DataTable>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
      {openId && <BookingDrawer key={openId} id={openId} onClose={() => open(null)} onChanged={reload} />}
    </Panel>
  );
}

export default function AdminBookingsPage() {
  return (
    <AdminSectionPage title="Bookings" description="Every customer booking request and checkout order on the platform.">
      <Suspense fallback={null}><BookingsManager /></Suspense>
    </AdminSectionPage>
  );
}
