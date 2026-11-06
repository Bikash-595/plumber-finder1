import { FaChevronRight, FaFilter } from "react-icons/fa";
import type { RankingPage } from "../directoryApi";
import Filters from "./Filters";

/** The filters as a sticky sidebar on desktop and a fold-out panel on phones and tablets. */
export default function FilterPanel({ data }: { data: RankingPage }) {
  return (
    <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
      <details className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-[#0b1f3b] [&::-webkit-details-marker]:hidden"><span className="inline-flex items-center gap-2"><FaFilter className="h-3.5 w-3.5" aria-hidden />Filters</span><FaChevronRight className="h-3 w-3 transition group-open:rotate-90" aria-hidden /></summary>
        <div className="border-t border-slate-100 p-3"><Filters data={data} /></div>
      </details>
      <div className="hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm lg:block"><Filters data={data} /></div>
    </aside>
  );
}
