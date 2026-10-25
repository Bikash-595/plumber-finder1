"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";

export type MapArea = { name: string; latitude: number; longitude: number; radiusMiles: number; serviceCount: number };
type Props = {
  areas: MapArea[];
  base?: { name: string; latitude: number; longitude: number; radiusMiles: number } | null;
  /** Selected area name; null = the base / overview. */
  selected: string | null;
  /** Areas that match the service filter (others are faded). */
  highlighted?: Set<string> | null;
  onSelect: (name: string | null) => void;
  height: number;
};

const METERS_PER_MILE = 1609.34;
const NAVY = "#0b1f3b", ORANGE = "#f7672c";

/** Zooms to the selected area's circle, or fits every circle for the overview. */
function Focus({ areas, base, selected }: Pick<Props, "areas" | "base" | "selected">) {
  const map = useMap();
  useEffect(() => {
    const circleBounds = (lat: number, lng: number, miles: number) => L.latLng(lat, lng).toBounds(Math.max(miles, 1) * METERS_PER_MILE * 2);
    const target = areas.find((area) => area.name === selected);
    if (target) {
      map.flyToBounds(circleBounds(target.latitude, target.longitude, target.radiusMiles), { padding: [24, 24], duration: 0.6 });
      return;
    }
    const all = [...areas.map((a) => circleBounds(a.latitude, a.longitude, a.radiusMiles)), ...(base ? [circleBounds(base.latitude, base.longitude, base.radiusMiles)] : [])];
    if (!all.length) return;
    const bounds = all.reduce((acc, b) => acc.extend(b), L.latLngBounds(all[0].getSouthWest(), all[0].getNorthEast()));
    map.flyToBounds(bounds, { padding: [24, 24], duration: 0.6 });
  }, [map, areas, base, selected]);
  return null;
}

/**
 * OpenStreetMap with a dotted circle for every service area's radius (and the base's).
 * Click a circle to select that area. Loaded only in the browser (Leaflet needs `window`).
 */
export default function AreaMap({ areas, base, selected, highlighted, onSelect, height }: Props) {
  const center: [number, number] = base ? [base.latitude, base.longitude] : areas[0] ? [areas[0].latitude, areas[0].longitude] : [39.5, -98.35];
  return (
    <MapContainer center={center} zoom={9} scrollWheelZoom={false} style={{ height, width: "100%" }} className="z-0" attributionControl>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
      {base && (
        <>
          <Circle center={[base.latitude, base.longitude]} radius={Math.max(base.radiusMiles, 1) * METERS_PER_MILE} pathOptions={{ color: NAVY, weight: selected === null ? 3 : 2, dashArray: "4 8", fillColor: NAVY, fillOpacity: selected === null ? 0.08 : 0.03 }} eventHandlers={{ click: () => onSelect(null) }} />
          <CircleMarker center={[base.latitude, base.longitude]} radius={8} pathOptions={{ color: "#fff", weight: 3, fillColor: NAVY, fillOpacity: 1 }} eventHandlers={{ click: () => onSelect(null) }}>
            <Tooltip direction="top" offset={[0, -6]}>Base · {base.name} · {base.radiusMiles} mi radius</Tooltip>
          </CircleMarker>
        </>
      )}
      {areas.map((area) => {
        const on = area.name === selected;
        const faded = highlighted ? !highlighted.has(area.name) : false;
        // Leaflet reads `permanent` only when a tooltip is created, so the selected label is re-created (key).
        return (
          <Circle key={area.name} center={[area.latitude, area.longitude]} radius={Math.max(area.radiusMiles, 1) * METERS_PER_MILE} pathOptions={{ color: on ? NAVY : ORANGE, weight: on ? 3 : 2, dashArray: "2 7", fillColor: on ? "#FFD60A" : ORANGE, fillOpacity: faded ? 0.02 : on ? 0.22 : 0.08, opacity: faded ? 0.3 : 1 }} eventHandlers={{ click: () => onSelect(area.name) }}>
            <Tooltip key={on ? "selected" : "idle"} direction="center" permanent={on} className="!rounded-full !border-0 !px-2 !py-0.5 !text-xs !font-bold">{area.name} · {area.radiusMiles} mi · {area.serviceCount ? `${area.serviceCount} services` : "all services"}</Tooltip>
          </Circle>
        );
      })}
      <Focus areas={areas} base={base} selected={selected} />
    </MapContainer>
  );
}
