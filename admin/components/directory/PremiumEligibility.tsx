"use client";

import { useEffect, useState } from "react";
import { DataTable, Panel } from "@/components/AdminData";
import { FRONTEND_URL as siteUrl } from "@/lib/siteUrls";
import { adminApi, formatDate, type DirectoryConfig, type PremiumListing } from "@/lib/adminApi";
import { plainExclusions } from "./configLists";


/**
 * Every listing with an active premium plan (the subscription system sets and expires them) and whether it may
 * rank. Making one ineligible adds it to the excluded listings; plans that end leave the rankings by themselves.
 */
export default function PremiumEligibility({ config, onSaved }: { config: DirectoryConfig; onSaved: (config: DirectoryConfig) => void }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<PremiumListing[] | null>(null);
  const [totals, setTotals] = useState({ total: 0, eligible: 0, verified: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      adminApi.premiumListings({ q: q || undefined })
        .then(({ data }) => { if (!cancelled) { setRows(data.rows); setTotals(data); setError(""); } })
        .catch((caught: Error) => { if (!cancelled) setError(caught.message); });
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [q, config.updatedAt]);

  const save = async (exclusions: ReturnType<typeof plainExclusions>) => {
    try { onSaved((await adminApi.saveDirectoryConfig({ exclusions })).data); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save."); }
  };
  const makeIneligible = (row: PremiumListing) => {
    const reason = window.prompt(`Keep ${row.name} out of every Top 10 / Top 50 ranking? Reason (kept in the history):`);
    if (reason !== null) save([...plainExclusions(config), { providerType: row.providerType, listingId: row.listingId, reason: reason.trim() || "Not eligible" }]);
  };
  const restore = (row: PremiumListing) => save(plainExclusions(config).filter((item) => item.listingId !== row.listingId));

  return (
    <Panel title="Premium eligibility" description="Only active premium plans can rank. Verified premium listings are shown first. Expired plans drop out automatically within a minute.">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search premium listings" aria-label="Search premium listings" className="w-64 rounded-full border border-gray-200 px-3 py-1.5" />
        <span className="ml-auto flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">{totals.total} active plans</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{totals.eligible} eligible</span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-800">{totals.verified} verified & eligible</span>
        </span>
      </div>
      {error && <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <DataTable head={["Listing", "Plan", "Ends", "Status", ""]} loading={rows === null} error="" empty={rows?.length === 0}>
        {rows?.map((row) => (
          <tr key={row.listingId} className="border-b border-gray-100 align-top hover:bg-gray-50">
            <td className="px-4 py-3">
              <a href={`${siteUrl}${row.url}`} target="_blank" rel="noreferrer" className="font-medium text-gray-900 hover:underline">{row.name}</a>
              <p className="text-xs text-gray-500">{row.providerType} · {[row.city, row.stateCode].filter(Boolean).join(", ") || "no location"}</p>
            </td>
            <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${row.tier === "elite" ? "bg-violet-50 text-violet-800" : "bg-amber-50 text-amber-800"}`}>{row.tier}</span></td>
            <td className="px-4 py-3 text-sm text-gray-700">{row.until ? formatDate(row.until) : "—"}{row.expiresSoon && <span className="ml-1.5 rounded-full bg-orange-50 px-1.5 text-[10px] font-bold text-orange-700">within 7 days</span>}</td>
            <td className="px-4 py-3 text-xs">
              {row.eligible
                ? <span className="font-bold text-emerald-700">Eligible{row.verified ? " · verified (ranked first)" : " · not verified"}</span>
                : <span className="font-bold text-red-700">{row.blocked ? "Suspended / rejected" : row.missingLocation ? "No state on the listing" : `Ineligible${row.excludedReason ? ` · ${row.excludedReason}` : ""}`}</span>}
            </td>
            <td className="px-4 py-3 text-right">
              {row.eligible && <button type="button" onClick={() => makeIneligible(row)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">Make ineligible</button>}
              {row.excludedReason !== null && <button type="button" onClick={() => restore(row)} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">Make eligible</button>}
            </td>
          </tr>
        ))}
      </DataTable>
    </Panel>
  );
}
