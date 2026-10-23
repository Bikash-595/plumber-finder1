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

import { useState } from "react";
import { Plumber } from "@/components/find/types";
import { FaCheck, FaMapPin } from "react-icons/fa";

type Area = { name: string; services: string[] };

/**
 * Service areas: pick an area to see it on the map and the services offered there, or pick a
 * service to see the areas that offer it (the map follows). The map (Google Maps) only loads
 * once the visitor asks for it.
 */
export default function ProfileMap({ plumber }: { plumber: Plumber }) {
  const areas: Area[] = plumber.serviceAreaDetails?.length ? plumber.serviceAreaDetails : plumber.serviceAreas.map((name) => ({ name, services: [] }));
  const base = { name: plumber.baseLocation || plumber.location || plumber.city || "", services: [] as string[] };
  const [selected, setSelected] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  // An area with no services ticked offers every service.
  const offers = (area: Area, name: string) => !area.services.length || area.services.includes(name);
  const visibleAreas = service ? areas.filter((area) => offers(area, service)) : areas;
  const hasAreaServices = areas.some((area) => area.services.length > 0);

  const active = areas.find((area) => area.name === selected) ?? null;
  const state = plumber.state ?? plumber.location?.split(",")[1]?.trim() ?? "";
  // Areas are searched within the company's state ("Round Rock, TX"); the base uses exact coordinates when known.
  const query = active
    ? (state && !active.name.toLowerCase().includes(state.toLowerCase()) ? `${active.name}, ${state}` : active.name)
    : plumber.coordinates ? `${plumber.coordinates.lat},${plumber.coordinates.lng}` : base.name;
  const services = active?.services.length ? active.services : plumber.services;

  const choose = (name: string | null) => { setSelected(name); setIsMapVisible(true); };
  // Picking a service jumps the map to the first area that offers it.
  const chooseService = (name: string | null) => {
    setService(name);
    const first = name ? areas.find((area) => offers(area, name)) : null;
    if (first) choose(first.name);
    else if (!name) setSelected(null);
  };

  if (!areas.length && !base.name) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="service-areas-heading">
      <h2 id="service-areas-heading" className="text-xl font-bold text-gray-900">Service Areas</h2>
      <p className="mt-1 text-sm text-gray-500">{areas.length > 1 ? `${plumber.companyName} serves ${areas.length} areas. Choose one to see it on the map and the services offered there.` : `Where ${plumber.companyName} works.`}</p>

      {hasAreaServices && plumber.services.length > 1 && (
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="service-area-filter">Find areas for a service</label>
          <select id="service-area-filter" value={service ?? ""} onChange={(event) => chooseService(event.target.value || null)} className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FFD60A] sm:w-72">
            <option value="">All services</option>
            {plumber.services.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          {service && <p className="mt-1.5 text-xs text-gray-500">{visibleAreas.length ? `${visibleAreas.length} area${visibleAreas.length === 1 ? "" : "s"} offer${visibleAreas.length === 1 ? "s" : ""} ${service}.` : `No listed area offers ${service}.`}</p>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Service areas">
        {base.name && (
          <button type="button" role="tab" aria-selected={selected === null && isMapVisible} onClick={() => choose(null)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selected === null && isMapVisible ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-[#FFD60A]"}`}>
            <FaMapPin className="h-2.5 w-2.5" /> Base: {base.name}
          </button>
        )}
        {visibleAreas.map((area) => (
          <button key={area.name} type="button" role="tab" aria-selected={selected === area.name} onClick={() => choose(area.name)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selected === area.name ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FFD60A]"}`}>
            <FaMapPin className={`h-2.5 w-2.5 ${selected === area.name ? "text-[#FFD60A]" : "text-[#f7672c]"}`} /> {area.name}
            {area.services.length > 0 && <span className={`rounded-full px-1.5 text-[10px] ${selected === area.name ? "bg-white/20" : "bg-white text-gray-500"}`}>{area.services.length}</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-72">
          {isMapVisible && query ? (
            <iframe
              key={query}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${active ? 12 : 11}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${active?.name ?? base.name}`}
            />
          ) : (
            <button type="button" onClick={() => choose(selected)} className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gray-100 text-center text-gray-700 transition hover:bg-gray-200">
              <FaMapPin className="h-8 w-8 text-[#f7672c]" />
              <span className="text-sm font-semibold">Load service area map</span>
              <span className="max-w-xs text-xs text-gray-500">Google Maps is loaded only when you need it.</span>
            </button>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4" aria-live="polite">
          <h3 className="text-sm font-bold text-gray-900">{active ? `Services in ${active.name}` : "Services offered"}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{active && !active.services.length ? "All of this company's services are available here." : active ? `${active.services.length} service${active.services.length === 1 ? "" : "s"} in this area.` : "Choose an area to see what is offered there."}</p>
          {services.length ? (
            <ul className="mt-3 space-y-1.5">
              {services.slice(0, 12).map((service) => <li key={service} className="flex items-start gap-2 text-sm text-gray-700"><FaCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" /> {service}</li>)}
              {services.length > 12 && <li className="text-xs text-gray-500">+{services.length - 12} more</li>}
            </ul>
          ) : <p className="mt-3 text-sm text-gray-500">Contact {plumber.companyName} for the services available.</p>}
        </div>
      </div>
    </section>
  );
}
