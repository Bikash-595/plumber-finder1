"use client";

import { useEffect, useState } from "react";
import { searchProfiles, type ProfileSearch } from "@/components/search/smartSearch";

/**
 * The site search's answer for `query` (best matches first, a corrected query, related profiles).
 * `search` is null when there's no query or the backend couldn't answer (then the page matches words itself).
 */
export function useProfileSearch(query: string): { search: ProfileSearch | null; loading: boolean } {
  const text = query.trim();
  const [state, setState] = useState<{ text: string; search: ProfileSearch | null }>({ text: "", search: null });
  useEffect(() => {
    if (!text) return;
    const controller = new AbortController();
    searchProfiles(text, { signal: controller.signal }).then((search) => { if (!controller.signal.aborted) setState({ text, search }); });
    return () => controller.abort();
  }, [text]);
  if (!text) return { search: null, loading: false };
  return { search: state.text === text ? state.search : null, loading: state.text !== text };
}
