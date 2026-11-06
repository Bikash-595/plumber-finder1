// import { Plumber } from "../find/types";
// export default function ProfileServices({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
//       <div className="flex flex-wrap gap-2">
//         {plumber.services.map((s) => (
//           <span key={s} className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
//             {s}
//           </span>
//         ))}
//       </div>
//       {plumber.specializations.length > 0 && (
//         <>
//           <h3 className="font-semibold text-gray-900 mt-6 mb-2">Specializations</h3>
//           <div className="flex flex-wrap gap-2">
//             {plumber.specializations.map((spec) => (
//               <span key={spec} className="rounded-full bg-[#FFD60A]/10 px-3 py-1 text-sm text-[#B1A606]">
//                 {spec}
//               </span>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FaArrowRight } from "react-icons/fa";
import { plumberHref } from "@/components/find/companyListing";
import { hasServicePage, serviceSegment } from "@/components/find/serviceLinks";
import type { Plumber, ServiceDetail } from "@/components/find/types";
import ServiceNameGrid from "./services/ServiceNameGrid";
import ServicesCarousel from "./services/ServicesCarousel";
import ServicesSummary from "./services/ServicesSummary";
import SectionHeader from "@/components/plumber/profile-services/SectionHeader";

/**
 * Services on the profile: a summary strip, then two cards at a time that slide on by themselves,
 * and "View all services" for the full list (its own page, with categories and search).
 * Featured services come first. Providers that only listed names get simple tiles.
 */
export default function ProfileServices({ plumber }: { plumber: Plumber }) {
  const details = useMemo(() => [...(plumber.serviceDetails ?? [])].sort((a, b) => Number(b.featured) - Number(a.featured)), [plumber.serviceDetails]);
  const specializations = plumber.specializations ?? [];
  const base = plumberHref(plumber);
  // Live services have their own page under the provider's page.
  const pageHref = (service: ServiceDetail) => (hasServicePage(service.id) ? `${base}/services/${serviceSegment(service.name, service.id)}` : undefined);
  const canViewAll = details.some((service) => hasServicePage(service.id));

  if (!details.length) {
    if (!plumber.services.length) return null;
    return (
      <section id="services" className="@container scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="services-heading">
        <SectionHeader title="Services Offered" subtitle={`${plumber.services.length} services · contact ${plumber.companyName} for pricing`} />
        <div className="mt-5"><ServiceNameGrid names={plumber.services} /></div>
        {specializations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-900">Specializations</h3>
            <div className="mt-2 flex flex-wrap gap-2">{specializations.map((spec) => <span key={spec} className="rounded-full border border-[#FFD60A] bg-[#FFD60A]/10 px-3 py-1 text-xs font-semibold text-[#0b1f3b]">{spec}</span>)}</div>
          </div>
        )}
      </section>
    );
  }

  const viewAll = canViewAll && (
    <Link href={`${base}/services`} className="inline-flex items-center gap-2 rounded-full bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#17345a]">
      View all {details.length} services <FaArrowRight className="h-3 w-3" aria-hidden />
    </Link>
  );

  return (
    <section id="services" className="@container scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="services-heading">
      <SectionHeader title="Services & Pricing" subtitle={`Upfront prices from ${plumber.companyName} — book any service in a few clicks.`} emergency={details.some((service) => service.emergency)} action={<span className="hidden @2xl:block">{viewAll}</span>} />
      <div className="mt-5"><ServicesSummary services={details} /></div>
      <div className="mt-6"><ServicesCarousel services={details} hrefFor={pageHref} /></div>
      {viewAll && <div className="mt-5 flex justify-center @2xl:hidden">{viewAll}</div>}
      <p className="mt-5 text-xs text-gray-400">Prices are a guide; the final price is confirmed by {plumber.companyName} before work starts.</p>
    </section>
  );
}
