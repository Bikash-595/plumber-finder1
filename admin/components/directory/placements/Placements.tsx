"use client";

import { useState } from "react";
import { Panel } from "@/components/AdminData";
import { adminApi, formatDate, type DirectoryConfig, type Placement } from "@/lib/adminApi";
import { plainPlacements } from "../configLists";
import LocationPicker from "../LocationPicker";
import { useLocations } from "../useLocations";
import ListingSearch, { type ListingHit } from "./ListingSearch";

const field = "rounded-xl border border-gray-200 px-3 py-2 text-sm";

/**
 * Featured and sponsored placements: shown in their own labelled box on the pages of a place (the USA, a state and
 * its cities, or one city) until their end date. They never change the ranked order.
 */
export default function Placements({ config, onSaved }: { config: DirectoryConfig; onSaved: (config: DirectoryConfig) => void }) {
  const [place, setPlace] = useState({ state: "usa", city: "" });
  const { states, cities } = useLocations(place.state);
  const [listing, setListing] = useState<ListingHit | null>(null);
  const [kind, setKind] = useState<Placement["kind"]>("sponsored");
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  // "Now" for the ended / until labels, fixed when the tab opens (render stays pure).
  const [now] = useState(() => Date.now());

  const save = async (placements: Placement[], message: string) => {
    setBusy(true);
    try {
      onSaved((await adminApi.saveDirectoryConfig({ placements })).data);
      setNotice({ tone: "ok", text: message });
      return true;
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); return false; } finally { setBusy(false); }
  };
  const add = async () => {
    if (!listing) return;
    const stateCode = place.state === "usa" ? null : states.find((item) => item.slug === place.state)?.code ?? null;
    const placement: Placement = { providerType: listing.providerType, listingId: listing.id, kind, stateCode, citySlug: stateCode && place.city ? place.city : null, until: until ? new Date(`${until}T23:59:59Z`).toISOString() : null, note: note.trim() };
    if (await save([...plainPlacements(config), placement], `${listing.name} added.`)) { setListing(null); setUntil(""); setNote(""); }
  };
  const remove = (index: number) => save(plainPlacements(config).filter((_, i) => i !== index), "Placement removed.");
  const scopeLabel = (item: Placement) => (!item.stateCode ? "USA pages" : item.citySlug ? `${item.citySlug.replace(/-/g, " ")}, ${item.stateCode}` : `${states.find((s) => s.code === item.stateCode)?.name ?? item.stateCode} + its cities`);
  const expired = (item: Placement) => Boolean(item.until && new Date(item.until).getTime() < now);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Featured & sponsored placements" description={`Up to ${config.settings.sponsoredSlots} per page (change it under Ranking settings). Always labelled; never part of the ranked order.`}>
        {config.settings.placements.length ? (
          <ul className="divide-y divide-gray-100 text-sm">
            {config.settings.placements.map((item, index) => (
              <li key={`${item.listingId}-${index}`} className="flex flex-wrap items-center gap-3 py-3">
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${item.kind === "featured" ? "bg-sky-100 text-sky-800" : "bg-[#FFD60A] text-[#0b1f3b]"}`}>{item.kind}</span>
                <span className="min-w-0 flex-1"><b className="text-gray-900">{item.name ?? item.listingId}</b> <span className="text-xs capitalize text-gray-500">· {scopeLabel(item)}{item.note ? ` · ${item.note}` : ""}</span></span>
                <span className={`text-xs ${expired(item) ? "font-bold text-red-600" : "text-gray-500"}`}>{item.until ? `${expired(item) ? "Ended" : "Until"} ${formatDate(item.until)}` : "No end date"}</span>
                <button type="button" disabled={busy} onClick={() => remove(index)} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Remove</button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">No placements yet.</p>}
      </Panel>
      <Panel title="Add a placement" description="Any published listing can be placed; premium is not required.">
        <div className="space-y-3">
          <ListingSearch value={listing} onPick={setListing} />
          <div className="flex flex-wrap gap-2"><LocationPicker states={states} cities={cities} state={place.state} city={place.city} onChange={setPlace} /></div>
          <div className="grid grid-cols-2 gap-2">
            <select aria-label="Kind" value={kind} onChange={(e) => setKind(e.target.value as Placement["kind"])} className={field}><option value="sponsored">Sponsored</option><option value="featured">Featured</option></select>
            <input type="date" aria-label="End date" value={until} onChange={(e) => setUntil(e.target.value)} className={field} />
          </div>
          <input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Note (invoice, campaign…)" className={`${field} w-full`} />
          {notice && <p className={`rounded-xl px-4 py-3 text-sm ${notice.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
          <button type="button" disabled={!listing || busy} onClick={add} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">Add placement</button>
        </div>
      </Panel>
    </div>
  );
}
