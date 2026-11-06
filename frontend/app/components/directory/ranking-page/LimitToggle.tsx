import Link from "next/link";
import { rankingHref, type RankingPage } from "../directoryApi";

/** Top 10 | Top 50 for the same place and service. */
export default function LimitToggle({ data, tone = "light" }: { data: RankingPage; tone?: "light" | "dark" }) {
  const { page } = data;
  const dark = tone === "dark";
  return (
    <div className={`inline-grid grid-cols-2 gap-1 rounded-xl p-1 ${dark ? "bg-white/10" : "bg-slate-100"}`}>
      {[10, 50].map((limit) => {
        const active = page.limit === limit;
        return (
          <Link key={limit} href={rankingHref(limit, page.noun, page.state?.slug, page.city?.slug)} aria-current={active ? "page" : undefined}
            className={`rounded-lg px-4 py-2 text-center text-sm font-bold transition ${active ? (dark ? "bg-[#FFD60A] text-[#0b1f3b]" : "bg-white text-[#0b1f3b] shadow-sm") : dark ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-slate-700"}`}>
            Top {limit}
          </Link>
        );
      })}
    </div>
  );
}
