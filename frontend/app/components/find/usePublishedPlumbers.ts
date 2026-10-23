"use client";

import { useEffect, useState } from "react";
import { plumbers as demoPlumbers } from "@/data/plumbers";
import { fetchPublishedPlumbers } from "./companyListing";
import type { Plumber } from "./types";

/** Live companies and freelancers published through their dashboards, shaped like the demo plumbers. null while loading. */
function useLivePlumbers() {
  const [plumbers, setPlumbers] = useState<Plumber[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchPublishedPlumbers().then((list) => { if (!cancelled) setPlumbers(list); }).catch(() => { if (!cancelled) setPlumbers([]); });
    return () => { cancelled = true; };
  }, []);
  return plumbers;
}

/** Live companies and freelancers only (e.g. to resolve items saved in a customer's account). */
export function usePublishedPlumbers() {
  return useLivePlumbers() ?? [];
}

/**
 * What the public directory lists: real companies and freelancers once any have been added
 * (they replace the demo data); the built-in demo plumbers only while there are none.
 * `loading` is true until the backend has answered.
 */
export function useDirectoryPlumbers(): { plumbers: Plumber[]; loading: boolean; isDemo: boolean } {
  const live = useLivePlumbers();
  if (live === null) return { plumbers: [], loading: true, isDemo: false };
  return live.length ? { plumbers: live, loading: false, isDemo: false } : { plumbers: demoPlumbers, loading: false, isDemo: true };
}
