"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowRight, FaChevronDown, FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";
import { plumbers } from "@/data/plumbers";
import { allStateAbbrs, getStateName } from "@/components/utils/location";

const usStates = allStateAbbrs.map(getStateName);

export const stateHref = (state: string) => `/states/${state.toLowerCase().replace(/\s/g, "-")}`;

/** States that currently have listed companies, most companies first. */
export const topStates = Object.entries(
  plumbers.reduce<Record<string, number>>((acc, plumber) => {
    if (plumber.state) acc[plumber.state] = (acc[plumber.state] ?? 0) + 1;
    return acc;
  }, {})
)
  .map(([abbr, count]) => ({ name: getStateName(abbr), count }))
  .filter((state) => state.name)
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

type NavMenuProps = {
  open: boolean;
  active?: boolean;
  onOpenChange: (open: boolean) => void;
};

// Mega menu of all US states with a quick filter. Positioned like ServicesDropdown.
export function StatesDropdown({ open, active = false, onOpenChange }: NavMenuProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filteredStates = usStates.filter((state) => state.toLowerCase().includes(query));
  const close = () => onOpenChange(false);

  return (
    <div
      onPointerEnter={(event) => { if (event.pointerType === "mouse") onOpenChange(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") onOpenChange(false); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => onOpenChange(!open)}
        className={`relative flex h-12 items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#0b1f3b] ${
          active || open ? "text-[#0b1f3b]" : "text-slate-600"
        }`}
      >
        States
        <FaChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
        {(active || open) && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#FFD60A]" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 pt-px">
          <div className="animate-nav-menu rounded-b-2xl border border-t-0 border-slate-200 bg-white p-5 shadow-[0_24px_48px_-12px_rgba(11,31,59,0.25)] xl:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Find plumbers by state</p>
              <div className="flex items-center gap-4">
                <label className="relative block w-56">
                  <span className="sr-only">Search states</span>
                  <FaMagnifyingGlass className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" aria-hidden />
                  <input
                    type="text"
                    placeholder="Search state..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#FFD60A] focus:bg-white focus:ring-2 focus:ring-[#FFD60A]/40"
                  />
                </label>
                <Link href="/states" onClick={close} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b1f3b] hover:underline">
                  View all <FaArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
            </div>

            {!query && topStates.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
                <span className="mr-1 text-xs font-semibold text-slate-500">Top states:</span>
                {topStates.map((state) => (
                  <Link
                    key={state.name}
                    href={stateHref(state.name)}
                    onClick={close}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10"
                  >
                    {state.name}
                    <span className="rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-500">{state.count}</span>
                  </Link>
                ))}
              </div>
            )}

            <ul className="mt-3 grid max-h-72 grid-cols-4 gap-x-2 overflow-y-auto xl:grid-cols-5">
              {filteredStates.map((state) => (
                <li key={state}>
                  <Link
                    href={stateHref(state)}
                    onClick={close}
                    className="group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0b1f3b]"
                  >
                    <FaLocationDot className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-[#d4ad00]" aria-hidden />
                    {state}
                  </Link>
                </li>
              ))}
              {filteredStates.length === 0 && <li className="col-span-full px-3 py-2 text-sm text-slate-500">No states match “{search}”.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
