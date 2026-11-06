import type { RankingPage } from "../directoryApi";
import { faqs } from "../directorySeo";
import RankingMapPanel from "../RankingMapPanel";
import Disclaimer from "../ranking-page/Disclaimer";
import FaqSection from "../ranking-page/FaqSection";
import FilterPanel from "../ranking-page/FilterPanel";
import JsonLd from "../ranking-page/JsonLd";
import { mapPins } from "../ranking-page/mapPins";
import PlacementsBox from "../ranking-page/PlacementsBox";
import RankedList from "../ranking-page/RankedList";
import PopularServices from "./PopularServices";
import StateCoverage from "./StateCoverage";
import TopThree from "./TopThree";
import UsaHero from "./UsaHero";

/** USA-wide Top 10 / Top 50: national hero, the top three, the full list with state filters, coverage by state and services. */
export default function UsaRankingPage({ data }: { data: RankingPage }) {
  const top = data.items.slice(0, 3);
  const rest = data.items.slice(3);
  return (
    <main className="min-h-screen bg-[#f4f6f9]">
      <JsonLd data={data} />
      <UsaHero data={data} />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <PlacementsBox items={data.sponsored} />
        {top.length > 0 && <TopThree items={top} />}
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <FilterPanel data={data} />
          <section aria-labelledby="ranking-heading" className="min-w-0">
            <h2 id="ranking-heading" className="mb-3 text-xl font-extrabold text-[#0b1f3b]">{rest.length ? `Ranks 4–${data.items.length}` : data.items.length ? `All ${data.items.length} ranked above` : "The ranking"}</h2>
            <RankedList data={data} items={rest} />
          </section>
        </div>
        {data.sections.map && <RankingMapPanel pins={mapPins(data.items)} height={380} />}
        <StateCoverage coverage={data.coverage} limit={data.page.limit} noun={data.page.noun} />
        <PopularServices data={data} />
        {data.sections.faq && <FaqSection title="Premium plumbers in the USA: questions" items={faqs(data)} />}
        <Disclaimer />
      </div>
    </main>
  );
}
