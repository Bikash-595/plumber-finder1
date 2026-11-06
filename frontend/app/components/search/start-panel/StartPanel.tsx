"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRight, FaArrowTrendUp, FaBolt, FaClockRotateLeft, FaLocationDot, FaMagnifyingGlass, FaStar, FaXmark } from "react-icons/fa6";
import { ServiceIcon } from "@/components/services/serviceIcons";
import { forgetSearch, recentSearches } from "../smartSearch";
import { SectionTitle } from "./SectionTitle";
import { type SearchSuggestionsPanelProps } from "./panelTypes";
import { TRENDING, POPULAR_STATES, POPULAR_SERVICES, recentlyViewed, type ViewedProfile } from "./startPanelData";

/** Before anything is typed. Mounted each time the panel opens, so stored lists are read fresh. */
export default function StartPanel({ onClose, onQueryChange, onSubmitQuery }: Pick<SearchSuggestionsPanelProps, "onClose" | "onQueryChange" | "onSubmitQuery">) {
  const [recent, setRecent] = useState<string[]>(() => recentSearches());
  const [viewed] = useState<ViewedProfile[]>(() => recentlyViewed());
  const run = (value: string) => { onQueryChange(value); onSubmitQuery(value); };
  const chip = "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10 hover:text-[#0b1f3b]";

  return (
    <div className="max-h-[min(75vh,640px)] overflow-y-auto">
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-6">
        <div className="space-y-6">
          {recent.length > 0 && (
            <section>
              <SectionTitle icon={<FaClockRotateLeft className="h-3 w-3" aria-hidden />} action={<button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { forgetSearch(); setRecent([]); }} className="text-xs font-semibold text-slate-400 hover:text-slate-700">Clear</button>}>Recent searches</SectionTitle>
              <ul className="space-y-0.5">
                {recent.map((item) => (
                  <li key={item} className="group flex items-center rounded-xl hover:bg-slate-50">
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run(item)} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left text-sm text-slate-700">
                      <FaClockRotateLeft className="h-3 w-3 shrink-0 text-slate-300" aria-hidden /><span className="truncate">{item}</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { forgetSearch(item); setRecent((list) => list.filter((value) => value !== item)); }} aria-label={`Remove “${item}” from recent searches`} className="mr-1 grid h-7 w-7 place-items-center rounded-full text-slate-300 opacity-0 transition hover:bg-white hover:text-slate-600 focus:opacity-100 group-hover:opacity-100">
                      <FaXmark className="h-3 w-3" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <SectionTitle icon={<FaArrowTrendUp className="h-3 w-3" aria-hidden />}>Trending searches</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((item) => (
                <button key={item} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run(item)} className={chip}>
                  <FaMagnifyingGlass className="h-2.5 w-2.5 text-slate-400" aria-hidden />{item}
                </button>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle icon={<FaLocationDot className="h-3 w-3" aria-hidden />}>Top 10 premium plumbers</SectionTitle>
            <div className="flex flex-wrap gap-2">
              <Link href="/top-10-plumbers-usa" onClick={onClose} className={`${chip} font-bold`}>All of the USA</Link>
              {POPULAR_STATES.map(([name, slug]) => (
                <Link key={slug} href={`/top-10-plumbers/${slug}`} onClick={onClose} className={chip}>{name}</Link>
              ))}
              <Link href="/states" onClick={onClose} className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-[#0b1f3b] hover:underline">All states <FaArrowRight className="h-2.5 w-2.5" aria-hidden /></Link>
            </div>
          </section>
        </div>

        <section>
          <SectionTitle icon={<ServiceIcon slug="pipe-repair" className="h-3 w-3" />} action={<Link href="/services" onClick={onClose} className="text-xs font-semibold text-[#0b1f3b] hover:underline">All services</Link>}>Popular services</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} onClick={onClose} className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition hover:border-[#FFD60A] hover:bg-white hover:shadow-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#0b1f3b] shadow-sm ring-1 ring-slate-100 transition group-hover:bg-[#FFD60A]"><ServiceIcon slug={service.slug} className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800">{service.name}</span>
                  <span className="block truncate text-xs text-slate-500">{service.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {viewed.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-4 md:px-6">
          <SectionTitle icon={<FaClockRotateLeft className="h-3 w-3" aria-hidden />}>Recently viewed</SectionTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {viewed.map((item) => (
              <Link key={item.id} href={`/plumber/${item.id}`} onClick={onClose} className="group flex items-center gap-2.5 rounded-xl border border-slate-100 p-2 transition hover:border-slate-200 hover:shadow-sm">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.image ? <Image src={item.image} alt="" fill sizes="40px" className="object-cover" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800">{item.companyName}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    {item.rating ? <><FaStar className="h-2.5 w-2.5 text-amber-400" aria-hidden />{item.rating.toFixed(1)}</> : null}
                    {item.location && <span className="truncate">{item.rating ? "· " : ""}{item.location}</span>}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/services/emergency-plumbing" onClick={onClose} className="group flex items-center gap-3 bg-[#0b1f3b] px-5 py-3 text-white md:px-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFD60A] text-[#0b1f3b]"><FaBolt className="h-3.5 w-3.5" aria-hidden /></span>
        <span className="min-w-0 flex-1 text-sm"><b>Plumbing emergency?</b> <span className="text-white/70">See plumbers available 24/7</span></span>
        <FaArrowRight className="h-3 w-3 text-[#FFD60A] transition group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </div>
  );
}
