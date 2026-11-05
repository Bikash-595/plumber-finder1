"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SmartSuggestionList from "@/components/search/SmartSuggestionList";
import { resolveSearch, useSmartSuggestions, type Suggestion } from "@/components/search/smartSearch";

/** "Top 10 plumbers in …" search with suggestions, on directory pages. Click outside or Escape closes the list. */
export default function DirectorySearchBox({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pick = (item: Suggestion) => { setOpen(false); router.push(item.url); };
  const smart = useSmartSuggestions(query, { enabled: open, onPick: pick, onClose: () => setOpen(false) });

  useEffect(() => {
    const close = (event: PointerEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!query.trim() || busy) return;
    setBusy(true);
    setOpen(false);
    router.push(await resolveSearch(query));
    setBusy(false);
  };

  const listOpen = open && query.trim().length >= 2;
  return (
    <div ref={wrap} className="relative w-full">
      <form onSubmit={submit} role="search" className="relative">
        <label htmlFor="directory-search" className="sr-only">Search plumbers by service and location</label>
        <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input id="directory-search" type="search" value={query} autoComplete="off" placeholder={placeholder}
          role="combobox" aria-expanded={listOpen} aria-controls="directory-suggestions" aria-activedescendant={smart.active >= 0 ? `directory-suggestions-${smart.active}` : undefined}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          onKeyDown={(event) => { if (smart.onKeyDown(event)) event.preventDefault(); }}
          className="h-13 w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-28 text-base text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#FFD60A] focus:ring-4 focus:ring-[#FFD60A]/25" />
        <button type="submit" disabled={busy} className="absolute right-1.5 top-1/2 h-10 -translate-y-1/2 rounded-xl bg-[#0b1f3b] px-5 text-sm font-bold text-white transition hover:bg-[#17345a] disabled:opacity-60">Search</button>
      </form>
      {listOpen && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <SmartSuggestionList id="directory-suggestions" items={smart.items} active={smart.active} loading={smart.loading} settled={smart.settled} query={query} onPick={pick} onHover={smart.setActive} onSearch={() => submit()} />
        </div>
      )}
    </div>
  );
}
