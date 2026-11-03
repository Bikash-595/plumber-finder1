import { FaSearch, FaTimes } from "react-icons/fa";
import { SORT_LABELS, type ServiceSort } from "./directory/servicesFilter";

type Props = { query: string; onQuery: (text: string) => void; sort: ServiceSort; onSort: (sort: ServiceSort) => void; shown: number; total: number };

/** Search, how many services match, and the sort order (all-services page). */
export default function ServicesToolbar({ query, onQuery, sort, onSort, shown, total }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-sm">
        <span className="sr-only">Search services</span>
        <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden />
        <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search services…" className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
        {query && <button type="button" onClick={() => onQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-gray-400 hover:bg-gray-100"><FaTimes className="h-2.5 w-2.5" /></button>}
      </label>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="whitespace-nowrap text-sm text-gray-500" aria-live="polite"><strong className="text-gray-900">{shown}</strong> of {total} services</p>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden sm:inline">Sort</span>
          <select value={sort} onChange={(e) => onSort(e.target.value as ServiceSort)} aria-label="Sort services" className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800">
            {(Object.keys(SORT_LABELS) as ServiceSort[]).map((key) => <option key={key} value={key}>{SORT_LABELS[key]}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}
