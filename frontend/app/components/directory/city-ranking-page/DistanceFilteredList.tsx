"use client";

import { useState } from "react";
import RankedProviderCard from "../RankedProviderCard";
import type { RankedProvider } from "../directoryApi";

const RANGES = [5, 10, 25, 50] as const;

/**
 * City pages: the ranked list with a distance filter (miles from the city centre). Everything is rendered on the
 * server first; the filter only hides cards, so the ranking positions never change.
 */
export default function DistanceFilteredList({ items, cityName }: { items: RankedProvider[]; cityName: string }) {
  const [within, setWithin] = useState<number | null>(null);
  const measured = items.some((item) => item.distanceMiles !== undefined);
  // Providers without a mapped location stay visible (they list the city in their service area).
  const shown = within === null ? items : items.filter((item) => item.distanceMiles === undefined || item.distanceMiles <= within);
  const button = (active: boolean) => `rounded-full px-3 py-1.5 text-xs font-bold transition ${active ? "bg-[#0b1f3b] text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:ring-[#0b1f3b]"}`;
  return (
    <div>
      {measured && (
        <div role="group" aria-label="Distance from the city centre" className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Distance from {cityName}:</span>
          <button type="button" aria-pressed={within === null} onClick={() => setWithin(null)} className={button(within === null)}>Any</button>
          {RANGES.map((miles) => <button key={miles} type="button" aria-pressed={within === miles} onClick={() => setWithin(miles)} className={button(within === miles)}>Within {miles} mi</button>)}
        </div>
      )}
      {shown.length ? (
        <ol className="space-y-3">{shown.map((item) => <li key={item.listingId}><RankedProviderCard item={item} /></li>)}</ol>
      ) : (
        <p className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center text-sm text-slate-500">No ranked plumber is mapped within {within} miles. <button type="button" onClick={() => setWithin(null)} className="font-bold text-[#0b1f3b] underline">Show all</button></p>
      )}
    </div>
  );
}
