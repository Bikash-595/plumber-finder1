"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/AdminData";
import { adminApi, formatDate, type ProviderActivityDetail } from "@/lib/adminApi";
import ActivityList from "./ActivityList";
import Tile from "./Tile";
import { FRONTEND_URL, bookingLabels, when, n } from "./activityFormat";

/** One plumber: totals, the last 30 days, customers who booked, bookings, and every activity. */
export default function ProviderDrawer({ type, id, onClose }: { type: string; id: string; onClose: () => void }) {
  const [data, setData] = useState<ProviderActivityDetail | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"customers" | "bookings" | "activity">("customers");
  useEffect(() => {
    let live = true;
    adminApi.activityProvider(type, id).then(({ data: detail }) => live && setData(detail)).catch((caught: Error) => live && setError(caught.message));
    return () => { live = false; };
  }, [type, id]);
  useEffect(() => { const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);
  const peak = Math.max(1, ...(data?.daily ?? []).map((d) => Math.max(d.profileViews, d.bookings)));

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Plumber activity" onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{data?.providerType === "freelancer" ? "Freelancer" : "Plumbing company"}{data?.sample ? " · sample" : ""}</p>
            <h2 className="truncate text-lg font-bold text-gray-900">{data?.name ?? "Loading…"}</h2>
            {data && <p className="text-xs text-gray-500">{data.location || "—"} · <a href={`${FRONTEND_URL}${data.url}`} target="_blank" rel="noreferrer" className="font-semibold text-[#0b1f3b] underline">View profile</a></p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-5">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {data && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Tile label="Profile visits" value={data.profileViews} hint="Once per person per 30 minutes" />
                <Tile label="Visitors" value={data.visitors} hint="Different people" />
                <Tile label="Bookings" value={data.bookings} />
                <Tile label="Customers" value={data.customers} hint={`${data.repeatCustomers} booked more than once`} />
                <Tile label="Project views" value={data.projectViews} />
                <Tile label="Blog reads" value={data.blogReads} />
                <Tile label="Compared / saved" value={`${n(data.compareAdds)} / ${n(data.saves)}`} />
                <Tile label="Contact clicks" value={data.contactClicks} hint="Call, email, website" />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-800">{data.pendingBookings} waiting</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">{data.acceptedBookings} accepted</span>
                <span className="rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">{data.declinedBookings} declined</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600">{data.cancelledBookings} cancelled</span>
              </div>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Last 30 days</h3>
                <div className="mt-2 flex h-32 items-end gap-1 rounded-xl border border-gray-100 p-3" role="img" aria-label="Daily profile visits and bookings for the last 30 days">
                  {data.daily.map((day) => (
                    <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-0.5" title={`${day.date}: ${day.profileViews} visits, ${day.bookings} bookings`}>
                      <div className="w-full rounded-t bg-sky-400" style={{ height: `${(day.profileViews / peak) * 100}%`, minHeight: day.profileViews ? 2 : 0 }} />
                      <div className="w-full rounded-t bg-[#FFD60A]" style={{ height: `${(day.bookings / peak) * 100}%`, minHeight: day.bookings ? 2 : 0 }} />
                    </div>
                  ))}
                </div>
                <p className="mt-1 flex gap-4 text-xs text-gray-500"><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-sky-400" />Visits</span><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#FFD60A]" />Bookings</span></p>
              </section>
              <div className="flex gap-2" role="tablist">
                {([["customers", `Customers who booked (${data.customers})`], ["bookings", `Bookings (${data.bookings})`], ["activity", `Activity (${data.activity.length})`]] as const).map(([key, label]) => (
                  <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${tab === key ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{label}</button>
                ))}
              </div>
              {tab === "customers" && (data.customerList.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead><tr className="text-xs uppercase tracking-wide text-gray-500"><th className="py-2 pr-3">Customer</th><th className="px-3 py-2 text-right">Bookings</th><th className="px-3 py-2">Outcome</th><th className="px-3 py-2">First</th><th className="py-2 pl-3">Last</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.customerList.map((c) => (
                        <tr key={c.userId}>
                          <td className="py-2 pr-3"><p className="font-medium text-gray-900">{c.name}</p><p className="text-xs text-gray-500">{c.email}</p><p className="text-xs text-gray-400">{c.services.join(", ")}</p></td>
                          <td className="px-3 py-2 text-right font-bold text-gray-900">{c.bookings}{c.bookings > 1 && <span className="ml-1 rounded bg-emerald-50 px-1 text-[10px] font-bold text-emerald-700">REPEAT</span>}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{c.accepted} accepted · {c.declined} declined</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{formatDate(c.firstBooking)}</td>
                          <td className="py-2 pl-3 text-xs text-gray-600">{formatDate(c.lastBooking)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Nobody has booked yet.</p>)}
              {tab === "bookings" && (data.bookingList.length ? (
                <ul className="divide-y divide-gray-100">
                  {data.bookingList.map((b) => (
                    <li key={b._id} className="flex flex-wrap items-start justify-between gap-2 py-2.5 text-sm">
                      <div><p className="font-medium text-gray-900">{b.service} <span className="font-mono text-xs text-gray-400">{b.reference}</span></p><p className="text-xs text-gray-500">{b.customerName} · {b.customerEmail} · booked {when(b.createdAt)}{b.scheduledDate ? ` · visit ${formatDate(b.scheduledDate)}` : ""}</p>{b.responseNote && <p className="text-xs text-gray-500">“{b.responseNote}”</p>}</div>
                      <StatusBadge value={b.status} label={bookingLabels[b.status]} />
                    </li>
                  ))}
                </ul>
              ) : <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No bookings yet.</p>)}
              {tab === "activity" && <ActivityList items={data.activity} showPlumber={false} />}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
