import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaCrown, FaMapMarkerAlt } from "react-icons/fa";
import type { RankedProvider } from "../directoryApi";
import Stars from "../ranked-card/Stars";

const medal = ["bg-[#FFD60A] text-[#0b1f3b]", "bg-slate-200 text-slate-800", "bg-amber-700/80 text-white"];

/** USA pages: the top three as large cards above the rest of the list. */
export default function TopThree({ items }: { items: RankedProvider[] }) {
  if (!items.length) return null;
  return (
    <section aria-label="Top three" className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <article key={item.listingId} className={`relative flex flex-col rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${index === 0 ? "border-[#FFD60A] ring-2 ring-[#FFD60A]/40" : "border-slate-200/80"}`}>
          <span className={`absolute -top-3 left-5 grid h-8 min-w-8 place-items-center rounded-full px-2 text-sm font-extrabold shadow ${medal[index]}`} aria-label={`Rank ${item.position}`}>{item.position}</span>
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              {item.logo ? <Image src={item.logo} alt={`${item.name} logo`} fill sizes="56px" className="object-cover" /> : <span className="grid h-full w-full place-items-center text-xl font-extrabold text-[#0b1f3b]">{item.name.slice(0, 1)}</span>}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-extrabold text-[#0b1f3b]"><Link href={item.url} className="hover:underline">{item.name}</Link></h3>
              <p className="flex items-center gap-1 truncate text-xs text-slate-500"><FaMapMarkerAlt className="h-3 w-3 shrink-0" aria-hidden />{[item.city, item.stateCode].filter(Boolean).join(", ") || "United States"}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A]/25 px-2 py-0.5 text-[11px] font-extrabold text-[#6b5900]"><FaCrown className="h-2.5 w-2.5" aria-hidden />{item.premiumTier === "elite" ? "Elite Premium" : "Premium"}</span>
            {item.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><FaCheckCircle className="h-2.5 w-2.5" aria-hidden />Verified</span>}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            {item.rating.count ? <><Stars value={item.rating.average} /><b className="text-slate-900">{item.rating.average.toFixed(1)}</b><span className="text-slate-500">({item.rating.count})</span></> : <span className="text-slate-500">No reviews yet</span>}
          </div>
          {item.description && <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{item.description}</p>}
          <Link href={item.url} className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a]">View profile</Link>
        </article>
      ))}
    </section>
  );
}
