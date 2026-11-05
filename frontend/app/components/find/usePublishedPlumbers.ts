"use client";

import { useEffect, useState } from "react";
import { plumbers as demoPlumbers } from "@/data/plumbers";
import { fetchPublishedPlumbers } from "./companyListing";
import type { Plumber } from "./types";

// One copy of the directory for the whole browser tab: every page and component that lists plumbers shares it,
// so moving between Home, Find, States and Book a Plumber doesn't download it again. It is refreshed in the
// background once it is older than FRESH_MS (the server also caches it and answers 304 when nothing changed).
const FRESH_MS = 60_000;
let directory: { at: number; list: Plumber[] | null; pending: Promise<Plumber[]> | null } = { at: 0, list: null, pending: null };

function loadDirectory(): Promise<Plumber[]> {
  if (directory.pending) return directory.pending;
  const pending = fetchPublishedPlumbers()
    .catch(() => directory.list ?? [])
    .then((list) => { directory = { at: Date.now(), list, pending: null }; return list; });
  directory = { ...directory, pending };
  return pending;
}

/** Live companies and freelancers published through their dashboards, shaped like the demo plumbers. null while loading. */
function useLivePlumbers() {
  // A copy from earlier in this visit shows at once (no loading state); a stale one is refreshed behind it.
  const [plumbers, setPlumbers] = useState<Plumber[] | null>(() => directory.list);
  useEffect(() => {
    if (directory.list && Date.now() - directory.at < FRESH_MS) return;
    let cancelled = false;
    loadDirectory().then((list) => { if (!cancelled) setPlumbers(list); });
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
