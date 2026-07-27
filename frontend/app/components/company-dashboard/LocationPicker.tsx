"use client";

import { useEffect, useState } from "react";
import { FaCrosshairs, FaExternalLinkAlt } from "react-icons/fa";

type Props = { address?: string; latitude: string; longitude: string; onChange: (value: { latitude: string; longitude: string }) => void };

export default function LocationPicker({ address = "", latitude, longitude, onChange }: Props) {
  const [message, setMessage] = useState("Finding your current location…");
  const [isLocating, setIsLocating] = useState(false);
  const pickCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setMessage("Device location is unavailable. Use Google Maps or enter coordinates manually.");
      return;
    }
    if (isLocating) return;
    setIsLocating(true);
    setMessage("Requesting permission to use your current location…");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      onChange({ latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) });
      setMessage("Current device location selected.");
      setIsLocating(false);
    }, (error) => {
      const errors: Record<number, string> = {
        1: "Location permission was denied. Enable it in your browser settings, or use Google Maps.",
        2: "Your device could not determine a location. Try again or use Google Maps.",
        3: "Location lookup timed out. Try again or use Google Maps.",
      };
      setMessage(errors[error.code] || "Location could not be retrieved. Use Google Maps or enter coordinates manually.");
      setIsLocating(false);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
  };
  useEffect(() => {
    // Defer the automatic permission request so the effect itself does not
    // synchronously update React state during hydration.
    const timer = window.setTimeout(() => pickCurrentLocation(), 0);
    return () => window.clearTimeout(timer);
  }, [ ]);
  const query = latitude && longitude ? `${latitude},${longitude}` : address;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return <div className="mt-4 rounded-2xl border border-[#FFD60A]/40 bg-amber-50/50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-gray-900">Location picker</p><p className="text-xs text-gray-600">Current location is picked automatically after permission. You can edit latitude and longitude below.</p></div><div className="flex gap-2"><button type="button" disabled={isLocating} onClick={pickCurrentLocation} className="inline-flex items-center gap-2 rounded-lg bg-[#0b1f3b] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"><FaCrosshairs /> {isLocating ? "Locating…" : "Use my location"}</button><a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700"><FaExternalLinkAlt /> Open Google Maps</a></div></div><p className="mt-3 text-xs font-medium text-gray-700">{message}</p><iframe title="Google Maps location preview" src={`https://www.google.com/maps?q=${encodeURIComponent(query || "United States")}&output=embed`} className="mt-3 h-64 w-full rounded-xl border border-gray-200" loading="lazy" /><p className="mt-2 text-xs text-gray-600">To place a precise pin, open Google Maps, choose the point, then copy its latitude and longitude into the location fields.</p></div>;
}
