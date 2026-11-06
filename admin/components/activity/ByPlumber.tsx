"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, Pager, useAdminQuery } from "@/components/AdminData";
import { adminApi } from "@/lib/adminApi";
import ProviderDrawer from "./ProviderDrawer";
import Tile from "./Tile";
import { field, when, n } from "./activityFormat";

export default function ByPlumber() {
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
