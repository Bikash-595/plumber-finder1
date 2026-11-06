"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import { FaArrowRight, FaBuilding, FaChevronRight, FaListOl, FaMagnifyingGlass, FaStar, FaUser, FaWrench } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import type { Suggestion } from "./smartSearch";
import { Heading } from "@/components/search/suggestions/Heading";
import Highlight from "@/components/search/suggestions/Highlight";
import SkeletonRows from "@/components/search/suggestions/SkeletonRows";

const searchIcons = { ranking: FaListOl, service: FaWrench, provider: FaBuilding, location: FaMagnifyingGlass };

/**
 * What's under the search box while typing (a listbox the input drives with ↑/↓/Enter): matching profiles as
 * cards ("Top matches") beside the searches (Top 10 pages, services), and always "See all results".
 * `wide` puts the two groups side by side (header panel); otherwise they stack (mobile menu).
 */
export default function SmartSuggestionList({ id, items, active, loading, settled, query, onPick, onHover, onSearch, wide = false }: {
  id: string; items: Suggestion[]; active: number; loading: boolean; settled: boolean; query: string;
  onPick: (item: Suggestion) => void; onHover: (index: number) => void; onSearch: () => void; wide?: boolean;
}) {
  const typed = query.trim();
  if (typed.length < 2) return null;
  const profiles = items.filter((item) => item.kind === "provider");
  const searches = items.filter((item) => item.kind !== "provider");
  const firstLoad = loading && !items.length;

  const option = (item: Suggestion, index: number, content: ReactNode, className: string) => (
    <li key={`${item.url}-${item.label}`} id={`${id}-${index}`} role="option" aria-selected={index === active}>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onPick(item)} onMouseEnter={() => onHover(index)}
        className={`group flex w-full items-center gap-3 rounded-xl text-left transition ${index === active ? "bg-[#FFD60A]/15 ring-1 ring-[#FFD60A]/60" : "hover:bg-slate-50"} ${className}`}>
        {content}
      </button>
    </li>
  );

  const profileRow = (item: Suggestion, index: number) => option(item, index, (
    <>
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {item.logo ? <Image src={item.logo} alt="" fill sizes="44px" className="object-cover" /> : <span className="grid h-full w-full place-items-center bg-[#0b1f3b] text-base font-extrabold text-[#FFD60A]">{item.label.slice(0, 1)}</span>}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm"><Highlight text={item.label} query={typed} /></span>
          {item.verified && <FaCheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-label="Verified" />}
        </span>
        <span className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
          {item.rating ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700">
              <FaStar className="h-2.5 w-2.5" aria-hidden />{item.rating.toFixed(1)}<span className="font-normal text-amber-600/70">({item.reviewCount})</span>
            </span>
          ) : <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">New</span>}
          {item.hint && <span className="truncate">{item.hint}</span>}
          <span className="hidden items-center gap-1 text-slate-400 sm:inline-flex">
            · {item.url.startsWith("/company/") ? <><FaBuilding className="h-2.5 w-2.5" aria-hidden /> Company</> : <><FaUser className="h-2.5 w-2.5" aria-hidden /> Freelancer</>}
          </span>
        </span>
      </span>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${index === active ? "bg-[#0b1f3b] text-white" : "text-slate-300 group-hover:bg-[#0b1f3b] group-hover:text-white"}`}>
        <span className={index === active ? "mr-1 inline" : "mr-1 hidden group-hover:inline"}>View</span>
        <FaChevronRight className="inline h-2.5 w-2.5" aria-hidden />
      </span>
    </>
  ), "px-2.5 py-2");

  const searchRow = (item: Suggestion, index: number) => {
    const Icon = searchIcons[item.kind] ?? FaMagnifyingGlass;
    return option(item, index, (
      <>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.kind === "ranking" ? "bg-[#0b1f3b] text-[#FFD60A]" : "bg-emerald-50 text-emerald-600"}`}><Icon className="h-3.5 w-3.5" aria-hidden /></span>
        <span className="min-w-0 flex-1 truncate text-sm"><Highlight text={item.label} query={typed} /></span>
        {item.hint && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${/^Top \d+$/.test(item.hint) ? "bg-[#FFD60A]/25 text-[#0b1f3b]" : "bg-slate-100 text-slate-500"}`}>{item.hint}</span>}
      </>
    ), "px-2.5 py-2");
  };

  const profileGroup = profiles.length > 0 && (
    <ul role="group" aria-label="Profiles" className="space-y-0.5">
      <Heading>Top matches</Heading>
      {profiles.map((item) => profileRow(item, items.indexOf(item)))}
    </ul>
  );
  const searchGroup = searches.length > 0 && (
    <ul role="group" aria-label="Searches" className="space-y-0.5">
      <Heading aside={loading ? <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#FFD60A]" aria-label="Updating" /> : undefined}>Searches</Heading>
      {searches.map((item) => searchRow(item, items.indexOf(item)))}
    </ul>
  );
  const split = wide && profileGroup && searchGroup;

  return (
    <div className="overflow-hidden">
      <div id={id} role="listbox" aria-label="Search suggestions" className={`max-h-[min(65vh,520px)] overflow-y-auto p-2 ${split ? "grid gap-2 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:divide-x md:divide-slate-100" : "space-y-2"}`}>
        {firstLoad ? (
          <div className={wide ? "grid gap-2 md:grid-cols-2" : ""}><SkeletonRows count={3} tall />{wide && <SkeletonRows count={4} />}</div>
        ) : settled && !items.length ? (
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400"><FaMagnifyingGlass className="h-5 w-5" aria-hidden /></span>
            <p className="mt-3 text-sm font-semibold text-slate-800">No instant matches for “{typed}”</p>
            <p className="mt-1 max-w-sm text-xs text-slate-500">Press Enter to see all results — we’ll show related profiles, nearby services and similar names.</p>
          </div>
        ) : (
          <>
            {profileGroup && <div className={split ? "md:pr-2" : ""}>{profileGroup}</div>}
            {searchGroup && <div className={split ? "md:pl-2" : ""}>{searchGroup}</div>}
          </>
        )}
      </div>
      <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/80 px-3 py-2">
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={onSearch}
          className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-sm font-semibold text-[#0b1f3b] transition hover:bg-white">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#FFD60A] text-[#0b1f3b]"><FaMagnifyingGlass className="h-3 w-3" aria-hidden /></span>
          <span className="min-w-0 truncate">See all results for <span className="font-extrabold">“{typed}”</span></span>
          <FaArrowRight className="h-3 w-3 shrink-0 transition group-hover:translate-x-0.5" aria-hidden />
        </button>
        {wide && (
          <span className="hidden shrink-0 items-center gap-1.5 text-[11px] text-slate-400 lg:flex" aria-hidden>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans font-semibold text-slate-500">↑</kbd>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans font-semibold text-slate-500">↓</kbd> move
            <kbd className="ml-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans font-semibold text-slate-500">↵</kbd> open
            <kbd className="ml-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans font-semibold text-slate-500">esc</kbd> close
          </span>
        )}
      </div>
    </div>
  );
}
