import Link from "next/link";
import { rankingHref, type RankingPage } from "../directoryApi";

/** City pages: the service filters as chips (each opens that service's ranking for the city). */
export default function ServiceChips({ data }: { data: RankingPage }) {
  const { page } = data;
  const chip = "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition";
  return (
    <nav aria-label="Services" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 pb-1">
        <li><Link href={rankingHref(page.limit, "plumbers", page.state!.slug, page.city!.slug)} aria-current={!page.service && !page.verifiedOnly ? "page" : undefined} className={`${chip} ${!page.service && !page.verifiedOnly ? "bg-[#0b1f3b] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#0b1f3b]"}`}>All plumbing</Link></li>
        <li><Link href={rankingHref(page.limit, "licensed-plumbers", page.state!.slug, page.city!.slug)} aria-current={page.verifiedOnly ? "page" : undefined} className={`${chip} ${page.verifiedOnly ? "bg-[#0b1f3b] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#0b1f3b]"}`}>Verified only</Link></li>
        {page.service && <li><span aria-current="page" className={`${chip} bg-[#0b1f3b] text-white`}>{page.service.name}</span></li>}
        {data.relatedServices.map((service) => (
          <li key={service.slug}><Link href={rankingHref(page.limit, service.urlNoun, page.state!.slug, page.city!.slug)} className={`${chip} border border-slate-200 bg-white text-slate-700 hover:border-[#0b1f3b]`}>{service.name}<span className="text-xs text-slate-400">{service.providers}</span></Link></li>
        ))}
      </ul>
    </nav>
  );
}
