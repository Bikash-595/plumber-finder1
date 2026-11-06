"use client";

import Link from "next/link";
import { useState } from "react";
import { FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";
import { stateHref, topStates } from "@/components/dropdowns/StatesDropdown";
import { usStates } from "../headerConfig";

/** Every state (searchable, popular ones first), inside the phone menu's States group. */
export default function MobileStatesList({ onNavigate }: { onNavigate: () => void }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const states = usStates.filter((state) => state.toLowerCase().includes(query));
  return (
    <div className="border-t border-slate-100 bg-slate-50/60 p-3">
      <label className="relative block">
        <span className="sr-only">Search states</span>
        <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" aria-hidden />
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search state..." className="h-10 w-full rounded-full border border-slate-200 bg-white pl-8 pr-3 text-base outline-none focus:border-[#FFD60A] focus:ring-4 focus:ring-[#FFD60A]/25 sm:text-sm" />
      </label>
      {!query && topStates.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topStates.map((state) => (
            <Link key={state.name} href={stateHref(state.name)} onClick={onNavigate} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {state.name} <span className="text-slate-400">· {state.count}</span>
            </Link>
          ))}
        </div>
      )}
      <ul className="mt-2 grid grid-cols-2 gap-0.5 sm:grid-cols-3">
        {states.map((state) => (
          <li key={state}>
            <Link href={stateHref(state)} onClick={onNavigate} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-white">
              <FaLocationDot className="h-3 w-3 shrink-0 text-slate-300" aria-hidden />
              <span className="truncate">{state}</span>
            </Link>
          </li>
        ))}
        {states.length === 0 && <li className="col-span-full px-2 py-2 text-sm text-slate-500">No states match.</li>}
      </ul>
    </div>
  );
}
