"use client";

import { FaMagnifyingGlass } from "react-icons/fa6";
import SmartSuggestionList from "@/components/search/SmartSuggestionList";
import type { HeaderSearch } from "../useHeaderSearch";

/** The search box at the top of the phone menu, with suggestions under it. */
export default function MobileSearch({ search, autoFocus }: { search: HeaderSearch; autoFocus: boolean }) {
  const { query, setQuery, submit, pick, smart } = search;
  return (
    <>
      <form onSubmit={(event) => submit(event)} className="relative md:hidden" role="search">
        <label htmlFor="mobile-search" className="sr-only">Search plumbers, services</label>
        <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          id="mobile-search"
          type="search"
          enterKeyHint="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (smart.onKeyDown(event)) event.preventDefault(); }}
          autoComplete="off"
          placeholder="Search plumbers or services"
          className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-24 text-base text-slate-800 placeholder-slate-400 focus:border-[#FFD60A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/25"
        />
        <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-[#0b1f3b] px-4 text-sm font-semibold text-white">Search</button>
      </form>
      {query.trim().length >= 2 && (
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white md:hidden">
          <SmartSuggestionList id="mobile-suggestions" items={smart.items} active={smart.active} loading={smart.loading} settled={smart.settled} query={query} onPick={pick} onHover={smart.setActive} onSearch={() => submit(null)} />
        </div>
      )}
    </>
  );
}
