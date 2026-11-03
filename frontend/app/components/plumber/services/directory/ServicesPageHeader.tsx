import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaCalendarCheck, FaCheckCircle, FaChevronRight, FaMapMarkerAlt, FaPhoneAlt, FaStar } from "react-icons/fa";
import type { Plumber, ServiceDetail } from "@/components/find/types";
import PremiumBadge from "@/components/premium/PremiumBadge";
import ServicesSummary from "../ServicesSummary";

/** Who these services are from (logo, name, badges, rating, place), the main actions, and the summary strip. */
export default function ServicesPageHeader({ plumber, services, profileHref }: { plumber: Plumber; services: ServiceDetail[]; profileHref: string }) {
  const phone = plumber.phone?.replace(/[^\d+]/g, "");
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-[#0b1f3b]">Home</Link><FaChevronRight className="h-2 w-2" aria-hidden />
          <Link href={profileHref} className="hover:text-[#0b1f3b]">{plumber.companyName}</Link><FaChevronRight className="h-2 w-2" aria-hidden />
          <span className="text-gray-800" aria-current="page">Services</span>
        </nav>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:h-20 sm:w-20">
              {plumber.logo ? <Image src={plumber.logo} alt="" fill sizes="80px" unoptimized={plumber.logo.startsWith("data:")} className="object-cover" /> : <span className="grid h-full w-full place-items-center text-2xl font-extrabold text-[#0b1f3b]">{plumber.companyName.slice(0, 1)}</span>}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#a68600]">Services &amp; prices</p>
              <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#0b1f3b] sm:text-3xl lg:text-4xl">{plumber.companyName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-600">
                <PremiumBadge tier={plumber.premiumTier} />
                {plumber.isVerified && <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><FaCheckCircle className="h-3.5 w-3.5" aria-hidden /> Verified</span>}
                {plumber.reviewCount > 0 && <span className="inline-flex items-center gap-1"><FaStar className="h-3.5 w-3.5 text-[#FFD60A]" aria-hidden /> <strong className="text-gray-900">{plumber.rating.toFixed(1)}</strong> ({plumber.reviewCount})</span>}
                {plumber.location && <span className="inline-flex items-center gap-1"><FaMapMarkerAlt className="h-3 w-3 text-gray-400" aria-hidden /> {plumber.location}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`${profileHref}#booking`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-extrabold text-[#0b1f3b] hover:bg-[#f5c400] sm:flex-none"><FaCalendarCheck aria-hidden /> Book a visit</Link>
            {phone && <a href={`tel:${phone}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-[#0b1f3b] hover:border-[#0b1f3b] sm:flex-none"><FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> Call</a>}
            <Link href={profileHref} className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"><FaArrowLeft className="h-3 w-3" aria-hidden /> Profile</Link>
          </div>
        </div>

        <div className="@container mt-5"><ServicesSummary services={services} /></div>
      </div>
    </header>
  );
}
