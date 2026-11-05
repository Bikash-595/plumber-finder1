import Link from "next/link";
import { FaCheckCircle, FaChevronRight, FaFilter, FaListOl, FaMapMarkerAlt, FaStar, FaTools } from "react-icons/fa";
import { rankingHref, type RankingPage } from "./directoryApi";
import { faqs, heading, introduction, nounName, placeName } from "./directorySeo";
import DirectorySearchBox from "./DirectorySearchBox";
import RankedProviderCard from "./RankedProviderCard";
import RankingMapPanel from "./RankingMapPanel";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumberfinder.com";

/** Structured data: breadcrumbs and the ranked list (names and profile links only — no review markup). */
function JsonLd({ data }: { data: RankingPage }) {
  const crumbs = breadcrumbs(data);
  const graph = [
    { "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.label, item: `${siteUrl}${crumb.href}` })) },
    ...(data.items.length ? [{ "@type": "ItemList", name: heading(data), numberOfItems: data.items.length, itemListOrder: "https://schema.org/ItemListOrderDescending", itemListElement: data.items.map((item) => ({ "@type": "ListItem", position: item.position, name: item.name, url: `${siteUrl}${item.url}` })) }] : []),
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}

function breadcrumbs(data: RankingPage) {
  const { page } = data;
  return [
    { label: "Home", href: "/" },
    { label: page.state.name, href: `/states/${page.state.slug}` },
    ...(page.city ? [{ label: `Top ${page.limit} in ${page.state.name}`, href: rankingHref(page.limit, page.noun, page.state.slug, null) }] : []),
    { label: heading(data), href: page.path },
  ];
}

function FilterLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} scroll={false}
      className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${active ? "bg-[#0b1f3b] text-white" : "text-slate-700 hover:bg-slate-100"}`}>
      {children}
    </Link>
  );
}

function Filters({ data }: { data: RankingPage }) {
  const { page } = data;
  const allNoun = "plumbers";
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">List size</p>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {[10, 50].map((limit) => <Link key={limit} href={rankingHref(limit, page.noun, page.state.slug, page.city?.slug)} aria-current={page.limit === limit ? "page" : undefined} className={`rounded-lg py-2 text-center text-sm font-bold transition ${page.limit === limit ? "bg-white text-[#0b1f3b] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Top {limit}</Link>)}
        </div>
      </div>
      <div>
        <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Sort by</p>
        <div className="space-y-0.5">
          {data.rankingTypes.filter((type) => type.key !== "verified").map((type) => (
            <FilterLink key={type.key} href={`${page.path}${type.key === "top-rated" ? "" : `?sort=${type.key}`}`} active={page.type === type.key || (page.type === "verified" && type.key === "top-rated")}>{type.label}</FilterLink>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Show</p>
        <div className="space-y-0.5">
          <FilterLink href={rankingHref(page.limit, allNoun, page.state.slug, page.city?.slug)} active={!page.service && !page.verifiedOnly}>All plumbers</FilterLink>
          <FilterLink href={rankingHref(page.limit, "licensed-plumbers", page.state.slug, page.city?.slug)} active={page.verifiedOnly}><span className="inline-flex items-center gap-2"><FaCheckCircle className="h-3 w-3" aria-hidden />Licensed &amp; verified only</span></FilterLink>
        </div>
      </div>
      {(data.relatedServices.length > 0 || page.service) && (
        <div>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Service</p>
          <div className="space-y-0.5">
            {page.service && <FilterLink href={page.path} active>{page.service.name}</FilterLink>}
            {data.relatedServices.map((service) => <FilterLink key={service.slug} href={rankingHref(page.limit, service.urlNoun, page.state.slug, page.city?.slug)}>{service.name}<span className="text-xs font-normal text-slate-400">{service.providers}</span></FilterLink>)}
          </div>
        </div>
      )}
      {data.nearby.length > 0 && (
        <div>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">City</p>
          <div className="space-y-0.5">
            {page.city && <FilterLink href={rankingHref(page.limit, page.noun, page.state.slug, null)}>All of {page.state.name}</FilterLink>}
            {data.nearby.slice(0, 8).map((city) => <FilterLink key={city.slug} href={rankingHref(page.limit, page.noun, page.state.slug, city.slug)}>{city.name}{city.providers > 0 && <span className="text-xs font-normal text-slate-400">{city.providers}</span>}</FilterLink>)}
          </div>
        </div>
      )}
    </div>
  );
}

/** A Top 10 / Top 50 page for a state or city, optionally for one service. Server-rendered. */
export default function DirectoryRankingPage({ data }: { data: RankingPage }) {
  const { page } = data;
  const place = placeName(data);
  const noun = nounName(data);
  const questions = faqs(data);
  const pins = data.items.filter((item) => item.coordinates).map((item) => ({ position: item.position!, name: item.name, url: item.url, lat: item.coordinates!.lat, lng: item.coordinates!.lng }));
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <JsonLd data={data} />
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto">
            <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
              {breadcrumbs(data).map((crumb, index, all) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 && <FaChevronRight className="h-2.5 w-2.5 text-slate-300" aria-hidden />}
                  {index === all.length - 1 ? <span aria-current="page" className="font-semibold text-slate-700">{crumb.label}</span> : <Link href={crumb.href} className="hover:text-[#0b1f3b] hover:underline">{crumb.label}</Link>}
                </li>
              ))}
            </ol>
          </nav>
          <p className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A]/20 px-3 py-1 text-xs font-bold text-[#6b5900]"><FaListOl className="h-3 w-3" aria-hidden />Plumber Finder ranking · updated continuously</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b1f3b] sm:text-4xl">{heading(data)}</h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-600">{introduction(data)}</p>
          <dl className="mt-5 flex flex-wrap gap-2 text-sm">
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"><FaTools className="h-3.5 w-3.5 text-slate-400" aria-hidden /><dt className="text-slate-500">Ranked</dt><dd className="font-bold text-slate-900">{data.items.length}{data.qualifying > data.items.length ? ` of ${data.qualifying}` : ""}</dd></div>
            {data.stats.averageRating !== null && <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"><FaStar className="h-3.5 w-3.5 text-[#FFB800]" aria-hidden /><dt className="text-slate-500">Average rating</dt><dd className="font-bold text-slate-900">{data.stats.averageRating.toFixed(1)}</dd></div>}
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"><FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden /><dt className="text-slate-500">Verified</dt><dd className="font-bold text-slate-900">{data.stats.verified}</dd></div>
          </dl>
          <div className="mt-6 max-w-2xl"><DirectorySearchBox placeholder={`Try “Top 10 drain cleaning companies in ${page.state.name}”`} /></div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          <details className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-[#0b1f3b] [&::-webkit-details-marker]:hidden"><span className="inline-flex items-center gap-2"><FaFilter className="h-3.5 w-3.5" aria-hidden />Filters</span><FaChevronRight className="h-3 w-3 transition group-open:rotate-90" aria-hidden /></summary>
            <div className="border-t border-slate-100 p-3"><Filters data={data} /></div>
          </details>
          <div className="hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm lg:block"><Filters data={data} /></div>
        </aside>

        <div className="min-w-0 space-y-6">
          {data.sponsored.length > 0 && (
            <section aria-labelledby="sponsored-heading" className="rounded-2xl border border-dashed border-[#FFD60A] bg-[#FFD60A]/5 p-3 sm:p-4">
              <h2 id="sponsored-heading" className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-[#6b5900]">Sponsored · paid placement, not part of the ranking</h2>
              <div className="space-y-3">{data.sponsored.map((item) => <RankedProviderCard key={`sponsored-${item.listingId}`} item={item} sponsored />)}</div>
            </section>
          )}

          <section aria-labelledby="ranking-heading">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <h2 id="ranking-heading" className="text-xl font-extrabold text-[#0b1f3b]">{data.items.length ? `${data.items.length} ranked ${noun.toLowerCase()} in ${place}` : `No ${noun.toLowerCase()} in ${place} yet`}</h2>
              {data.items.length > 0 && <Link href={page.allPath} className="text-sm font-bold text-[#0b1f3b] underline-offset-2 hover:underline">See all plumbers in {page.city?.name ?? page.state.name} →</Link>}
            </div>
            {data.items.length ? (
              <ol className="space-y-3">{data.items.map((item) => <li key={item.listingId}><RankedProviderCard item={item} /></li>)}</ol>
            ) : (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
                <FaMapMarkerAlt className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
                <p className="mt-3 font-bold text-slate-800">No {noun.toLowerCase()} are listed in {place} yet.</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">We only rank real businesses. Try a nearby city below, another service, or the whole of {page.state.name}.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {page.city && <Link href={rankingHref(page.limit, page.noun, page.state.slug, null)} className="rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white">All of {page.state.name}</Link>}
                  <Link href="/add-business" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-[#0b1f3b]">List your business</Link>
                </div>
              </div>
            )}
            {data.qualifying < page.limit && data.items.length > 0 && <p className="mt-3 text-sm text-slate-500">Only {data.qualifying} provider{data.qualifying === 1 ? " qualifies" : "s qualify"} here so far — we never pad the list with made-up businesses.</p>}
          </section>

          <RankingMapPanel pins={pins} />

          {(data.nearby.length > 0 || data.relatedServices.length > 0) && (
            <section className="grid gap-4 md:grid-cols-2">
              {data.nearby.length > 0 && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-extrabold text-[#0b1f3b]">{page.city ? `Other cities in ${page.state.name}` : `Cities in ${page.state.name}`}</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">{data.nearby.map((city) => <li key={city.slug}><Link href={rankingHref(page.limit, page.noun, page.state.slug, city.slug)} className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200">{noun} in {city.name}</Link></li>)}</ul>
                </div>
              )}
              {data.relatedServices.length > 0 && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-extrabold text-[#0b1f3b]">Related services in {place}</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">{data.relatedServices.map((service) => <li key={service.slug}><Link href={rankingHref(page.limit, service.urlNoun, page.state.slug, page.city?.slug)} className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200">Top {page.limit} {service.noun.toLowerCase()}</Link></li>)}</ul>
                </div>
              )}
            </section>
          )}

          <section aria-labelledby="faq-heading" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="faq-heading" className="text-xl font-extrabold text-[#0b1f3b]">Frequently asked questions</h2>
            <div className="mt-3 divide-y divide-slate-100">
              {questions.map((item) => (
                <details key={item.question} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-slate-800 [&::-webkit-details-marker]:hidden">{item.question}<FaChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition group-open:rotate-90" aria-hidden /></summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="text-xs leading-relaxed text-slate-400">Rankings are Plumber Finder&apos;s own, based only on data from this site and ratings businesses have connected from Google. They are not Google or Yelp rankings. Paid listings are always labelled Sponsored.</p>
        </div>
      </div>
    </main>
  );
}
