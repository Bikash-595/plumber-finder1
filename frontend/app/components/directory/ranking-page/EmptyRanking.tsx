import Link from "next/link";
import { FaCrown } from "react-icons/fa";
import { rankingHref, type RankingPage } from "../directoryApi";
import { nounName, placeName } from "../directorySeo";

/** No premium provider here yet: say so plainly and offer the places and services that do have rankings. */
export default function EmptyRanking({ data }: { data: RankingPage }) {
  const { page } = data;
  const noun = nounName(data).toLowerCase();
  const nearby = data.nearby.filter((city) => city.providers > 0).slice(0, 4);
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#FFD60A]/20 text-[#8a7300]"><FaCrown className="h-6 w-6" aria-hidden /></span>
      <p className="mt-4 text-lg font-extrabold text-slate-900">No premium {noun} in {placeName(data)} yet</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        We only rank real premium businesses.{data.otherProviders > 0 ? ` ${data.otherProviders} other plumber${data.otherProviders === 1 ? " is" : "s are"} listed here in the full directory.` : ""} Try another location or service below.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {data.otherProviders > 0 && <Link href={page.allPath} className="rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white">See all plumbers here</Link>}
        {page.city && page.state && <Link href={rankingHref(page.limit, page.noun, page.state.slug)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-[#0b1f3b]">All of {page.state.name}</Link>}
        {page.state && <Link href={rankingHref(page.limit, page.noun, null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-[#0b1f3b]">Top {page.limit} in the USA</Link>}
        {nearby.map((city) => <Link key={city.slug} href={rankingHref(page.limit, page.noun, page.state?.slug, city.slug)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-[#0b1f3b]">{city.name}</Link>)}
        <Link href="/add-business" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-[#6b5900]">List your business</Link>
      </div>
    </div>
  );
}
