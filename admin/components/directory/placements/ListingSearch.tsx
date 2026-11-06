"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/adminAuth";

export type ListingHit = { id: string; providerType: "company" | "freelancer"; name: string; city: string | null; stateCode: string | null };

/** Find a published listing by name (the public profile search). */
export default function ListingSearch({ value, onPick }: { value: ListingHit | null; onPick: (hit: ListingHit | null) => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<ListingHit[]>([]);
  useEffect(() => {
    if (q.trim().length < 2) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      fetch(`${API_BASE_URL}/search/providers?limit=8&q=${encodeURIComponent(q.trim())}`).then((r) => r.json())
        .then(({ data }) => { if (!cancelled) setHits(data?.results ?? []); }).catch(() => undefined);
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [q]);
  if (value) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm">
        <b className="text-gray-900">{value.name}</b><span className="text-xs text-gray-500">{value.providerType} · {[value.city, value.stateCode].filter(Boolean).join(", ")}</span>
        <button type="button" onClick={() => onPick(null)} className="ml-auto text-xs font-semibold text-gray-500 hover:text-gray-800">Change</button>
      </p>
    );
  }
  return (
    <div className="relative">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a company or plumber by name" aria-label="Listing" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
      {q.trim().length >= 2 && hits.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {hits.map((hit) => (
            <li key={hit.id}><button type="button" onClick={() => { onPick(hit); setQ(""); setHits([]); }} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"><span className="font-medium text-gray-900">{hit.name}</span><span className="text-xs text-gray-500">{[hit.city, hit.stateCode].filter(Boolean).join(", ")}</span></button></li>
          ))}
        </ul>
      )}
    </div>
  );
}
