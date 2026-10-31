import Link from "next/link";
import { FaBalanceScale, FaMapMarkerAlt, FaStar, FaTag, FaTrashAlt } from "react-icons/fa";
import type { ListItem } from "@/components/utils/userApi";

type Props = { item: ListItem; comparing: boolean; compareFull: boolean; busy: boolean; onCompare: () => void; onRemove: () => void };

/** A saved plumber: photo, rating, location, price, deal, and quick actions. */
export default function SavedCard({ item, comparing, compareFull, busy, onCompare, onRemove }: Props) {
  const href = `/plumber/${encodeURIComponent(item.providerId)}`;
  return (
    <article className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- snapshot images come from any allowed host */}
        <img src={item.image || "/Plumber.png"} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 object-cover" />
        <div className="min-w-0 flex-1">
          <Link href={href} className="line-clamp-1 font-bold text-gray-900 hover:underline">{item.name}</Link>
          <p className="text-xs capitalize text-gray-500">{item.providerType}</p>
          {item.rating !== undefined && (
            <p className="mt-1 flex items-center gap-1 text-sm">
              <FaStar className="h-3.5 w-3.5 text-[#FFD60A]" aria-hidden />
              <span className="font-semibold text-gray-900">{item.rating.toFixed(1)}</span>
              {item.reviewCount !== undefined && <span className="text-xs text-gray-500">({item.reviewCount})</span>}
            </p>
          )}
        </div>
        <button type="button" onClick={onRemove} disabled={busy} aria-label={`Remove ${item.name} from saved`} title="Remove" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
          <FaTrashAlt className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {item.location && <span className="inline-flex items-center gap-1 text-gray-600"><FaMapMarkerAlt className="h-3 w-3 text-gray-400" />{item.location}</span>}
        {item.priceRange && <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">{item.priceRange}</span>}
        {item.discount && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700"><FaTag className="h-2.5 w-2.5" />{item.discount}</span>}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <Link href={`/book-plumber?plumber=${encodeURIComponent(item.providerId)}`} className="rounded-full bg-[#FFD60A] px-3 py-2 text-center text-sm font-bold text-[#0b1f3b] hover:brightness-95">Book</Link>
        <button type="button" onClick={onCompare} disabled={busy || (!comparing && compareFull)} aria-pressed={comparing}
          title={!comparing && compareFull ? "You can compare up to 3 plumbers" : undefined}
          className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${comparing ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-300 text-gray-700 hover:border-[#0b1f3b]"}`}>
          <FaBalanceScale className="h-3.5 w-3.5" /> {comparing ? "Comparing" : "Compare"}
        </button>
      </div>
    </article>
  );
}
