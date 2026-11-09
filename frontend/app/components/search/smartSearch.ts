"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { API_BASE_URL } from "@/components/utils/apiBase";

// Natural-language search: suggestions while typing (GET /api/search/suggestions) and, on Enter, the page a
// search means (GET /api/search: "Top 10 plumbers in Texas" → /top-10-plumbers/texas). Used by the header search
// and the search box on directory pages.

const API = API_BASE_URL;
const DEBOUNCE_MS = 180;

export type Suggestion = { kind: "ranking" | "service" | "provider" | "location"; label: string; url: string; hint?: string; logo?: string; rating?: number; reviewCount?: number; verified?: boolean };

/** A profile found by the site search (GET /api/search/providers). */
export type ProfileHit = {
  id: string; providerType: "company" | "freelancer"; name: string; url: string; logo: string | null; city: string | null; stateCode: string | null;
  rating: number; reviewCount: number; verified: boolean; isEmergency: boolean; services: string[]; description: string; score: number; matched: string[];
};
export type ProfileSearch = {
  query: string; terms: string[]; correctedQuery: string | null; total: number; results: ProfileHit[]; related: ProfileHit[];
  facets: { services: { slug: string; name: string; count: number }[]; states: { code: string; count: number }[]; verified: number; emergency: number };
};

/** Profiles matching a search, best first, with a corrected query and related profiles. null if the backend can't be reached. */
export async function searchProfiles(query: string, options: { signal?: AbortSignal } = {}): Promise<ProfileSearch | null> {
  try {
    const response = await fetch(`${API}/search/providers?q=${encodeURIComponent(query.trim())}`, { signal: options.signal });
    if (!response.ok) return null;
    const { data } = await response.json();
    return data && Array.isArray(data.results) ? data : null;
  } catch { return null; }
}

/** Where a typed search should go. Falls back to the plain directory search if the backend can't be reached. */
export async function resolveSearch(query: string): Promise<string> {
  const q = query.trim();
  if (!q) return "/find";
  try {
    const response = await fetch(`${API}/search?log=1&q=${encodeURIComponent(q)}`);
    if (response.ok) {
      const { data } = await response.json();
      if (typeof data?.url === "string" && data.url.startsWith("/")) return data.url;
    }
  } catch { /* offline: use the directory search */ }
  return `/find?search=${encodeURIComponent(q)}`;
}

/**
 * Suggestions for `query` (debounced, the last answer wins) plus keyboard handling for the input:
 * ↑/↓ move, Enter opens the highlighted suggestion (`onPick`), Escape closes (`onClose`).
 * `onKeyDown` returns true when it handled the key.
 */
export function useSmartSuggestions(query: string, { enabled = true, onPick, onClose }: { enabled?: boolean; onPick: (item: Suggestion) => void; onClose?: () => void }) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const [forQuery, setForQuery] = useState("");
  const latest = useRef(0);
  const text = query.trim();
  const wanted = enabled && text.length >= 2;

  useEffect(() => {
    if (!wanted) return;
    const ticket = ++latest.current;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`${API}/search/suggestions?q=${encodeURIComponent(text)}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : { data: [] }))
        .then(({ data }) => { if (ticket === latest.current) { setItems(Array.isArray(data) ? data : []); setForQuery(text); setActive(-1); } })
        .catch(() => undefined)
        .finally(() => { if (ticket === latest.current) setLoading(false); });
    }, DEBOUNCE_MS);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [text, wanted]);

  const shown = wanted ? items : [];
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): boolean => {
    if (event.key === "Escape") { onClose?.(); return true; }
    if (!shown.length) return false;
    if (event.key === "ArrowDown") { setActive((index) => (index + 1) % shown.length); return true; }
    if (event.key === "ArrowUp") { setActive((index) => (index <= 0 ? shown.length - 1 : index - 1)); return true; }
    if (event.key === "Enter" && active >= 0 && shown[active]) { onPick(shown[active]); return true; }
    return false;
  };
  return { items: shown, loading: wanted && loading, active, setActive, onKeyDown, settled: wanted && !loading && forQuery === text };
}

// Recent searches, kept in this browser only (shown in the search panel before typing).
const RECENT_KEY = "plumberfinder_recent_searches";
const RECENT_MAX = 6;

export function recentSearches(): string[] {
  try {
    const list = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((item): item is string => typeof item === "string").slice(0, RECENT_MAX) : [];
  } catch { return []; }
}

function saveRecent(list: string[]) {
  try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX))); } catch { /* storage blocked */ }
}

export function rememberSearch(query: string) {
  const q = query.trim().replace(/\s+/g, " ").slice(0, 80);
  if (q.length >= 2) saveRecent([q, ...recentSearches().filter((item) => item.toLowerCase() !== q.toLowerCase())]);
}

export function forgetSearch(query?: string) {
  saveRecent(query ? recentSearches().filter((item) => item !== query) : []);
}
