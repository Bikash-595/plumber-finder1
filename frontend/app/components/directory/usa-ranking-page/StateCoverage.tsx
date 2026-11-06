"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { rankingHref, type RankingPage } from "../directoryApi";

/** USA pages: the states with premium providers (filterable), each opening that state's ranking. */
export default function StateCoverage({ coverage, limit, noun }: { coverage: RankingPage["coverage"]; limit: number; noun: string }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? coverage.filter((state) => state.name.toLowerCase().includes(q) || state.code.toLowerCase() === q) : coverage;
  }, [coverage, query]);
  const most = coverage[0]?.premium ?? 1;
  return (
    <section aria-labelledby="coverage-heading" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="coverage-heading" className="text-xl font-extrabold text-[#0b1f3b]">Premium coverage by state</h2>
          <p className="mt-1 text-sm text-slate-500">{coverage.length} state{coverage.length === 1 ? "" : "s"} with premium plumbing companies. Choose one for its own Top {limit}.</p>
        </div>
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Filter states</span>
          <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter states" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#0b1f3b]" />
        </label>
      </div>
      {shown.length ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((state) => (
            <li key={state.code}>
              <Link href={rankingHref(limit, noun, state.slug)} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-[#0b1f3b]/20 hover:bg-slate-50">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0b1f3b] text-xs font-extrabold text-[#FFD60A]">{state.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-800 group-hover:text-[#0b1f3b]">{state.name}</span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-[#FFD60A]" style={{ width: `${Math.max(8, Math.round((state.premium / most) * 100))}%` }} /></span>
                </span>
                <span className="text-sm font-extrabold tabular-nums text-slate-700">{state.premium}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : <p className="mt-4 text-sm text-slate-500">{coverage.length ? "No state matches that filter." : "No state has premium plumbing companies yet."}</p>}
      <Link href="/states" className="mt-4 inline-block text-sm font-bold text-[#0b1f3b] underline-offset-2 hover:underline">Browse every state →</Link>
    </section>
  );
}
