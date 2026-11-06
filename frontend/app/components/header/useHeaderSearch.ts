"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { rememberSearch, resolveSearch, useSmartSuggestions, type Suggestion } from "@/components/search/smartSearch";

/**
 * The header search (desktop box and mobile menu share it): the text, whether the panel is open, live suggestions,
 * and running a search. `onNavigate` closes the menus before the page changes.
 */
export function useHeaderSearch({ menuOpen, onNavigate }: { menuOpen: boolean; onNavigate: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Typed searches open the page they mean ("Top 10 plumbers in Texas" → /top-10-plumbers/texas).
  const submit = useCallback((event?: FormEvent | null, term?: string) => {
    event?.preventDefault();
    const text = (term ?? query).trim();
    onNavigate();
    setOpen(false);
    if (!text) { router.push("/find"); return; }
    rememberSearch(text);
    resolveSearch(text).then((url) => router.push(url));
  }, [query, router, onNavigate]);

  const pick = useCallback((item: Suggestion) => {
    rememberSearch(item.label);
    onNavigate();
    setOpen(false);
    router.push(item.url);
  }, [router, onNavigate]);

  // ↑/↓, Enter and Escape work in the inputs.
  const smart = useSmartSuggestions(query, { enabled: open || menuOpen, onPick: pick, onClose: () => setOpen(false) });
  return { query, setQuery, open, setOpen, submit, pick, smart };
}

export type HeaderSearch = ReturnType<typeof useHeaderSearch>;
