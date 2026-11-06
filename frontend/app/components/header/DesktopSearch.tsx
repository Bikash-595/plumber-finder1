"use client";

import { useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SearchSuggestionsPanel from "@/components/search/SearchSuggestionsPanel";
import SmartSuggestionList from "@/components/search/SmartSuggestionList";
import type { HeaderSearch } from "./useHeaderSearch";
import { useDismiss } from "./useDismiss";

/** The header search box with its suggestions panel (tablet and up). */
export default function DesktopSearch({ search }: { search: HeaderSearch }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, open, setOpen, submit, pick, smart } = search;
  useDismiss(open, () => setOpen(false), wrapRef);
  return (
    <div ref={wrapRef} className="hidden min-w-0 flex-1 justify-center md:flex">
      <form onSubmit={(event) => submit(event)} className="group relative w-full max-w-xl" role="search">
        <label htmlFor="header-search" className="sr-only">Search plumbers, services, location</label>
        <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#0b1f3b]" aria-hidden />
        <input
          id="header-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={(event) => { if (smart.onKeyDown(event)) event.preventDefault(); }}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="header-suggestions"
          aria-activedescendant={smart.active >= 0 ? `header-suggestions-${smart.active}` : undefined}
          placeholder="Search plumbers or services"
          className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-14 text-sm text-slate-800 placeholder-slate-400 transition hover:border-slate-300 focus:border-[#FFD60A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/25 lg:pr-28"
        />
        <button type="submit" aria-label="Search" className="absolute right-1.5 top-1/2 inline-flex h-8 -translate-y-1/2 items-center gap-2 rounded-full bg-[#0b1f3b] px-3 text-sm font-semibold text-white transition hover:bg-[#17345a] lg:px-4">
          <FaMagnifyingGlass className="h-3 w-3 lg:hidden" aria-hidden />
          <span className="hidden lg:inline">Search</span>
        </button>
      </form>
      <SearchSuggestionsPanel
        open={open}
        onClose={() => setOpen(false)}
        query={query}
        onQueryChange={setQuery}
        onSubmitQuery={(value) => submit(null, value)}
        top={query.trim().length >= 2 ? <SmartSuggestionList wide id="header-suggestions" items={smart.items} active={smart.active} loading={smart.loading} settled={smart.settled} query={query} onPick={pick} onHover={smart.setActive} onSearch={() => submit(null)} /> : undefined}
      />
    </div>
  );
}
