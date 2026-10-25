// import { Plumber } from "../find/types";

// export default function ProfileMap({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Service Areas</h2>
//       <div className="relative h-64 w-full rounded-xl overflow-hidden">
//         <iframe
//           src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bbafdcd%3A0x1f1d0d5f8a9b6b5f!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus`}
//           width="100%"
//           height="100%"
//           style={{ border: 0 }}
//           allowFullScreen
//           loading="lazy"
//         ></iframe>
//       </div>
//       <div className="mt-3 flex flex-wrap gap-1">
//         {plumber.serviceAreas.map((area) => (
//           <span key={area} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
//             {area}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }













"use client";

import { Plumber } from "@/components/find/types";
import { plumberPoint } from "@/components/find/distance";
import ServiceAreaMap, { type ServiceArea } from "./ServiceAreaMap";

/**
 * The built-in demo plumbers only list area names; give each area its own share of the company's
 * services (so the profile shows what each branch area offers, like a real company's would).
 */
function demoAreas(plumber: Plumber): ServiceArea[] {
  return plumber.serviceAreas.map((name, index) => {
    const offered = plumber.services.filter((_, serviceIndex) => (serviceIndex + index) % 3 !== 0);
    return { name, services: offered.length && offered.length < plumber.services.length ? offered : [], radius: 10 + (index % 3) * 5 };
  });
}

/** Public profile: the areas served, each with its services and radius, on a map (see ServiceAreaMap). */
export default function ProfileMap({ plumber }: { plumber: Plumber }) {
  const areas: ServiceArea[] = plumber.serviceAreaDetails?.length ? plumber.serviceAreaDetails : demoAreas(plumber);
  const baseName = plumber.baseLocation || plumber.location || plumber.city || "";
  const point = plumberPoint(plumber)?.point;
  if (!areas.length && !baseName) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="service-areas-heading">
      <h2 id="service-areas-heading" className="text-xl font-bold text-gray-900">Service Areas</h2>
      <p className="mb-4 mt-1 text-sm text-gray-500">{areas.length > 1 ? `${plumber.companyName} serves ${areas.length} areas. Choose one to see it on the map, how far it reaches, and the services offered there.` : `Where ${plumber.companyName} works.`}</p>
      <ServiceAreaMap areas={areas} services={plumber.services} ownerName={plumber.companyName} baseName={baseName} coordinates={point} baseRadius={plumber.baseRadius} state={plumber.state} />
    </section>
  );
}
