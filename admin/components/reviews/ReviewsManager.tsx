"use client";

import { useState } from "react";
import { Pager, Panel, useAdminQuery } from "@/components/AdminData";
import { adminApi } from "@/lib/adminApi";
import ReviewRow from "./ReviewRow";
import { tabs, field } from "./reviewLabels";

export default function ReviewsManager() {
  const [status, setStatus] = useState("pending");
  const [filters, setFilters] = useState({ search: "", source: "", providerType: "", rating: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const set = (change: Partial<typeof filters>) => { setFilters((current) => ({ ...current, ...change })); setPage(1); };
  const key = `reviews|${status}|${Object.values(filters).join("|")}|${page}`;
  const { data, error, loading, reload } = useAdminQuery(key, () => adminApi.reviews({ status: status === "all" ? undefined : status, ...filters, page }));
  return (
    <Panel title="PlumberFinder reviews" description="Reviews with links, flagged words or text copied from another customer — and reviews reported by three people — are held here. Every decision needs a reason, is logged, and is sent to the reviewer. Ratings and text are never edited. Google reviews aren't stored here.">
      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {tabs.map((tab) => (
          <button key={tab.value} type="button" role="tab" aria-selected={status === tab.value} onClick={() => { setStatus(tab.value); setPage(1); }} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${status === tab.value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            {tab.label}{data?.counts && tab.value !== "all" && <span className="ml-1 text-xs opacity-70">{data.counts[tab.value] ?? 0}</span>}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={filters.search} onChange={(e) => set({ search: e.target.value })} placeholder="Search text, customer, plumber, booking…" aria-label="Search reviews" className={`${field} w-full sm:w-72`} />
        <select value={filters.source} onChange={(e) => set({ source: e.target.value })} aria-label="Source" className={field}><option value="">All sources</option><option value="verified_booking">Verified bookings</option><option value="directory">Directory</option></select>
        <select value={filters.providerType} onChange={(e) => set({ providerType: e.target.value })} aria-label="Plumber type" className={field}><option value="">Companies & freelancers</option><option value="company">Companies</option><option value="freelancer">Freelancers</option></select>
        <select value={filters.rating} onChange={(e) => set({ rating: e.target.value })} aria-label="Stars" className={field}><option value="">All stars</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
        <label className="flex items-center gap-1 text-xs text-gray-600">From<input type="date" value={filters.from} onChange={(e) => set({ from: e.target.value })} className={field} /></label>
        <label className="flex items-center gap-1 text-xs text-gray-600">To<input type="date" value={filters.to} onChange={(e) => set({ to: e.target.value })} className={field} /></label>
      </div>
      {notice && <p role="status" className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {loading && !data && <p className="py-6 text-center text-sm text-gray-500">Loading…</p>}
      {data && data.data.length === 0 && <p className="mt-4 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">Nothing here.</p>}
      <ul className="divide-y divide-gray-100">{data?.data.map((review) => <ReviewRow key={review._id} review={review} onDone={(text) => { setNotice(text); reload(); }} />)}</ul>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
    </Panel>
  );
}
