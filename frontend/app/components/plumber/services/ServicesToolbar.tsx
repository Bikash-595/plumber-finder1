import { FaSearch, FaTimes } from "react-icons/fa";

type Props = { categories: [string, number][]; total: number; category: string; onCategory: (name: string) => void; query: string; onQuery: (text: string) => void; showSearch: boolean };

/** Category tabs (scroll sideways on phones) and, for longer lists, a search box. */
export default function ServicesToolbar({ categories, total, category, onCategory, query, onQuery, showSearch }: Props) {
  if (categories.length < 2 && !showSearch) return null;
  return (
    <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
      {categories.length > 1 ? (
        <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Service categories">
          {[["All", total] as [string, number], ...categories].map(([name, count]) => (
            <button key={name} type="button" role="tab" aria-selected={category === name} onClick={() => onCategory(name)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${category === name ? "bg-[#0b1f3b] text-white shadow" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-[#0b1f3b]"}`}>
              {name} <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${category === name ? "bg-white/15 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
            </button>
          ))}
        </div>
      ) : <span />}
      {showSearch && (
        <label className="relative block w-full shrink-0 @2xl:w-56">
          <span className="sr-only">Search services</span>
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden />
          <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search services…" className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
          {query && <button type="button" onClick={() => onQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-gray-400 hover:bg-gray-100"><FaTimes className="h-2.5 w-2.5" /></button>}
        </label>
      )}
    </div>
  );
}
