import RankedProviderCard from "../RankedProviderCard";
import type { RankedProvider, RankingPage } from "../directoryApi";
import EmptyRanking from "./EmptyRanking";
import PremiumNotice from "./PremiumNotice";

/**
 * The ranked premium providers (or the empty state), then the note when there are fewer than the list's number.
 * `items` shows part of the list (e.g. from #4 when the top three are shown above it).
 */
export default function RankedList({ data, items = data.items }: { data: RankingPage; items?: RankedProvider[] }) {
  if (!data.items.length) return <EmptyRanking data={data} />;
  return (
    <>
      <ol className="space-y-3" start={items[0]?.position}>{items.map((item) => <li key={item.listingId}><RankedProviderCard item={item} /></li>)}</ol>
      <PremiumNotice data={data} />
    </>
  );
}
