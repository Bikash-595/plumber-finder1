import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaAward, FaCheckCircle, FaIdCard, FaShieldAlt, FaStar } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";

/** Who does the work: logo, name, rating and the trust signals customers look for. */
export default function ServiceProviderCard({ plumber, profileHref }: { plumber: Plumber; profileHref: string }) {
  const trust = [
    plumber.isVerified && { icon: FaCheckCircle, text: "Verified by Plumber Finder" },
    plumber.licenseNumber && { icon: FaIdCard, text: `License ${plumber.licenseNumber}` },
    plumber.insurance && { icon: FaShieldAlt, text: `Insured · ${plumber.insurance}` },
    plumber.yearsInBusiness > 0 && { icon: FaAward, text: `${plumber.yearsInBusiness}+ years in business` },
  ].filter(Boolean) as { icon: typeof FaAward; text: string }[];
  return (
    <section aria-label={`About ${plumber.companyName}`} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          {plumber.logo ? <Image src={plumber.logo} alt="" fill sizes="56px" unoptimized={plumber.logo.startsWith("data:")} className="object-cover" /> : <span className="grid h-full w-full place-items-center text-lg font-extrabold text-[#0b1f3b]">{plumber.companyName.slice(0, 1)}</span>}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Service by</p>
          <p className="truncate font-extrabold text-[#0b1f3b]">{plumber.companyName}</p>
          {plumber.reviewCount > 0 && <p className="flex items-center gap-1 text-xs font-semibold text-gray-600"><FaStar className="h-3 w-3 text-[#FFD60A]" aria-hidden /> {plumber.rating.toFixed(1)} · {plumber.reviewCount} review{plumber.reviewCount === 1 ? "" : "s"}</p>}
        </div>
      </div>
      {trust.length > 0 && <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">{trust.map(({ icon: Icon, text }) => <li key={text} className="flex items-center gap-2 text-sm text-gray-700"><Icon className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden /> {text}</li>)}</ul>}
      <Link href={profileHref} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#0b1f3b] hover:border-[#0b1f3b]">View full profile <FaArrowRight className="h-3 w-3" aria-hidden /></Link>
    </section>
  );
}
