"use client";

import { FaTh, FaList, FaLocationArrow } from "react-icons/fa";
import { useUserLocation } from "./useUserLocation";

interface ResultsHeaderProps {
  totalResults: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function ResultsHeader({ viewMode, onViewModeChange }: ResultsHeaderProps) {
  const { location, status, request, clear } = useUserLocation();
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      {/* Distances on the cards are measured from the visitor's location (asked for only on click). */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {location ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700"><FaLocationArrow className="h-3 w-3" /> Showing distance from you</span>
            <button type="button" onClick={clear} className="text-xs font-semibold text-gray-500 underline hover:text-gray-700">Forget my location</button>
          </>
        ) : (
          <button type="button" onClick={request} disabled={status === "locating"} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 font-semibold text-[#0b1f3b] transition hover:border-[#FFD60A] disabled:opacity-60">
            <FaLocationArrow className="h-3 w-3" /> {status === "locating" ? "Finding you…" : "Use my location to see distances"}
          </button>
        )}
        {status === "denied" && <span className="text-xs text-red-600">Location permission was denied.</span>}
        {status === "unavailable" && <span className="text-xs text-red-600">Your location could not be found.</span>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`rounded-lg p-2 transition ${viewMode === "grid" ? "bg-[#FFD60A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <FaTh className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`rounded-lg p-2 transition ${viewMode === "list" ? "bg-[#FFD60A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <FaList className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}