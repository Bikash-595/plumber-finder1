import type { RankingPage } from "../directoryApi";
import { faqs, nounName } from "../directorySeo";
import RankingMapPanel from "../RankingMapPanel";
import Disclaimer from "../ranking-page/Disclaimer";
import FaqSection from "../ranking-page/FaqSection";
import FilterPanel from "../ranking-page/FilterPanel";
import JsonLd from "../ranking-page/JsonLd";
import { mapPins } from "../ranking-page/mapPins";
import PlacementsBox from "../ranking-page/PlacementsBox";
import RankedList from "../ranking-page/RankedList";
import ServiceLinks from "../ranking-page/ServiceLinks";
import CityGrid from "./CityGrid";
import StateHero from "./StateHero";

/** State-wide Top 10 / Top 50: state hero with city chips, sidebar filters, the list, cities, services and state FAQs. */
export default function StateRankingPage({ data }: { data: RankingPage }) {
  const state = data.page.state!;
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <JsonLd data={data} />
      <StateHero data={data} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <FilterPanel data={data} />
        <div className="min-w-0 space-y-6">
          <PlacementsBox items={data.sponsored} />
          <section aria-labelledby="ranking-heading">
            <h2 id="ranking-heading" className="mb-3 text-xl font-extrabold text-[#0b1f3b]">{data.items.length ? `${data.items.length} premium ${nounName(data).toLowerCase()} in ${state.name}` : `${nounName(data)} in ${state.name}`}</h2>
            <RankedList data={data} />
          </section>
          {data.sections.map && <RankingMapPanel pins={mapPins(data.items)} />}
          <CityGrid data={data} />
          <ServiceLinks data={data} title={`Other services in ${state.name}`} />
          {data.sections.faq && <FaqSection title={`Plumbers in ${state.name}: questions`} items={faqs(data)} />}
          <Disclaimer />
        </div>
      </div>
    </main>
  );
}
