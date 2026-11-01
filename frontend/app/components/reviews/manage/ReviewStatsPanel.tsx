import RatingDistribution from "../RatingDistribution";
import { Stars } from "../Stars";
import type { InboxSummary } from "./types";

type Shortcut = "unanswered" | "new" | "pending" | "reported";

/** The provider's PlumberFinder rating by source, plus shortcuts to what needs attention. */
export default function ReviewStatsPanel({ summary, onShortcut }: { summary?: InboxSummary; onShortcut: (shortcut: Shortcut) => void }) {
  if (!summary) return <section className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" aria-label="Loading ratings" />;
  const { platform, directory, verified } = summary;
  const tiles: { key: Shortcut; value: number; label: string; tone: string }[] = [
    { key: "unanswered", value: summary.unanswered, label: "Not answered", tone: "bg-gray-50 text-gray-900" },
    { key: "new", value: summary.newThisWeek, label: "New this week", tone: "bg-blue-50 text-blue-900" },
    { key: "pending", value: summary.byStatus.pending ?? 0, label: "Being checked", tone: "bg-amber-50 text-amber-900" },
    { key: "reported", value: summary.reported, label: "Reported", tone: "bg-red-50 text-red-800" },
  ];
  return (
    <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">PlumberFinder platform rating</p>
      <div className="mt-2 flex items-center gap-4">
        <p className="text-5xl font-extrabold tabular-nums text-gray-900">{platform.count ? platform.average.toFixed(1) : "–"}</p>
        <div><Stars value={platform.average} /><p className="mt-1 text-sm text-gray-500">{platform.count} published review{platform.count === 1 ? "" : "s"}</p></div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-emerald-50 px-3 py-2"><p className="font-bold text-emerald-900">{verified.count ? `${verified.average.toFixed(1)}★` : "–"}</p><p className="text-xs text-emerald-800">{verified.count} verified customer review{verified.count === 1 ? "" : "s"}</p></div>
        <div className="rounded-xl bg-[#FFD60A]/15 px-3 py-2"><p className="font-bold text-gray-900">{directory.count ? `${directory.average.toFixed(1)}★` : "–"}</p><p className="text-xs text-gray-700">{directory.count} directory review{directory.count === 1 ? "" : "s"}</p></div>
      </div>
      <div className="mt-3"><RatingDistribution stats={platform} /></div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
        {tiles.map((tile) => <button key={tile.key} type="button" onClick={() => onShortcut(tile.key)} className={`rounded-xl p-2 ${tile.tone}`}><p className="text-lg font-bold tabular-nums">{tile.value}</p>{tile.label}</button>)}
      </div>
    </section>
  );
}
