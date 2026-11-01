export type ReviewTab = "all" | "plumberfinder" | "google";
export type PlatformFilter = "all" | "directory" | "verified_booking";

/** Source tabs (Google only for companies) and, under PlumberFinder, Directory / Verified sub-filters. */
export default function ReviewTabs({ tab, onTab, filter, onFilter, counts, googleEnabled }: {
  tab: ReviewTab; onTab: (tab: ReviewTab) => void; filter: PlatformFilter; onFilter: (filter: PlatformFilter) => void;
  counts: { all: number; plumberfinder: number; google: number | null; directory: number; verified: number }; googleEnabled: boolean;
}) {
  const tabs: [ReviewTab, string, number | null][] = [["all", "All Reviews", counts.all], ...(googleEnabled ? [["google", "Google Reviews", counts.google] as [ReviewTab, string, number | null]] : []), ["plumberfinder", "PlumberFinder Reviews", counts.plumberfinder]];
  return (
    <div>
      <div className="-mb-px flex gap-1 overflow-x-auto border-b border-gray-200" role="tablist" aria-label="Review source">
        {tabs.map(([key, label, count]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => onTab(key)} className={`shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition ${tab === key ? "border-[#FFD60A] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
            {label}{count !== null && <span className="ml-1 text-xs text-gray-400">{count.toLocaleString()}</span>}
          </button>
        ))}
      </div>
      {tab === "plumberfinder" && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="PlumberFinder review type">
          {([["all", "All platform reviews", counts.plumberfinder], ["directory", "Directory reviews", counts.directory], ["verified_booking", "Verified customers", counts.verified]] as const).map(([key, label, count]) => (
            <button key={key} type="button" aria-pressed={filter === key} onClick={() => onFilter(key)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${filter === key ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
              {label} <span className={filter === key ? "text-white/70" : "text-gray-400"}>{count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
