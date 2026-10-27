"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type ActivityEvent, type ActivityItem, type BookingStatus, type ProviderActivityDetail } from "@/lib/adminApi";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
const eventLabels: Record<ActivityEvent, string> = {
  profile_view: "Visited the profile", project_view: "Viewed a project", blog_read: "Read a blog post", compare_add: "Added to compare", save: "Saved the plumber",
  call_click: "Tapped Call", email_click: "Tapped Email", website_click: "Opened the website", share: "Shared the profile", booking: "Booked",
};
const eventTone: Record<ActivityEvent, string> = {
  profile_view: "bg-sky-50 text-sky-700", project_view: "bg-indigo-50 text-indigo-700", blog_read: "bg-orange-50 text-orange-700", compare_add: "bg-violet-50 text-violet-700", save: "bg-pink-50 text-pink-700",
  call_click: "bg-emerald-50 text-emerald-700", email_click: "bg-emerald-50 text-emerald-700", website_click: "bg-emerald-50 text-emerald-700", share: "bg-gray-100 text-gray-700", booking: "bg-[#FFD60A]/30 text-[#0b1f3b]",
};
const bookingLabels: Record<BookingStatus, string> = { pending: "Waiting", scheduled: "Accepted", completed: "Completed", declined: "Declined", cancelled: "Cancelled" };
const field = "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FFD60A]";
const when = (value: string) => new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const n = (value: number) => value.toLocaleString();

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return <div className="rounded-xl bg-gray-50 p-3" title={hint}><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold text-gray-900">{typeof value === "number" ? n(value) : value}</p></div>;
}

function ActivityList({ items, showPlumber }: { items: ActivityItem[]; showPlumber: boolean }) {
  if (!items.length) return <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No activity yet.</p>;
  return (
    <ol className="divide-y divide-gray-100">
      {items.map((item) => (
        <li key={item._id} className="flex flex-wrap items-start gap-x-3 gap-y-1 py-2.5 text-sm">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${eventTone[item.event]}`}>{eventLabels[item.event]}</span>
          <span className="min-w-0 flex-1 text-gray-700">
            <span className="font-semibold text-gray-900">{item.actor.name}</span>
            {item.actor.type === "guest" ? <span className="text-gray-400"> ({item.actor.guestId})</span> : item.actor.email ? <span className="text-gray-500"> · {item.actor.email}</span> : null}
            {item.actor.type !== "user" && item.actor.type !== "guest" && <span className="ml-1 rounded bg-gray-100 px-1.5 text-[10px] font-semibold uppercase text-gray-600">{item.actor.type}</span>}
            {showPlumber && <span className="text-gray-500"> → {item.providerName ?? `Plumber ${item.providerId}`}</span>}
            {item.target?.title && <span className="block text-xs text-gray-500">“{item.target.title}”</span>}
          </span>
          <time className="shrink-0 text-xs text-gray-400">{when(item.createdAt)}</time>
        </li>
      ))}
    </ol>
  );
}

/** One plumber: totals, the last 30 days, customers who booked, bookings, and every activity. */
function ProviderDrawer({ type, id, onClose }: { type: string; id: string; onClose: () => void }) {
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

function ByPlumber() {
  const params = useSearchParams();
  const router = useRouter();
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const { data, error, loading } = useAdminQuery(`activity|${type}|${search}|${sort}|${page}`, () => adminApi.activityProviders({ type: type === "all" ? undefined : type, search, sort, page }));
  const open = params.get("plumber");
  const t = data?.totals ?? {};
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Tile label="Plumbers" value={t.plumbers ?? 0} /><Tile label="Profile visits" value={t.profileViews ?? 0} /><Tile label="Visitors" value={t.visitors ?? 0} hint="Different people, per plumber" />
        <Tile label="Bookings" value={t.bookings ?? 0} /><Tile label="Customers" value={t.customers ?? 0} hint="Customer–plumber pairs" />
        <Tile label="Project views" value={t.projectViews ?? 0} /><Tile label="Blog reads" value={t.blogReads ?? 0} /><Tile label="Compared" value={t.compareAdds ?? 0} /><Tile label="Saved" value={t.saves ?? 0} /><Tile label="Contact clicks" value={t.contactClicks ?? 0} />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search plumber name…" aria-label="Search plumbers" className={`${field} sm:w-72`} />
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} aria-label="Plumber type" className={field}><option value="all">Companies and freelancers</option><option value="company">Companies</option><option value="freelancer">Freelancers</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by" className={field}><option value="recent">Latest activity</option><option value="views">Most visits</option><option value="visitors">Most visitors</option><option value="bookings">Most bookings</option><option value="customers">Most customers</option></select>
      </div>
      <DataTable head={["Plumber", "Visits", "Projects", "Blogs", "Compared / saved", "Contact", "Bookings", "Customers", "Last activity", ""]} loading={loading} error={error} empty={!data?.data.length}>
        {data?.data.map((r) => (
          <tr key={`${r.providerType}:${r.providerId}`} onClick={() => router.replace(`/activity?plumber=${r.providerType}:${r.providerId}`, { scroll: false })} className="cursor-pointer border-b border-gray-100 align-top hover:bg-gray-50">
            <td className="px-4 py-3"><p className="font-medium text-gray-900">{r.name}</p><p className="text-xs capitalize text-gray-500">{r.providerType}{r.sample ? " · sample" : ""}{r.location ? ` · ${r.location}` : ""}</p></td>
            <td className="px-4 py-3"><p className="font-semibold text-gray-900">{n(r.profileViews)}</p><p className="text-xs text-gray-500">{n(r.visitors)} people</p></td>
            <td className="px-4 py-3 text-gray-700">{n(r.projectViews)}</td>
            <td className="px-4 py-3 text-gray-700">{n(r.blogReads)}</td>
            <td className="px-4 py-3 text-gray-700">{n(r.compareAdds)} / {n(r.saves)}</td>
            <td className="px-4 py-3 text-gray-700">{n(r.contactClicks)}</td>
            <td className="px-4 py-3"><p className="font-semibold text-gray-900">{n(r.bookings)}</p>{r.bookings > 0 && <p className="text-xs text-gray-500">{r.acceptedBookings} ✓ · {r.declinedBookings} ✗ · {r.pendingBookings} waiting</p>}</td>
            <td className="px-4 py-3 text-gray-700">{n(r.customers)}{r.repeatCustomers > 0 && <p className="text-xs text-emerald-700">{r.repeatCustomers} repeat</p>}</td>
            <td className="px-4 py-3 text-xs text-gray-500">{r.lastActivity ? when(r.lastActivity) : "—"}</td>
            <td className="px-4 py-3"><button type="button" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white">Details</button></td>
          </tr>
        ))}
      </DataTable>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
      {open && <ProviderDrawer key={open} type={open.split(":")[0]} id={open.split(":")[1]} onClose={() => router.replace("/activity", { scroll: false })} />}
    </>
  );
}

function LiveActivity() {
  const [event, setEvent] = useState("all");
  const [page, setPage] = useState(1);
  const { data, error, loading } = useAdminQuery(`recent|${event}|${page}`, () => adminApi.recentActivity({ event: event === "all" ? undefined : event, page }));
  return (
    <>
      <select value={event} onChange={(e) => { setEvent(e.target.value); setPage(1); }} aria-label="Activity type" className={field}>
        <option value="all">Everything</option>
        {(Object.keys(eventLabels) as ActivityEvent[]).map((key) => <option key={key} value={key}>{eventLabels[key]}</option>)}
      </select>
      <div className="mt-4">
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {loading && !data ? <p className="py-6 text-center text-sm text-gray-500">Loading…</p> : <ActivityList items={data?.data ?? []} showPlumber />}
      </div>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
    </>
  );
}

function ActivityManager() {
  const [view, setView] = useState<"plumbers" | "live">("plumbers");
  return (
    <Panel title={view === "plumbers" ? "Activity by plumber" : "Live activity"} description="Profile visits count once per person per 30 minutes; plumbers' own visits and search-engine bots aren't counted. Guests are counted per browser.">
      <div className="mb-4 flex gap-2" role="tablist">
        {([["plumbers", "By plumber"], ["live", "Live activity"]] as const).map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={view === key} onClick={() => setView(key)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${view === key ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{label}</button>
        ))}
      </div>
      {view === "plumbers" ? <ByPlumber /> : <LiveActivity />}
    </Panel>
  );
}

export default function AdminActivityPage() {
  return (
    <AdminSectionPage title="Activity" description="Who visited, read, compared, saved, contacted, and booked every plumbing company and freelancer.">
      <Suspense fallback={null}><ActivityManager /></Suspense>
    </AdminSectionPage>
  );
}
