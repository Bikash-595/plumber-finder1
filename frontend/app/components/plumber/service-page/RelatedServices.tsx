import Link from "next/link";
import { hasServicePage, serviceSegment } from "@/components/find/serviceLinks";
import type { ServiceDetail } from "@/components/find/types";
import ServiceCard from "../services/ServiceCard";

/** Other services from the same provider (same category first), as the same cards as the profile. */
export default function RelatedServices({ services, current, category, profileHref }: { services: ServiceDetail[]; current: string; category?: string; profileHref: string }) {
  const others = services.filter((s) => s.id !== current && hasServicePage(s.id)).sort((a, b) => Number(b.category === category) - Number(a.category === category) || Number(b.featured) - Number(a.featured)).slice(0, 4);
  if (!others.length) return null;
  return (
    <section aria-labelledby="related-services">
      <div className="flex items-end justify-between gap-3">
        <h2 id="related-services" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">More services</h2>
        <Link href={`${profileHref}/services`} className="text-sm font-bold text-[#0b1f3b] hover:underline">See all</Link>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5">
        {others.map((service) => <li key={service.id}><ServiceCard service={service} href={`${profileHref}/services/${serviceSegment(service.name, service.id)}`} bookOnPage={false} /></li>)}
      </ul>
    </section>
  );
}
