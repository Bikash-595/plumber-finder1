"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FaSearch } from "react-icons/fa";

/**
 * Loads admin data and reloads whenever `key` changes (e.g. when the filters change).
 * `load` may change every render; the latest one is always used.
 */
export function useAdminQuery<T>(key: string, load: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState("");
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loadRef = useRef(load);
  useEffect(() => { loadRef.current = load; });

  const reload = useCallback(() => loadRef.current()
    .then((result) => { setData(result); setError(""); setLoadedKey(key); })
    .catch((caught: Error) => { setError(caught.message); setLoadedKey(key); }), [key]);

  useEffect(() => {
    let cancelled = false;
    loadRef.current()
      .then((result) => { if (!cancelled) { setData(result); setError(""); setLoadedKey(key); } })
      .catch((caught: Error) => { if (!cancelled) { setError(caught.message); setLoadedKey(key); } });
    return () => { cancelled = true; };
  }, [key]);

  return { data, error, setError, loading: loadedKey !== key, reload };
}

/** Search box (debounced) + status filter chips. */
export function FilterBar({ search, onSearch, status, onStatus, statuses, placeholder }: {
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

export function Pager({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit) return <p className="mt-4 text-xs text-gray-500">{total} result{total === 1 ? "" : "s"}</p>;
  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
      <p className="text-xs text-gray-500">Page {page} of {pages} · {total} results</p>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button>
        <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

const badgeTones: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200", verified: "bg-emerald-50 text-emerald-700 ring-emerald-200", completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200", scheduled: "bg-blue-50 text-blue-700 ring-blue-200",
  suspended: "bg-red-50 text-red-700 ring-red-200", rejected: "bg-red-50 text-red-700 ring-red-200", cancelled: "bg-gray-100 text-gray-600 ring-gray-200", declined: "bg-red-50 text-red-700 ring-red-200",
  user: "bg-sky-50 text-sky-700 ring-sky-200", company: "bg-indigo-50 text-indigo-700 ring-indigo-200", freelancer: "bg-violet-50 text-violet-700 ring-violet-200",
};

/** Coloured status pill; `label` replaces the raw value (e.g. "scheduled" shown as "Confirmed"). */
export function StatusBadge({ value, label }: { value: string; label?: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${badgeTones[value] ?? "bg-gray-100 text-gray-600 ring-gray-200"}`}>{label ?? value}</span>;
}

/** Table wrapper that scrolls sideways on small screens and shows loading / empty / error states. */
export function DataTable({ head, loading, error, empty, children }: { head: string[]; loading: boolean; error?: string; empty: boolean; children: ReactNode }) {
  return (
    <div className="mt-5 overflow-x-auto">
      {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-gray-500">
            {head.map((heading) => <th key={heading} className="border-b border-gray-200 px-4 py-3 font-semibold">{heading}</th>)}
          </tr>
        </thead>
        <tbody className={loading ? "opacity-50" : ""}>
          {children}
          {!loading && empty && <tr><td colSpan={head.length} className="px-4 py-10 text-center text-gray-500">Nothing found.</td></tr>}
          {loading && empty && <tr><td colSpan={head.length} className="px-4 py-10 text-center text-gray-500">Loading…</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
