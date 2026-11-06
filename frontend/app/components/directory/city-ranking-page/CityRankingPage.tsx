import type { RankingPage } from "../directoryApi";
import { faqs, nounName } from "../directorySeo";
import Disclaimer from "../ranking-page/Disclaimer";
import EmptyRanking from "../ranking-page/EmptyRanking";
import FaqSection from "../ranking-page/FaqSection";
import JsonLd from "../ranking-page/JsonLd";
import PlacementsBox from "../ranking-page/PlacementsBox";
import PremiumNotice from "../ranking-page/PremiumNotice";
import CityHero from "./CityHero";
import CustomerReviews from "./CustomerReviews";
import DistanceFilteredList from "./DistanceFilteredList";
import NearbyCities from "./NearbyCities";
import ServiceChips from "./ServiceChips";

/** City-wide Top 10 / Top 50: map hero, service chips, the list with a distance filter, reviews and nearby cities. */
export default function CityRankingPage({ data }: { data: RankingPage }) {
  const city = data.page.city!;
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <JsonLd data={data} />
      <CityHero data={data} />
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <ServiceChips data={data} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <PlacementsBox items={data.sponsored} />
            <section aria-labelledby="ranking-heading">
              <h2 id="ranking-heading" className="mb-3 text-xl font-extrabold text-[#0b1f3b]">{data.items.length ? `${data.items.length} premium ${nounName(data).toLowerCase()} serving ${city.name}` : `${nounName(data)} in ${city.name}`}</h2>
              {data.items.length ? <><DistanceFilteredList items={data.items} cityName={city.name} /><PremiumNotice data={data} /></> : <EmptyRanking data={data} />}
            </section>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <CustomerReviews data={data} />
            <NearbyCities data={data} />
          </aside>
        </div>
        {data.sections.faq && <FaqSection title={`Plumbers in ${city.name}: questions`} items={faqs(data)} />}
        <Disclaimer />
      </div>
    </main>
  );
}
