"use client";

import { useRef, useState } from "react";
import { FaCheckCircle, FaCrosshairs } from "react-icons/fa";
import { lookupCoordinates, lookupZip, type Place } from "@/components/utils/auth";

type Props = { zipCode: string; onZipChange: (zip: string) => void; onPlace: (place: Place | null) => void };

/** ZIP code with a real lookup: shows the matching city and state, or fills it from the device location. */
export default function ZipLocationField({ zipCode, onZipChange, onPlace }: Props) {
  const [place, setPlace] = useState<Place | null>(null);
  const [status, setStatus] = useState<"idle" | "checking" | "locating">("idle");
  const [error, setError] = useState("");

  // Each lookup gets a number so a slow answer for an old ZIP can't overwrite a newer one.
  const latest = useRef(0);
  const changeZip = (value: string) => {
    const zip = value.replace(/\D/g, "").slice(0, 5);
    onZipChange(zip);
    setError("");
    const request = ++latest.current;
    if (!/^\d{5}$/.test(zip)) { setPlace(null); onPlace(null); setStatus("idle"); return; }
    setStatus("checking");
    lookupZip(zip)
      .then((found) => { if (request === latest.current) { setPlace(found); onPlace(found); } })
      .catch((caught) => { if (request === latest.current) { setPlace(null); onPlace(null); setError(caught instanceof Error ? caught.message : "ZIP code not found."); } })
      .finally(() => { if (request === latest.current) setStatus("idle"); });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return setError("Your browser can't share its location. Type your ZIP code instead.");
    setStatus("locating");
    setError("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const found = await lookupCoordinates(coords.latitude, coords.longitude);
          latest.current++; // supersedes any lookup still running for a typed ZIP
          setPlace(found);
          onPlace(found);
          onZipChange(found.zipCode);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Couldn't find your ZIP code.");
        } finally {
          setStatus("idle");
        }
      },
      () => { setStatus("idle"); setError("Location permission was denied. Type your ZIP code instead."); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <label htmlFor="zipCode" className="text-sm font-semibold text-gray-700">ZIP code <span className="text-red-500">*</span></label>
        <button type="button" onClick={useMyLocation} disabled={status === "locating"} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b1f3b] hover:underline disabled:opacity-60"><FaCrosshairs className="h-3 w-3" /> {status === "locating" ? "Finding you…" : "Use my location"}</button>
      </div>
      <input id="zipCode" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zipCode} onChange={(event) => changeZip(event.target.value)} placeholder="e.g. 78701" aria-invalid={Boolean(error)} className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
      <p className="mt-1.5 min-h-5 text-xs" aria-live="polite">
        {status === "checking" ? <span className="text-gray-500">Looking up {zipCode}…</span>
          : place ? <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><FaCheckCircle /> {place.city}, {place.stateCode || place.state}</span>
          : error ? <span className="font-medium text-red-600">{error}</span>
          : <span className="text-gray-500">We use it to show plumbers who serve your area.</span>}
      </p>
    </div>
  );
}
