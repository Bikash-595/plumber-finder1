"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FaChevronDown, FaCrosshairs, FaMapMarkerAlt, FaPlus, FaSearchLocation, FaTimes, FaTrash } from "react-icons/fa";

// Leaflet needs the browser, so each area's map is loaded on the client only.
const AreaMap = dynamic(() => import("@/components/plumber/AreaMap"), { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-gray-100" /> });

/** One service area as edited in the form (numbers are kept as the text typed). */
export type AreaDraft = { key: string; name: string; address: string; latitude: string; longitude: string; radius: string; services: string[] };

type Props = {
  area: AreaDraft;
  index: number;
  open: boolean;
  /** The company's/freelancer's services (an area with none selected offers all of them). */
  services: string[];
  defaultRadius: number;
  lookupStatus?: "looking" | "missing";
  onToggle: () => void;
  onChange: (changes: Partial<AreaDraft>) => void;
  onRemove: () => void;
  /** Finds coordinates for the area's address (or name); resolves to an error message or null. */
  onLocate: () => Promise<string | null>;
  /** Uses the device location; resolves to an error message or null. */
  onUseMyLocation: () => Promise<string | null>;
  /** Creates a new service in the Services section; resolves to its name, or throws. */
  onCreateService: (name: string) => Promise<string>;
};

const input = "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
export const hasPoint = (area: Pick<AreaDraft, "latitude" | "longitude">) => area.latitude !== "" && area.longitude !== "" && Number.isFinite(Number(area.latitude)) && Number.isFinite(Number(area.longitude));

/**
 * A service area card: name, its own location (address or coordinates, or the device location),
 * radius, the services offered there, and its own map with the radius circle.
 */
export default function ServiceAreaCard({ area, index, open, services, defaultRadius, lookupStatus, onToggle, onChange, onRemove, onLocate, onUseMyLocation, onCreateService }: Props) {
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState("");
  const [newService, setNewService] = useState("");
  const [busy, setBusy] = useState<"" | "locate" | "device" | "service">("");
  const [message, setMessage] = useState("");
  const radius = Number(area.radius) > 0 ? Number(area.radius) : defaultRadius;
  const placed = hasPoint(area);
  const available = services.filter((name) => !area.services.includes(name));
  const label = area.name.trim() || `Service area ${index + 1}`;

  const run = async (kind: "locate" | "device", action: () => Promise<string | null>) => {
    setBusy(kind);
    setMessage("");
    setMessage((await action()) ?? "");
    setBusy("");
  };

  const addPicked = () => {
    if (pick && !area.services.includes(pick)) onChange({ services: [...area.services, pick] });
    setPick("");
  };
  const createService = async () => {
    const name = newService.trim();
    if (!name) return;
    setBusy("service");
    setMessage("");
    try {
      const created = await onCreateService(name);
      if (!area.services.includes(created)) onChange({ services: [...area.services, created] });
      setNewService("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Couldn't add that service.");
    } finally {
      setBusy("");
    }
  };

  return (
    <li className={`overflow-hidden rounded-xl border bg-white transition ${open ? "border-[#0b1f3b] ring-2 ring-[#FFD60A]/40" : "border-gray-200"}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${placed ? "bg-[#f7672c]/10 text-[#f7672c]" : "bg-gray-100 text-gray-400"}`}><FaMapMarkerAlt className="h-4 w-4" /></span>
          <span className="min-w-0">
            <span className="block truncate font-bold text-gray-900">{label}</span>
            <span className="block truncate text-xs text-gray-500">
              {area.services.length ? `${area.services.length} service${area.services.length === 1 ? "" : "s"}` : "Every service"} · {radius} mi radius · {placed ? "on the map" : lookupStatus === "looking" ? "finding on the map…" : "not on the map yet"}
            </span>
          </span>
          <FaChevronDown className={`ml-auto h-3 w-3 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
        <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash className="h-3.5 w-3.5" /></button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-gray-100 bg-gray-50/60 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="text-xs font-semibold text-gray-700">Service area name <span className="text-red-500">*</span></span>
              <input value={area.name} onChange={(e) => onChange({ name: e.target.value, latitude: area.address ? area.latitude : "", longitude: area.address ? area.longitude : "" })} placeholder="e.g. Round Rock or North Austin branch" aria-label={`Area ${index + 1} name`} className={input} />
            </label>
            <label className="sm:col-span-2"><span className="text-xs font-semibold text-gray-700">Base location for this area <span className="font-normal text-gray-400">(address or place)</span></span>
              <input value={area.address} onChange={(e) => onChange({ address: e.target.value, latitude: "", longitude: "" })} placeholder="e.g. 500 Main St, Round Rock, TX" aria-label={`Area ${index + 1} base location`} className={input} />
            </label>
            <label><span className="text-xs font-semibold text-gray-700">Latitude</span>
              <input inputMode="decimal" value={area.latitude} onChange={(e) => onChange({ latitude: e.target.value })} placeholder="e.g. 30.5083" aria-label={`Area ${index + 1} latitude`} className={input} />
            </label>
            <label><span className="text-xs font-semibold text-gray-700">Longitude</span>
              <input inputMode="decimal" value={area.longitude} onChange={(e) => onChange({ longitude: e.target.value })} placeholder="e.g. -97.6789" aria-label={`Area ${index + 1} longitude`} className={input} />
            </label>
            <label><span className="text-xs font-semibold text-gray-700">Service radius (miles)</span>
              <input type="number" min="0" max="500" value={area.radius} onChange={(e) => onChange({ radius: e.target.value })} placeholder={String(defaultRadius)} aria-label={`Area ${index + 1} radius in miles`} className={input} />
            </label>
            <div className="flex flex-wrap items-end gap-2">
              <button type="button" onClick={() => run("locate", onLocate)} disabled={busy !== ""} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-[#FFD60A] disabled:opacity-60"><FaSearchLocation className="h-3 w-3" /> {busy === "locate" ? "Finding…" : "Find on map"}</button>
              <button type="button" onClick={() => run("device", onUseMyLocation)} disabled={busy !== ""} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-[#FFD60A] disabled:opacity-60"><FaCrosshairs className="h-3 w-3" /> {busy === "device" ? "Locating…" : "Use my current location"}</button>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-gray-700">Services offered in this area</p>
              {area.services.length > 0 && <button type="button" onClick={() => onChange({ services: [] })} className="text-xs font-semibold text-gray-500 hover:underline">Offer every service here</button>}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {area.services.length === 0 && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Every service</span>}
              {area.services.map((name) => (
                <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3b] py-1 pl-3 pr-1.5 text-xs font-semibold text-white">
                  {name}
                  <button type="button" onClick={() => onChange({ services: area.services.filter((item) => item !== name) })} aria-label={`Remove ${name} from ${label}`} className="grid h-4 w-4 place-items-center rounded-full bg-white/20 hover:bg-white/40"><FaTimes className="h-2 w-2" /></button>
                </span>
              ))}
              {!adding && <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#0b1f3b] px-3 py-1 text-xs font-bold text-[#0b1f3b] hover:bg-white"><FaPlus className="h-2.5 w-2.5" /> Add service</button>}
            </div>
            {adding && (
              <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-white p-3">
                {available.length > 0 && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select value={pick} onChange={(e) => setPick(e.target.value)} aria-label={`Service to add to ${label}`} className={`${input} mt-0 flex-1`}>
                      <option value="">Choose one of your services…</option>
                      {available.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <button type="button" onClick={addPicked} disabled={!pick} className="rounded-lg bg-[#0b1f3b] px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Add</button>
                  </div>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input value={newService} onChange={(e) => setNewService(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createService(); } }} placeholder="Or create a new service, e.g. Sump Pump Repair" aria-label={`New service for ${label}`} className={`${input} mt-0 flex-1`} />
                  <button type="button" onClick={createService} disabled={!newService.trim() || busy === "service"} className="rounded-lg border border-[#0b1f3b] px-3 py-2 text-xs font-bold text-[#0b1f3b] disabled:opacity-40">{busy === "service" ? "Adding…" : "+ Create & add"}</button>
                </div>
                <button type="button" onClick={() => setAdding(false)} className="text-xs font-semibold text-gray-500 hover:underline">Done</button>
              </div>
            )}
          </div>

          {message && <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">{message}</p>}

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="relative h-56 bg-gray-100">
              {placed ? (
                <AreaMap areas={[{ name: label, latitude: Number(area.latitude), longitude: Number(area.longitude), radiusMiles: radius, serviceCount: area.services.length }]} base={null} selected={label} onSelect={() => undefined} height={224} />
              ) : (
                <p className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-500">{lookupStatus === "looking" ? "Finding this area on the map…" : "Use “Find on map”, your current location, or enter coordinates to place this area."}</p>
              )}
            </div>
            <p className="border-t border-gray-100 bg-white px-3 py-2 text-xs text-gray-500">This area&apos;s own map: the dotted circle shows the {radius}-mile radius you serve from here.</p>
          </div>
        </div>
      )}
    </li>
  );
}
