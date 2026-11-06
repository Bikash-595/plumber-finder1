import Link from "next/link";
import { FaTools } from "react-icons/fa";
import { rankingHref, type RankingPage } from "../directoryApi";

/** USA pages: the nationwide ranking of each service, as cards. */
export default function PopularServices({ data }: { data: RankingPage }) {
  if (!data.relatedServices.length) return null;
  return (
    <section aria-labelledby="services-heading">
      <h2 id="services-heading" className="mb-3 text-xl font-extrabold text-[#0b1f3b]">Popular services across America</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.relatedServices.slice(0, 8).map((service) => (
          <li key={service.slug}>
            <Link href={rankingHref(data.page.limit, service.urlNoun, null)} className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <FaTools className="h-4 w-4 text-[#0b1f3b]" aria-hidden />
              <span className="mt-3 text-sm font-extrabold text-slate-900">Top {data.page.limit} {service.noun}</span>
              <span className="mt-1 text-xs text-slate-500">{service.providers} premium provider{service.providers === 1 ? "" : "s"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
