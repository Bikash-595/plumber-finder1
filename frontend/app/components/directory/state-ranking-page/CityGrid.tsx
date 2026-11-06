import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import { rankingHref, type RankingPage } from "../directoryApi";
import { nounName } from "../directorySeo";

/** State pages: "Plumbers by city" — every city's own ranking, those with premium providers first. */
export default function CityGrid({ data }: { data: RankingPage }) {
  const { page } = data;
  if (!data.nearby.length) return null;
  return (
    <section aria-labelledby="cities-heading" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h2 id="cities-heading" className="text-xl font-extrabold text-[#0b1f3b]">{nounName(data)} by city in {page.state!.name}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.nearby.map((city) => (
          <li key={city.slug}>
            <Link href={rankingHref(page.limit, page.noun, page.state!.slug, city.slug)} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-50">
              <span className="inline-flex min-w-0 items-center gap-2 font-semibold text-slate-700"><FaMapMarkerAlt className="h-3 w-3 shrink-0 text-slate-400" aria-hidden /><span className="truncate">Top {page.limit} in {city.name}</span></span>
              <span className="shrink-0 text-xs text-slate-400">{city.providers ? `${city.providers} premium` : "—"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
