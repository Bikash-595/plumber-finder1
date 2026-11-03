import Link from "next/link";
import { FaBolt, FaCalendarCheck, FaChevronRight, FaPhoneAlt, FaStar } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";

/** Breadcrumbs, the service name, its summary and price, and the two main actions. */
export default function ServiceHero({ plumber, service, profileHref }: { plumber: Plumber; service: ServicePage; profileHref: string }) {
  const phone = plumber.phone?.replace(/[^\d+]/g, "");
  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-500">
        <Link href="/" className="hover:text-[#0b1f3b]">Home</Link><FaChevronRight className="h-2 w-2" aria-hidden />
        <Link href={profileHref} className="hover:text-[#0b1f3b]">{plumber.companyName}</Link><FaChevronRight className="h-2 w-2" aria-hidden />
        <Link href={`${profileHref}#services`} className="hover:text-[#0b1f3b]">Services</Link><FaChevronRight className="h-2 w-2" aria-hidden />
        <span className="text-gray-800" aria-current="page">{service.name}</span>
      </nav>
      <div className="mt-5 flex flex-wrap gap-2">
        {service.category && <span className="rounded-full bg-[#0b1f3b] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">{service.category}</span>}
        {service.featured && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A] px-3 py-1 text-[11px] font-bold text-[#0b1f3b]"><FaStar className="h-2.5 w-2.5" aria-hidden /> Featured service</span>}
        {service.emergency && <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold text-white"><FaBolt className="h-2.5 w-2.5" aria-hidden /> 24/7 emergency</span>}
      </div>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#0b1f3b] sm:text-4xl lg:text-5xl">{service.name}</h1>
      <p className="mt-2 text-sm font-semibold text-gray-500">by <Link href={profileHref} className="text-[#0b1f3b] underline-offset-2 hover:underline">{plumber.companyName}</Link>{plumber.location ? ` · ${plumber.location}` : ""}</p>
      {service.description && <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">{service.description}</p>}
      <p className="mt-5 flex flex-wrap items-baseline gap-x-2 text-[#0b1f3b]"><span className="text-3xl font-black tracking-tight">{service.price || "Free quote"}</span>{service.duration && <span className="text-sm font-semibold text-gray-500">· typically {service.duration}</span>}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="#booking" className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-extrabold text-[#0b1f3b] shadow-sm hover:bg-[#f5c400]"><FaCalendarCheck aria-hidden /> Book this service</a>
        {phone && <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-[#0b1f3b] hover:border-[#0b1f3b]"><FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> Call {plumber.phone}</a>}
      </div>
    </div>
  );
}
