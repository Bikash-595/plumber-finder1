import Link from "next/link";
import { rankingHref, type RankingPage } from "../directoryApi";

/** State pages: the state's cities as a scrolling row of chips (premium providers counted). */
export default function CityChips({ data }: { data: RankingPage }) {
  const { page } = data;
  if (!data.nearby.length) return null;
  return (
    <nav aria-label={`Cities in ${page.state!.name}`} className="-mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 pb-1">
        {data.nearby.map((city) => (
          <li key={city.slug} className="shrink-0">
            <Link href={rankingHref(page.limit, page.noun, page.state!.slug, city.slug)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-[#0b1f3b] hover:text-[#0b1f3b]">
              {city.name}{city.providers > 0 && <span className="rounded-full bg-[#FFD60A]/30 px-1.5 text-[11px] font-bold text-[#6b5900]">{city.providers}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
