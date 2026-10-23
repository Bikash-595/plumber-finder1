"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import type { Point } from "./distance";

// The visitor's location, kept on this device only after they choose "Use my location".
const STORAGE_KEY = "plumberfinder_user_location";
const EVENT = "plumberfinder-location";

function read(): string | null {
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}
const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener("storage", callback); };
};

export function useUserLocation() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const [status, setStatus] = useState<"idle" | "locating" | "denied" | "unavailable">("idle");
  let location: Point | null = null;
  try { location = raw ? (JSON.parse(raw) as Point) : null; } catch { location = null; }

  const request = useCallback(() => {
    if (!navigator.geolocation) return setStatus("unavailable");
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat: coords.latitude, lng: coords.longitude })); } catch { /* private mode: distances just aren't remembered */ }
        window.dispatchEvent(new Event(EVENT));
        setStatus("idle");
      },
      (error) => setStatus(error.code === 1 ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, []);

  const clear = useCallback(() => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { location, status, request, clear };
}
