import { FaCheckCircle } from "react-icons/fa";
import { rankingHref, type RankingPage } from "../directoryApi";
import FilterLink from "./FilterLink";
import LimitToggle from "./LimitToggle";

const Label = ({ children }: { children: React.ReactNode }) => <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">{children}</p>;

/** List size, order, licensed-only, service and place (states on USA pages, cities on state and city pages). */
export default function Filters({ data }: { data: RankingPage }) {
  const { page } = data;
  const state = page.state?.slug;
  return (
    <div className="space-y-6">
      <div>
        <Label>List size</Label>
        <div className="[&>div]:grid [&>div]:w-full"><LimitToggle data={data} /></div>
      </div>
      <div>
        <Label>Sort by</Label>
        <div className="space-y-0.5">
          {data.rankingTypes.filter((type) => type.key !== "verified").map((type) => (
            <FilterLink key={type.key} href={`${page.path}${type.key === "top-rated" ? "" : `?sort=${type.key}`}`} active={page.type === type.key || (page.type === "verified" && type.key === "top-rated")}>{type.label}</FilterLink>
          ))}
        </div>
      </div>
      <div>
        <Label>Show</Label>
        <div className="space-y-0.5">
          <FilterLink href={rankingHref(page.limit, "plumbers", state, page.city?.slug)} active={!page.service && !page.verifiedOnly}>All premium plumbers</FilterLink>
          <FilterLink href={rankingHref(page.limit, "licensed-plumbers", state, page.city?.slug)} active={page.verifiedOnly}><span className="inline-flex items-center gap-2"><FaCheckCircle className="h-3 w-3" aria-hidden />Verified businesses only</span></FilterLink>
        </div>
      </div>
      {(data.relatedServices.length > 0 || page.service) && (
        <div>
          <Label>Service</Label>
          <div className="space-y-0.5">
            {page.service && <FilterLink href={page.path} active>{page.service.name}</FilterLink>}
            {data.relatedServices.map((service) => <FilterLink key={service.slug} href={rankingHref(page.limit, service.urlNoun, state, page.city?.slug)}>{service.name}<span className="text-xs font-normal text-slate-400">{service.providers}</span></FilterLink>)}
          </div>
        </div>
      )}
      {page.scope === "usa" && data.coverage.length > 0 && (
        <div>
          <Label>State</Label>
          <div className="space-y-0.5">
            {data.coverage.slice(0, 10).map((item) => <FilterLink key={item.code} href={rankingHref(page.limit, page.noun, item.slug)}>{item.name}<span className="text-xs font-normal text-slate-400">{item.premium}</span></FilterLink>)}
          </div>
        </div>
      )}
      {page.state && data.nearby.length > 0 && (
        <div>
          <Label>City</Label>
          <div className="space-y-0.5">
            {page.city && <FilterLink href={rankingHref(page.limit, page.noun, state)}>All of {page.state.name}</FilterLink>}
            {data.nearby.slice(0, 8).map((city) => <FilterLink key={city.slug} href={rankingHref(page.limit, page.noun, state, city.slug)}>{city.name}{city.providers > 0 && <span className="text-xs font-normal text-slate-400">{city.providers}</span>}</FilterLink>)}
          </div>
        </div>
      )}
    </div>
  );
}
