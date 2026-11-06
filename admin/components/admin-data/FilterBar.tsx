"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

/** Search box (debounced) + status filter chips. */
export default function FilterBar({ search, onSearch, status, onStatus, statuses, placeholder }: {
  search: string; onSearch: (value: string) => void; status: string; onStatus: (value: string) => void;
  statuses: { value: string; label: string; count?: number }[]; placeholder: string;
}) {
  const [text, setText] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => { if (text !== search) onSearch(text); }, 300);
    return () => clearTimeout(timer);
  }, [text, search, onSearch]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block w-full lg:max-w-sm">
        <span className="sr-only">Search</span>
        <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden />
        <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0b1f3b] focus:ring-2 focus:ring-[#0b1f3b]/15" />
      </label>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {statuses.map((option) => (
          <button key={option.value} type="button" aria-pressed={status === option.value} onClick={() => onStatus(option.value)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${status === option.value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
            {option.label}{option.count !== undefined ? ` (${option.count})` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
