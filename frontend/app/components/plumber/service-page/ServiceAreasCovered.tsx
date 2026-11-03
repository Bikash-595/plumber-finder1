import { FaMapMarkerAlt } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { serviceSectionIds } from "./sectionIds";

/** Where this service is offered: areas that list it, or all the provider's areas. */
export default function ServiceAreasCovered({ plumber, service }: { plumber: Plumber; service: ServicePage }) {
  const details = plumber.serviceAreaDetails ?? [];
  const listed = details.filter((area) => area.services.some((name) => name.toLowerCase() === service.name.toLowerCase())).map((area) => area.name);
  const areas = [...new Set(listed.length ? listed : details.length ? details.map((area) => area.name) : plumber.serviceAreas ?? [])].filter(Boolean);
  if (!areas.length && !plumber.location) return null;
  return (
    <section id={serviceSectionIds.areas} aria-labelledby="areas-heading" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="areas-heading" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">Areas covered</h2>
      <p className="mt-1 text-sm text-gray-600">{listed.length ? `${service.name} is offered in these areas.` : `${plumber.companyName} works in these areas.`}{plumber.location ? ` Based in ${plumber.location}.` : ""}</p>
      {areas.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {areas.slice(0, 30).map((name) => <li key={name} className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200"><FaMapMarkerAlt className="h-3 w-3 text-[#a68600]" aria-hidden />{name}</li>)}
        </ul>
      )}
    </section>
  );
}
