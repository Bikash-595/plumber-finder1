import { FaCheckCircle, FaCrown, FaStar } from "react-icons/fa";
import DirectorySearchBox from "../DirectorySearchBox";
import type { RankingPage } from "../directoryApi";
import { heading, introduction } from "../directorySeo";
import Breadcrumbs from "../ranking-page/Breadcrumbs";
import LimitToggle from "../ranking-page/LimitToggle";
import CityChips from "./CityChips";

/** State pages: a light hero with the state's monogram, its numbers and a row of its cities. */
export default function StateHero({ data }: { data: RankingPage }) {
  const state = data.page.state!;
  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-white to-[#f7f8fa]">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs data={data} />
        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-start">
          <span aria-hidden className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-[#0b1f3b] text-2xl font-black tracking-wider text-[#FFD60A] shadow-lg shadow-[#0b1f3b]/20">{state.code}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{state.name} · premium plumbing directory</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#0b1f3b] sm:text-4xl">{heading(data)}</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-600">{introduction(data)}</p>
            <dl className="mt-4 flex flex-wrap gap-2 text-sm">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"><FaCrown className="h-3.5 w-3.5 text-[#d4a900]" aria-hidden /><dt className="text-slate-500">Premium</dt><dd className="font-bold text-slate-900">{data.qualifying}</dd></div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"><FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden /><dt className="text-slate-500">Verified</dt><dd className="font-bold text-slate-900">{data.verifiedQualifying}</dd></div>
              {data.stats.averageRating !== null && <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"><FaStar className="h-3.5 w-3.5 text-[#FFB800]" aria-hidden /><dt className="text-slate-500">Average rating</dt><dd className="font-bold text-slate-900">{data.stats.averageRating.toFixed(1)}</dd></div>}
            </dl>
          </div>
          <LimitToggle data={data} />
        </div>
        <div className="mt-6 max-w-2xl"><DirectorySearchBox placeholder={`Try “Top 10 drain cleaning companies in ${state.name}”`} /></div>
        <CityChips data={data} />
      </div>
    </section>
  );
}
