"use client";

import { Panel } from "@/components/AdminData";

const intentLabels: Record<string, string> = { ranking: "Top 10 / Top 50", "service-location": "Service in a place", location: "Plumbers in a place", service: "Service only", nearby: "Near me", "unknown-location": "Unknown place", keyword: "Name / other" };

export default function SearchTermList({ title, rows, empty = "No searches yet." }: { title: string; rows: { label: string; count: number }[]; empty?: string }) {
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
