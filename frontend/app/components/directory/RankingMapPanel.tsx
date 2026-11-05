"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "./RankingMap";

// Leaflet needs the browser, so the map loads after the page (the listings are already server-rendered).
const RankingMap = dynamic(() => import("./RankingMap"), { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-gray-100" /> });

export default function RankingMapPanel({ pins, height = 320 }: { pins: MapPin[]; height?: number }) {
  if (!pins.length) return null;
  return (
    <section aria-label="Map of ranked plumbers" className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div style={{ height }}><RankingMap pins={pins} height={height} /></div>
      <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">{pins.length} of the ranked plumbers have a mapped location. Tap a number to open the profile.</p>
    </section>
  );
}
