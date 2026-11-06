"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/adminAuth";
import type { DirectoryCity, DirectoryState } from "@/lib/adminApi";

/** Every state (with provider counts) and the cities of the chosen one, from the public location API. */
export function useLocations(stateSlug: string) {
  const [states, setStates] = useState<DirectoryState[]>([]);
  const [cities, setCities] = useState<DirectoryCity[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`${API_BASE_URL}/location/states`).then((r) => r.json()).then(({ data }: { data: DirectoryState[] }) => setStates(data)).catch(() => setError("Could not load the states."));
  }, []);
  useEffect(() => {
    if (!stateSlug || stateSlug === "usa") return;
    let cancelled = false;
    fetch(`${API_BASE_URL}/location/states/${stateSlug}/cities`).then((r) => r.json()).then(({ data }) => { if (!cancelled) setCities(data ?? []); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [stateSlug]);
  return { states, cities: stateSlug && stateSlug !== "usa" ? cities : [], error };
}
