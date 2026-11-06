import Link from "next/link";
import { FaCrown } from "react-icons/fa";
import type { RankingPage } from "../directoryApi";
import { placeName } from "../directorySeo";

/** Under a list shorter than its number: how many premium providers there really are, and where everyone else is. */
export default function PremiumNotice({ data }: { data: RankingPage }) {
  const { page, qualifying, otherProviders } = data;
  if (!data.items.length || qualifying >= page.limit) return null;
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FFD60A] text-[#0b1f3b]"><FaCrown className="h-4 w-4" aria-hidden /></span>
        <p className="text-sm text-slate-700">
          <b className="text-slate-900">{qualifying} premium provider{qualifying === 1 ? "" : "s"} in {placeName(data)} so far.</b>{" "}
          This Top {page.limit} only lists premium members, so it is never padded with other businesses.
          {otherProviders > 0 && <> {otherProviders} more plumber{otherProviders === 1 ? " is" : "s are"} listed in the full directory.</>}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {otherProviders > 0 && <Link href={page.allPath} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#0b1f3b] hover:bg-slate-50">See all plumbers</Link>}
        <Link href="/add-business" className="rounded-xl bg-[#0b1f3b] px-3 py-2 text-sm font-bold text-white hover:bg-[#17345a]">Become premium</Link>
      </div>
    </div>
  );
}
