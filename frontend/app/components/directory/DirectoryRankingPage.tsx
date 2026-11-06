import type { RankingPage } from "./directoryApi";
import CityRankingPage from "./city-ranking-page/CityRankingPage";
import StateRankingPage from "./state-ranking-page/StateRankingPage";
import UsaRankingPage from "./usa-ranking-page/UsaRankingPage";

/** A Top 10 / Top 50 page in the design for its level: the whole USA, one state or one city. Server-rendered. */
export default function DirectoryRankingPage({ data }: { data: RankingPage }) {
  if (data.page.scope === "usa") return <UsaRankingPage data={data} />;
  if (data.page.scope === "city") return <CityRankingPage data={data} />;
  return <StateRankingPage data={data} />;
}
