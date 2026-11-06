import Link from "next/link";
import { FaGoogle, FaStar } from "react-icons/fa";
import type { RankingPage } from "../directoryApi";
import Stars from "../ranked-card/Stars";

/** City pages: what customers say — the review totals and the most-reviewed plumbers here (real counts only). */
export default function CustomerReviews({ data }: { data: RankingPage }) {
  const reviewed = data.items.filter((item) => item.rating.count > 0).sort((a, b) => b.rating.count - a.rating.count).slice(0, 4);
  if (!reviewed.length) return null;
  const google = data.items.reduce((sum, item) => sum + (item.rating.google?.count ?? 0), 0);
  return (
    <section aria-labelledby="reviews-heading" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 id="reviews-heading" className="text-base font-extrabold text-[#0b1f3b]">Customer reviews in {data.page.city!.name}</h2>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-4xl font-black tabular-nums text-slate-900">{data.stats.averageRating?.toFixed(1) ?? "—"}</span>
        <div className="pb-1">
          {data.stats.averageRating !== null && <Stars value={data.stats.averageRating} />}
          <p className="text-xs text-slate-500">{data.stats.reviews} review{data.stats.reviews === 1 ? "" : "s"}{google ? <> · <FaGoogle className="inline h-2.5 w-2.5" aria-hidden /> {google} from Google</> : null}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {reviewed.map((item) => (
          <li key={item.listingId}>
            <Link href={`${item.url}#reviews`} className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm hover:bg-slate-50">
              <span className="truncate font-semibold text-slate-700">{item.name}</span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-500"><FaStar className="h-3 w-3 text-[#FFB800]" aria-hidden /><b className="text-slate-800">{item.rating.average.toFixed(1)}</b> ({item.rating.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
