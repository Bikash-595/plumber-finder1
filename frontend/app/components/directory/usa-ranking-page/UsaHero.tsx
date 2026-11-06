import { FaCheckCircle, FaCrown, FaFlagUsa, FaStar } from "react-icons/fa";
import DirectorySearchBox from "../DirectorySearchBox";
import type { RankingPage } from "../directoryApi";
import { heading, introduction } from "../directorySeo";
import Breadcrumbs from "../ranking-page/Breadcrumbs";
import LimitToggle from "../ranking-page/LimitToggle";

/** USA pages: a dark, country-wide hero with the national numbers. */
export default function UsaHero({ data }: { data: RankingPage }) {
  const stats = [
    { icon: FaCrown, label: "Premium companies", value: String(data.qualifying), tint: "text-[#FFD60A]" },
    { icon: FaFlagUsa, label: "States covered", value: String(data.coverage.length), tint: "text-sky-300" },
    { icon: FaCheckCircle, label: "Verified businesses", value: String(data.verifiedQualifying), tint: "text-emerald-300" },
    ...(data.stats.averageRating !== null ? [{ icon: FaStar, label: "Average rating", value: data.stats.averageRating.toFixed(1), tint: "text-amber-300" }] : []),
  ];
  return (
    <section className="relative overflow-hidden bg-[#0b1f3b] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_85%_-10%,rgba(255,214,10,0.18),transparent),radial-gradient(40rem_25rem_at_0%_110%,rgba(56,189,248,0.15),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14">
        <Breadcrumbs data={data} tone="dark" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#FFD60A] ring-1 ring-inset ring-white/15"><FaFlagUsa className="h-3 w-3" aria-hidden />Premium directory · all 50 states</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">{heading(data)}</h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/75">{introduction(data)}</p>
          </div>
          <LimitToggle data={data} tone="dark" />
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
              <dt className="flex items-center gap-2 text-xs font-semibold text-white/60"><stat.icon className={`h-3.5 w-3.5 ${stat.tint}`} aria-hidden />{stat.label}</dt>
              <dd className="mt-1 text-2xl font-extrabold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 max-w-2xl [&_input]:bg-white"><DirectorySearchBox placeholder="Try “Top 10 plumbers in California” or a city" /></div>
      </div>
    </section>
  );
}
