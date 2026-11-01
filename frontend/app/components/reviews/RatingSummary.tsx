import type { ReactNode } from "react";
import { Stars } from "./Stars";

/** One source's headline rating: the average, stars and how many reviews it's based on. */
export default function RatingSummary({ label, icon, average, count, countLabel = "review", children, loading }: { label: string; icon?: ReactNode; average: number | null | undefined; count: number; countLabel?: string; children?: ReactNode; loading?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">{icon}{label}</p>
      {loading ? <div className="mt-3 h-20 animate-pulse rounded-xl bg-gray-100" /> : (
        <div className="mt-2 flex items-end gap-3">
          <p className="text-4xl font-extrabold tabular-nums text-gray-900">{count && average ? average.toFixed(1) : "–"}</p>
          <div className="pb-1"><Stars value={average ?? 0} size="h-3.5 w-3.5" /><p className="text-xs text-gray-500">{count.toLocaleString()} {countLabel}{count === 1 ? "" : "s"}</p></div>
        </div>
      )}
      {!loading && children}
    </div>
  );
}
