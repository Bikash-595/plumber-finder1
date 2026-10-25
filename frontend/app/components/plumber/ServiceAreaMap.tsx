"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FaCheck, FaExternalLinkAlt, FaMapPin } from "react-icons/fa";
import { cityPoint } from "@/components/find/distance";
import type { MapArea } from "./AreaMap";

// Leaflet needs the browser, so the map itself is loaded on the client only.
const AreaMap = dynamic(() => import("./AreaMap"), { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-gray-100" /> });

export type ServiceArea = { name: string; services: string[]; address?: string; radius?: number; latitude?: number; longitude?: number };

type Props = {
  areas: ServiceArea[];
  /** Every service the company/freelancer offers (an area with none ticked offers all of them). */
  services: string[];
  ownerName: string;
  /** Base location, e.g. "Austin, TX" — the overview. */
  baseName?: string;
  coordinates?: { lat: number; lng: number };
  /** Miles around the base; also the default for areas without their own radius. */
  baseRadius?: number;
  /** State used to place areas ("Round Rock" → "Round Rock, TX"); read from baseName when not given. */
  state?: string;
  /** Controlled selection (the dashboard form keeps it in step with its list); otherwise internal. */
  selected?: string | null;
  onSelect?: (name: string | null) => void;
  /** Smaller map for the dashboard preview. */
  compact?: boolean;
};

const BASE = "__base__";
const DEFAULT_RADIUS = 10;

/**
 * Areas served, on a map with a dotted circle for each area's service radius. Pick an area (button or
 * circle) to zoom to it and see the services offered there, or pick a service to see which areas offer it.
 * Shared by the public profile and the dashboard form.
 */
export default function ServiceAreaMap({ areas, services, ownerName, baseName = "", coordinates, baseRadius, state, selected, onSelect, compact = false }: Props) {
  const named = areas.filter((area) => area.name.trim());
  const [ownSelection, setOwnSelection] = useState<string>(named[0]?.name ?? BASE);
  const [service, setService] = useState<string | null>(null);
  const current = selected === undefined ? ownSelection : selected ?? BASE;
  const select = (name: string | null) => (onSelect ? onSelect(name) : setOwnSelection(name ?? BASE));

  const region = state || baseName.split(",")[1]?.trim() || "";
  const defaultRadius = baseRadius && baseRadius > 0 ? baseRadius : DEFAULT_RADIUS;
  // An area with no services ticked offers every service.
  const offers = (area: ServiceArea, name: string) => !area.services.length || area.services.includes(name);
  const visibleAreas = service ? named.filter((area) => offers(area, service)) : named;
  const hasAreaServices = named.some((area) => area.services.length > 0);
  const active = named.find((area) => area.name === current) ?? null;
  const shown = active?.services.length ? active.services : services;
  const radiusOf = (area: ServiceArea) => (area.radius && area.radius > 0 ? area.radius : defaultRadius);

  // Saved coordinates first; otherwise a known city centre (demo data, unsaved previews).
  const placed: MapArea[] = named.flatMap((area) => {
    const point = Number.isFinite(area.latitude) && Number.isFinite(area.longitude) ? { lat: area.latitude!, lng: area.longitude! } : cityPoint(area.name, region);
    return point ? [{ name: area.name, latitude: point.lat, longitude: point.lng, radiusMiles: radiusOf(area), serviceCount: area.services.length }] : [];
  });
  const basePoint = coordinates ?? (baseName ? cityPoint(baseName) : undefined);
  const base = basePoint ? { name: baseName || ownerName, latitude: basePoint.lat, longitude: basePoint.lng, radiusMiles: defaultRadius } : null;
  const unplaced = named.filter((area) => !placed.some((p) => p.name === area.name)).map((area) => area.name);
  const mapsQuery = active ? (Number.isFinite(active.latitude) && Number.isFinite(active.longitude) ? `${active.latitude},${active.longitude}` : active.address || (region && !active.name.includes(",") ? `${active.name}, ${region}` : active.name)) : coordinates ? `${coordinates.lat},${coordinates.lng}` : baseName;

  const chooseService = (name: string | null) => {
    setService(name);
    const first = name ? named.find((area) => offers(area, name)) : null;
    if (first) select(first.name);
  };

  if (!named.length && !baseName) {
    return <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Add a base location or an area to see it on the map.</p>;
  }

  return (
    <div>
      {hasAreaServices && services.length > 1 && (
        <div className="mb-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor={`service-area-filter${compact ? "-preview" : ""}`}>Find areas for a service</label>
          <select id={`service-area-filter${compact ? "-preview" : ""}`} value={service ?? ""} onChange={(event) => chooseService(event.target.value || null)} className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FFD60A] sm:w-72">
            <option value="">All services</option>
            {services.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          {service && <p className="mt-1.5 text-xs text-gray-500">{visibleAreas.length ? `${visibleAreas.length} area${visibleAreas.length === 1 ? "" : "s"} offer${visibleAreas.length === 1 ? "s" : ""} ${service}.` : `No listed area offers ${service}.`}</p>}
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Service areas">
        {baseName && (
          <button type="button" role="tab" aria-selected={!active} onClick={() => select(null)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${!active ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-[#FFD60A]"}`}>
            <FaMapPin className="h-2.5 w-2.5" /> Base: {baseName}
          </button>
        )}
        {visibleAreas.map((area) => {
          const on = active?.name === area.name;
          return (
            <button key={area.name} type="button" role="tab" aria-selected={on} onClick={() => select(area.name)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${on ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FFD60A]"}`}>
              <FaMapPin className={`h-2.5 w-2.5 ${on ? "text-[#FFD60A]" : "text-[#f7672c]"}`} /> {area.name}
              <span className={`rounded-full px-1.5 text-[10px] ${on ? "bg-white/20" : "bg-white text-gray-500"}`}>{area.services.length || "All"} · {radiusOf(area)} mi</span>
            </button>
          );
        })}
      </div>

      <div className={`mt-4 grid gap-4 ${compact ? "" : "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"}`}>
        <div>
          <div className={`relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 ${compact ? "h-64" : "h-72 sm:h-96"}`}>
            {placed.length || base ? (
              <AreaMap areas={placed} base={base} selected={active?.name ?? null} highlighted={service ? new Set(visibleAreas.map((area) => area.name)) : null} onSelect={(name) => select(name)} height={compact ? 256 : 384} />
            ) : (
              <p className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">These areas will appear on the map once they are saved.</p>
            )}
            <span className="pointer-events-none absolute left-3 top-3 z-[500] rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#0b1f3b] shadow">{active ? `${active.name} · ${radiusOf(active)} mi radius` : `Base · ${baseName || ownerName}${base ? ` · ${defaultRadius} mi` : ""}`}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full border-2 border-dashed border-[#f7672c]" aria-hidden /> Dotted circles show how far each area is served</span>
            {mapsQuery && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#0b1f3b] hover:underline"><FaExternalLinkAlt className="h-2.5 w-2.5" /> Open in Google Maps</a>}
          </div>
          {unplaced.length > 0 && <p className="mt-1 text-xs text-amber-700">Not on the map yet: {unplaced.join(", ")}{compact ? " — add the state (e.g. “Round Rock, TX”) or save to look them up." : ""}</p>}
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4" aria-live="polite">
          <h3 className="text-sm font-bold text-gray-900">{active ? `Services in ${active.name}` : `Services from ${baseName || ownerName}`}</h3>
          {active?.address && <p className="mt-1 flex items-start gap-1.5 text-xs font-medium text-gray-700"><FaMapPin className="mt-0.5 h-2.5 w-2.5 shrink-0 text-[#f7672c]" /> {active.address}</p>}
          <p className="mt-0.5 text-xs text-gray-500">{active ? `${active.services.length ? `${active.services.length} service${active.services.length === 1 ? "" : "s"}` : "Every service"} within ${radiusOf(active)} miles of ${active.name}.` : `${named.length} area${named.length === 1 ? "" : "s"} served. Choose one to see its services.`}</p>
          {shown.length ? (
            <ul className="mt-3 space-y-1.5">
              {shown.slice(0, 12).map((name) => <li key={name} className="flex items-start gap-2 text-sm text-gray-700"><FaCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" /> {name}</li>)}
              {shown.length > 12 && <li className="text-xs text-gray-500">+{shown.length - 12} more</li>}
            </ul>
          ) : <p className="mt-3 text-sm text-gray-500">{compact ? "Add services in the Services section to choose them per area." : `Contact ${ownerName} for the services available.`}</p>}
        </div>
      </div>
    </div>
  );
}
