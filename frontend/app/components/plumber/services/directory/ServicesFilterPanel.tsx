"use client";

import { FaBolt, FaCamera, FaShieldAlt } from "react-icons/fa";
import { activeFilterCount, type ServiceFilters } from "./servicesFilter";

type Props = { filters: ServiceFilters; onChange: (next: ServiceFilters) => void; categories: [string, number][]; total: number };

const toggles: { key: "emergency" | "guaranteed" | "withMedia"; label: string; icon: typeof FaBolt }[] = [
  { key: "emergency", label: "24/7 emergency", icon: FaBolt },
  { key: "guaranteed", label: "With a guarantee", icon: FaShieldAlt },
  { key: "withMedia", label: "With photos or videos", icon: FaCamera },
];

/**
 * Categories and quick filters. Desktop: a sidebar list. Phones and tablets: chips that scroll sideways.
 */
export default function ServicesFilterPanel({ filters, onChange, categories, total }: Props) {
  const set = (change: Partial<ServiceFilters>) => onChange({ ...filters, ...change });
  const cats: [string, number][] = [["All", total], ...categories];
  const chip = (on: boolean) => `shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${on ? "bg-[#0b1f3b] text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-[#0b1f3b]"}`;
  return (
    <>
      {/* Phones and tablets */}
      <div className="space-y-2 lg:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Service categories">
          {cats.map(([name, count]) => <button key={name} type="button" role="tab" aria-selected={filters.category === name} onClick={() => set({ category: name })} className={chip(filters.category === name)}>{name} <span className="opacity-60">{count}</span></button>)}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
          {toggles.map(({ key, label, icon: Icon }) => <button key={key} type="button" aria-pressed={filters[key]} onClick={() => set({ [key]: !filters[key] })} className={`inline-flex items-center gap-1.5 ${chip(filters[key])}`}><Icon className="h-3 w-3" aria-hidden /> {label}</button>)}
        </div>
      </div>

      {/* Laptops and desktops */}
      <aside className="hidden lg:block" aria-label="Filter services">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900">Categories</h2>
            {activeFilterCount(filters) > 0 && <button type="button" onClick={() => onChange({ ...filters, category: "All", emergency: false, guaranteed: false, withMedia: false })} className="text-xs font-bold text-[#0b1f3b] underline">Clear</button>}
          </div>
          <ul className="mt-2 space-y-0.5" role="tablist" aria-label="Service categories">
            {cats.map(([name, count]) => (
              <li key={name}>
                <button type="button" role="tab" aria-selected={filters.category === name} onClick={() => set({ category: name })} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${filters.category === name ? "bg-[#0b1f3b] font-bold text-white" : "text-gray-700 hover:bg-gray-50"}`}>
                  <span className="truncate">{name}</span><span className={`ml-2 rounded-full px-2 text-xs ${filters.category === name ? "bg-white/15" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                </button>
              </li>
            ))}
          </ul>
          <h2 className="mt-5 text-sm font-extrabold text-gray-900">Show only</h2>
          <div className="mt-2 space-y-1">
            {toggles.map(({ key, label, icon: Icon }) => (
              <label key={key} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <input type="checkbox" checked={filters[key]} onChange={() => set({ [key]: !filters[key] })} className="h-4 w-4 accent-[#0b1f3b]" />
                <Icon className="h-3 w-3 text-gray-400" aria-hidden /> {label}
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
