import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaClock, FaCrown, FaExternalLinkAlt, FaGoogle, FaLocationArrow, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import type { RankedProvider } from "./directoryApi";
import Stars from "@/components/directory/ranked-card/Stars";
import { hoursSummary } from "@/components/directory/ranked-card/openingHours";

/** One provider on a Top 10 / Top 50 page (or in the featured / sponsored box when `sponsored`). */
export default function RankedProviderCard({ item, sponsored = false }: { item: RankedProvider; sponsored?: boolean }) {
  const hours = hoursSummary(item.weeklyHours ?? []);
  const rating = item.rating;
  const sources = [rating.platform.count ? `Plumber Finder ${rating.platform.average.toFixed(1)} (${rating.platform.count})` : null, rating.google ? `Google ${rating.google.rating.toFixed(1)} (${rating.google.count})` : null].filter(Boolean);
  return (
    <article className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${sponsored ? "border-[#FFD60A]/70" : "border-gray-200/80"}`} aria-label={`${item.position ? `#${item.position} ` : ""}${item.name}`}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <div className="flex items-start gap-4 sm:block">
          <div className="relative">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:h-24 sm:w-24">
              {item.logo ? <Image src={item.logo} alt={`${item.name} logo`} fill sizes="96px" className="object-cover" /> : <span className="grid h-full w-full place-items-center text-2xl font-extrabold text-[#0b1f3b]">{item.name.slice(0, 1)}</span>}
            </div>
            {item.position && <span className="absolute -left-2 -top-2 grid h-9 min-w-9 place-items-center rounded-full border-2 border-white bg-[#0b1f3b] px-2 text-sm font-extrabold text-white shadow" aria-label={`Rank ${item.position}`}>{item.position}</span>}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {sponsored && <span className="rounded-md bg-[#FFD60A] px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#0b1f3b]">{item.placement === "featured" ? "Featured" : "Sponsored"}</span>}
            <h3 className="text-lg font-extrabold leading-tight text-[#0b1f3b]"><Link href={item.url} className="hover:underline">{item.name}</Link></h3>
            {item.premiumTier && <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FFD60A] to-[#FFC300] px-2 py-0.5 text-xs font-extrabold text-[#0b1f3b]"><FaCrown className="h-3 w-3" aria-hidden />{item.premiumTier === "elite" ? "Elite Premium" : "Premium Company"}</span>}
            {item.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200"><FaCheckCircle className="h-3 w-3" aria-hidden />Verified Business</span>}
            {item.isEmergency && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-200">24/7 emergency</span>}
            <span className="text-xs font-medium text-gray-400">{item.providerType === "company" ? "Company" : "Independent plumber"}</span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {rating.count ? (
              <>
                <Stars value={rating.average} />
                <span className="font-bold text-gray-900">{rating.average.toFixed(1)}</span>
                <span className="text-gray-500">({rating.count} review{rating.count === 1 ? "" : "s"})</span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">{rating.google && <FaGoogle className="h-3 w-3" aria-hidden />}{sources.join(" · ")}</span>
              </>
            ) : <span className="text-gray-500">No reviews yet</span>}
            {item.completedJobs > 0 && <span className="text-xs font-semibold text-gray-500">· {item.completedJobs} job{item.completedJobs === 1 ? "" : "s"} completed on Plumber Finder</span>}
          </div>

          {item.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{item.description}</p>}

          <dl className="mt-3 grid gap-1.5 text-sm text-gray-600 sm:grid-cols-2">
            {item.address && <div className="flex items-start gap-2"><dt className="sr-only">Address</dt><FaMapMarkerAlt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden /><dd className="min-w-0">{item.address}</dd></div>}
            {hours && <div className="flex items-start gap-2"><dt className="sr-only">Opening hours</dt><FaClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden /><dd className="min-w-0">{hours}</dd></div>}
            {item.distanceMiles !== undefined && <div className="flex items-start gap-2"><dt className="sr-only">Distance</dt><FaLocationArrow className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden /><dd className="min-w-0">{item.distanceMiles < 1 ? "Under 1 mile" : `${item.distanceMiles.toFixed(item.distanceMiles < 10 ? 1 : 0)} miles`} from the city centre</dd></div>}
          </dl>

          {item.services.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Services">
              {item.services.slice(0, 5).map((service) => <li key={service} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">{service}</li>)}
              {item.services.length > 5 && <li className="px-1 py-1 text-xs text-gray-400">+{item.services.length - 5} more</li>}
            </ul>
          )}

          {!sponsored && item.breakdown?.length > 0 && (
            <details className="group mt-3 text-sm">
              <summary className="cursor-pointer list-none text-xs font-bold text-[#0b1f3b] underline-offset-2 hover:underline [&::-webkit-details-marker]:hidden">Why this rank? <span className="font-normal text-gray-500">Score {item.score.toFixed(1)} / 100</span></summary>
              <ul className="mt-2 space-y-1.5 rounded-xl bg-gray-50 p-3">
                {item.breakdown.map((factor) => (
                  <li key={factor.key} className="grid grid-cols-[minmax(0,1fr)_6rem_3rem] items-center gap-3 text-xs">
                    <span className="truncate text-gray-600">{factor.label} <span className="text-gray-400">({factor.weight}%)</span></span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-gray-200"><span className="block h-full rounded-full bg-[#0b1f3b]" style={{ width: `${Math.round(factor.value * 100)}%` }} /></span>
                    <span className="text-right font-semibold tabular-nums text-gray-700">{factor.points.toFixed(1)}</span>
                  </li>
                ))}
                {item.newBusinessPenalty > 0 && <li className="text-xs text-gray-500">New on Plumber Finder: −{item.newBusinessPenalty}% until the listing is established.</li>}
              </ul>
            </details>
          )}
        </div>

        <div className="flex shrink-0 flex-row gap-2 sm:w-40 sm:flex-col">
          <Link href={item.url} className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#17345a] sm:flex-none">View profile</Link>
          {item.phone && <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:bg-gray-50 sm:flex-none"><FaPhoneAlt className="h-3 w-3" aria-hidden /><span className="sm:hidden">Call</span><span className="hidden sm:inline">{item.phone}</span></a>}
          {item.website && /^https?:\/\//i.test(item.website) && <a href={item.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:bg-gray-50 sm:flex-none">Website<FaExternalLinkAlt className="h-2.5 w-2.5 text-gray-400" aria-hidden /></a>}
        </div>
      </div>
    </article>
  );
}
