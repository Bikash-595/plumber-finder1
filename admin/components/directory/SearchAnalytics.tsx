"use client";

import { useState } from "react";
import { Panel, useAdminQuery } from "@/components/AdminData";
import { adminApi } from "@/lib/adminApi";

const intentLabels: Record<string, string> = { ranking: "Top 10 / Top 50", "service-location": "Service in a place", location: "Plumbers in a place", service: "Service only", nearby: "Near me", "unknown-location": "Unknown place", keyword: "Name / other" };

function List({ title, rows, empty = "No searches yet." }: { title: string; rows: { label: string; count: number }[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <Panel title={title}>
      {rows.length ? (
        <ol className="space-y-2 text-sm">
          {rows.map((row) => (
            <li key={row.label} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-3">
              <span className="min-w-0"><span className="block truncate text-gray-800">{intentLabels[row.label] ?? row.label}</span><span className="mt-1 block h-1.5 rounded-full bg-gray-100"><span className="block h-full rounded-full bg-[#0b1f3b]" style={{ width: `${(row.count / max) * 100}%` }} /></span></span>
              <span className="text-right font-semibold tabular-nums text-gray-700">{row.count}</span>
            </li>
          ))}
        </ol>
      ) : <p className="text-sm text-gray-500">{empty}</p>}
    </Panel>
  );
}

/** What visitors search for on the site, and the searches that found nothing (logged when a search is submitted). */
export default function SearchAnalytics() {
  const [days, setDays] = useState(30);
  const { data, error, loading } = useAdminQuery(`search-stats|${days}`, () => adminApi.searchStats(days));
  const stats = data?.data;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {[7, 30, 90].map((value) => <button key={value} type="button" onClick={() => setDays(value)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${days === value ? "bg-[#0b1f3b] text-white" : "border border-gray-200 text-gray-700"}`}>Last {value} days</button>)}
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading && !stats ? <div className="h-32 animate-pulse rounded-2xl bg-gray-100" /> : stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[["Searches", stats.searches], ["Found nothing", stats.noResults], ["Top 10 searches", stats.top10], ["Top 50 searches", stats.top50]].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"><p className="text-sm font-semibold text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">{value}</p></div>
            ))}
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <List title="Most searched" rows={stats.queries} />
            <List title="Searches that found nothing" rows={stats.noResultQueries} empty="Every search found something." />
            <List title="What people looked for" rows={stats.intents} />
            <List title="Services" rows={stats.services} />
            <List title="States" rows={stats.states} />
            <List title="Cities" rows={stats.cities} />
          </div>
        </>
      )}
    </div>
  );
}
