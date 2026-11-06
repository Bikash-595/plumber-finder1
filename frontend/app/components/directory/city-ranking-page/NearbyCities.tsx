import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { rankingHref, type RankingPage } from "../directoryApi";

/** City pages: other cities in the state, and the state and USA rankings, for moving around. */
export default function NearbyCities({ data }: { data: RankingPage }) {
  const { page } = data;
  return (
    <section aria-labelledby="nearby-heading" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 id="nearby-heading" className="text-base font-extrabold text-[#0b1f3b]">Nearby cities</h2>
      {data.nearby.length > 0 && (
        <ul className="mt-3 space-y-1">
          {data.nearby.slice(0, 8).map((city) => (
            <li key={city.slug}>
              <Link href={rankingHref(page.limit, page.noun, page.state!.slug, city.slug)} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                {city.name}<span className="text-xs font-normal text-slate-400">{city.providers ? `${city.providers} premium` : ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm font-bold">
        <Link href={rankingHref(page.limit, page.noun, page.state!.slug)} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-[#0b1f3b] hover:bg-slate-50">All of {page.state!.name}<FaArrowRight className="h-3 w-3" aria-hidden /></Link>
        <Link href={rankingHref(page.limit, page.noun, null)} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-[#0b1f3b] hover:bg-slate-50">Top {page.limit} in the USA<FaArrowRight className="h-3 w-3" aria-hidden /></Link>
      </div>
    </section>
  );
}
