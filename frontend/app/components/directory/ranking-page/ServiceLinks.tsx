import Link from "next/link";
import { rankingHref, type RankingPage } from "../directoryApi";

/** The same ranking for other services in this place (with how many premium providers offer each). */
export default function ServiceLinks({ data, title }: { data: RankingPage; title: string }) {
  const { page } = data;
  if (!data.relatedServices.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-base font-extrabold text-[#0b1f3b]">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {data.relatedServices.map((service) => (
          <li key={service.slug}>
            <Link href={rankingHref(page.limit, service.urlNoun, page.state?.slug, page.city?.slug)} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200">
              {service.noun}<span className="text-xs font-normal text-slate-400">{service.providers}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
