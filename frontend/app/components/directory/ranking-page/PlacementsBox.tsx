import RankedProviderCard from "../RankedProviderCard";
import type { RankedProvider } from "../directoryApi";

/** Featured / sponsored placements: chosen by Plumber Finder, always labelled, never part of the ranked order. */
export default function PlacementsBox({ items }: { items: RankedProvider[] }) {
  if (!items.length) return null;
  const featuredOnly = items.every((item) => item.placement === "featured");
  return (
    <section aria-labelledby="placements-heading" className="rounded-2xl border border-dashed border-[#FFD60A] bg-[#FFD60A]/5 p-3 sm:p-4">
      <h2 id="placements-heading" className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-[#6b5900]">
        {featuredOnly ? "Featured" : "Featured & sponsored"} · placement, not part of the ranking
      </h2>
      <div className="space-y-3">{items.map((item) => <RankedProviderCard key={`placement-${item.listingId}`} item={item} sponsored />)}</div>
    </section>
  );
}
