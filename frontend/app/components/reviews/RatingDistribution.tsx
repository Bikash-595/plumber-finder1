import type { SourceStats } from "./reviewsApi";

/** Five bars, 5★ to 1★. With `onSelect`, each bar filters the list to that star rating. */
export default function RatingDistribution({ stats, selected, onSelect }: { stats: SourceStats; selected?: number | null; onSelect?: (star: number | null) => void }) {
  return (
    <div className="space-y-1">
      {([5, 4, 3, 2, 1] as const).map((star) => {
        const count = stats.distribution[star];
        const bar = (
          <>
            <span className="w-3 text-gray-600">{star}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><span className="block h-full rounded-full bg-[#FFD60A]" style={{ width: `${stats.count ? (count / stats.count) * 100 : 0}%` }} /></span>
            <span className="w-7 text-right tabular-nums text-gray-500">{count}</span>
          </>
        );
        return onSelect ? (
          <button key={star} type="button" onClick={() => onSelect(selected === star ? null : star)} aria-pressed={selected === star} aria-label={`${star} stars: ${count} reviews. Show only these`}
            className={`flex w-full items-center gap-2 rounded px-1 text-xs ${selected === star ? "bg-[#FFD60A]/20" : "hover:bg-gray-50"}`}>{bar}</button>
        ) : <div key={star} className="flex items-center gap-2 px-1 text-xs" aria-label={`${star} stars: ${count} reviews`}>{bar}</div>;
      })}
    </div>
  );
}
