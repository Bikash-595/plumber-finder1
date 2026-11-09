"use client";

import { useEffect, useState } from "react";
import { DataTable, Panel } from "@/components/AdminData";
import { FRONTEND_URL as siteUrl } from "@/lib/siteUrls";
import { adminApi, type DirectoryConfig, type DirectoryPreview, type PreviewRow, type RankingExclusion } from "@/lib/adminApi";
import LocationPicker from "./LocationPicker";
import { useLocations } from "./useLocations";


/** Rank the USA or any state / city / service with every score explained; exclude listings from (or restore them to) the rankings. */
export default function RankingPreview({ config, onSaved }: { config: DirectoryConfig; onSaved: (config: DirectoryConfig) => void }) {
  const [filters, setFilters] = useState({ state: "usa", city: "", service: "", limit: 10 });
  const { states, cities, error: locationError } = useLocations(filters.state);
  const [preview, setPreview] = useState<DirectoryPreview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filters.state) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      adminApi.directoryPreview({ state: filters.state, city: filters.city || undefined, service: filters.service || undefined, limit: filters.limit })
        .then(({ data }) => { if (!cancelled) { setPreview(data); setError(""); } })
        .catch((caught: Error) => { if (!cancelled) setError(caught.message); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [filters, config.updatedAt]);

  const saveExclusions = async (exclusions: RankingExclusion[]) => {
    try { onSaved((await adminApi.saveDirectoryConfig({ exclusions })).data); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save."); }
  };
  const exclude = (row: PreviewRow) => {
    const reason = window.prompt(`Remove ${row.name} from every ranking? Reason (kept in the history):`);
    if (reason !== null) saveExclusions([...config.settings.exclusions.map(({ providerType, listingId, reason: why }) => ({ providerType, listingId, reason: why })), { providerType: row.providerType, listingId: row.listingId, reason: reason.trim() }]);
  };
  const restore = (listingId: string) => saveExclusions(config.settings.exclusions.filter((item) => item.listingId !== listingId).map(({ providerType, listingId: id, reason }) => ({ providerType, listingId: id, reason })));
  // The public page for the current (all-services) preview.
  const pagePath = () => (filters.state === "usa" ? `/top-${filters.limit}-plumbers-usa` : `/top-${filters.limit}-plumbers/${filters.state}${filters.city ? `/${filters.city}` : ""}`);

  const row = (item: PreviewRow, actions: React.ReactNode) => (
    <tr key={item.listingId} className="border-b border-gray-100 align-top hover:bg-gray-50">
      <td className="px-4 py-3 font-bold tabular-nums text-gray-900">{item.position ?? "—"}</td>
      <td className="px-4 py-3"><p className="font-medium text-gray-900">{item.name}{item.verified && <span className="ml-1.5 rounded-full bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-700">verified</span>}{item.premium && <span className="ml-1.5 rounded-full bg-amber-50 px-1.5 text-[10px] font-bold text-amber-800">premium</span>}</p><p className="text-xs text-gray-500">{item.providerType} · {[item.city, item.stateCode].filter(Boolean).join(", ") || "—"}</p></td>
      <td className="px-4 py-3 tabular-nums text-gray-700">{item.rating ? `${item.rating} (${item.reviews})` : "—"}</td>
      <td className="px-4 py-3 tabular-nums text-gray-700">{item.completedJobs ?? 0}</td>
      <td className="px-4 py-3"><p className="font-bold tabular-nums text-gray-900">{item.score.toFixed(1)}</p><p className="text-[11px] text-gray-500">{item.breakdown.map((factor) => `${factor.key} ${factor.points.toFixed(1)}`).join(" · ")}{item.newBusinessPenalty ? ` · new −${item.newBusinessPenalty}%` : ""}</p></td>
      <td className="px-4 py-3">{actions}</td>
    </tr>
  );

  return (
    <div className="space-y-5">
      <Panel title="Preview a ranking" description="Exactly what a Top 10 / Top 50 page shows (premium listings only, verified first), with each score explained.">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <LocationPicker states={states} cities={cities} state={filters.state} city={filters.city} onChange={(place) => setFilters({ ...filters, ...place })} />
          <select aria-label="Service" value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })} className="rounded-full border border-gray-200 px-3 py-1.5"><option value="">All services</option>{config.services.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}</select>
          <select aria-label="List size" value={filters.limit} onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })} className="rounded-full border border-gray-200 px-3 py-1.5"><option value={10}>Top 10</option><option value={50}>Top 50</option></select>
          {preview && <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${preview.seo.isIndexable ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{preview.qualifying} premium qualifying · {preview.otherProviders} free not ranked · {preview.seo.isIndexable ? "indexed" : `noindex (needs ${preview.seo.minimumQualifyingCompanies})`}</span>}
          {preview && !filters.service && <a href={`${siteUrl}${pagePath()}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#0b1f3b] underline">Open page</a>}
        </div>
        {(error || locationError) && <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error || locationError}</p>}
        <DataTable head={["#", "Provider", "Rating", "Jobs", "Score", ""]} loading={loading && !preview} error="" empty={!preview?.items.length}>
          {preview?.items.map((item) => row(item, <button type="button" onClick={() => exclude(item)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">Exclude</button>))}
        </DataTable>
        {preview?.sponsored.length ? <p className="mt-3 text-xs text-gray-500">Placements box: {preview.sponsored.map((item) => `${item.name} (${item.placement})`).join(", ")} — shown apart and labelled, never in the ranked order.</p> : null}
      </Panel>
      <Panel title="Excluded listings" description="Never shown in any ranking until restored. Use for duplicates, fraud or listings under review.">
        {config.settings.exclusions.length ? (
          <ul className="divide-y divide-gray-100 text-sm">
            {config.settings.exclusions.map((item) => (
              <li key={item.listingId} className="flex items-center justify-between gap-3 py-2.5">
                <span><b className="text-gray-900">{item.name}</b> <span className="text-xs text-gray-500">{item.providerType}{item.reason ? ` · ${item.reason}` : ""}</span></span>
                <button type="button" onClick={() => restore(item.listingId)} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">Restore</button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">No listings are excluded.</p>}
      </Panel>
    </div>
  );
}
