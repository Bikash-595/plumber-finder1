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

import Image from "next/image";
import { createElement, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { FaBolt, FaCalendarCheck, FaCheck, FaChevronDown, FaClock, FaExclamationTriangle, FaFire, FaHome, FaIndustry, FaSearch, FaShieldAlt, FaShower, FaStar, FaTint, FaTools, FaWater, FaWrench } from "react-icons/fa";
import type { Plumber, ServiceDetail } from "@/components/find/types";

// An icon for a service, matched on words in its name (or its category).
const iconRules: [RegExp, IconType][] = [
  [/emergenc|24\/7|urgent/i, FaBolt], [/drain|sewer|jet|clog|grease|trenchless/i, FaTools], [/heater|tankless|boiler|hot water/i, FaWater],
  [/leak|slab/i, FaTint], [/inspect|camera|video|detect/i, FaSearch], [/gas/i, FaFire], [/bath|shower|remodel|kitchen/i, FaShower],
  [/toilet|faucet|sink|fixture|disposal/i, FaHome], [/commercial|industrial|backflow/i, FaIndustry], [/frozen|burst|flood/i, FaExclamationTriangle],
];
const serviceIcon = (text: string, className: string) => createElement(iconRules.find(([pattern]) => pattern.test(text))?.[1] ?? FaWrench, { className, "aria-hidden": true });

/** Scrolls to the booking form and picks this service there. */
function bookService(name: string) {
  window.dispatchEvent(new CustomEvent("plumberfinder:book-service", { detail: name }));
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function BookButton({ name, compact = false }: { name: string; compact?: boolean }) {
  return (
    <button type="button" onClick={() => bookService(name)} aria-label={`Book ${name}`} className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#0b1f3b] font-bold text-white transition hover:bg-[#17345a] ${compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}>
      <FaCalendarCheck className="h-3 w-3" aria-hidden /> Book
    </button>
  );
}

/** A featured service: photo (or icon), price, duration, what's included. */
function FeaturedCard({ service }: { service: ServiceDetail }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-32 bg-gradient-to-br from-[#0b1f3b] to-[#17345a] sm:h-36">
        {service.image ? <Image src={service.image} alt={service.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /> : serviceIcon(`${service.name} ${service.category ?? ""}`, "absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-[#FFD60A]/80")}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A] px-2 py-0.5 text-[11px] font-bold text-[#0b1f3b]"><FaStar className="h-2.5 w-2.5" aria-hidden /> Featured</span>
          {service.emergency && <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white"><FaBolt className="h-2.5 w-2.5" aria-hidden /> 24/7</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {service.category && <p className="text-[11px] font-bold uppercase tracking-wider text-[#f7672c]">{service.category}</p>}
        <h3 className="mt-0.5 text-base font-bold text-gray-900">{service.name}</h3>
        {service.description && <p className="mt-1 line-clamp-3 text-sm text-gray-600">{service.description}</p>}
        {service.includes.length > 0 && (
          <ul className="mt-3 space-y-1">
            {service.includes.slice(0, 4).map((item) => <li key={item} className="flex items-start gap-2 text-sm text-gray-700"><FaCheck className="mt-1 h-3 w-3 shrink-0 text-emerald-600" aria-hidden /> {item}</li>)}
            {service.includes.length > 4 && <li className="pl-5 text-xs text-gray-500">+{service.includes.length - 4} more included</li>}
          </ul>
        )}
        {service.warranty && <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><FaShieldAlt className="h-3 w-3" aria-hidden /> {service.warranty}</p>}
        <div className="min-h-4 flex-1" aria-hidden />
        <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
          <div>
            <p className="text-lg font-extrabold text-gray-900">{service.price || "Ask for a quote"}</p>
            {service.duration && <p className="flex items-center gap-1 text-xs text-gray-500"><FaClock className="h-2.5 w-2.5" aria-hidden /> {service.duration}</p>}
          </div>
          <BookButton name={service.name} />
        </div>
      </div>
    </article>
  );
}

/** Any other service: one row with price and duration; opens to show the description and what's included. */
function ServiceRow({ service }: { service: ServiceDetail }) {
  const [open, setOpen] = useState(false);
  const hasMore = Boolean(service.description || service.includes.length || service.warranty);
  return (
    <li className="py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFD60A]/15 text-[#0b1f3b]">{serviceIcon(`${service.name} ${service.category ?? ""}`, "h-4 w-4")}</span>
        <button type="button" disabled={!hasMore} onClick={() => setOpen(!open)} aria-expanded={hasMore ? open : undefined} className="min-w-0 flex-1 text-left">
          <p className="flex flex-wrap items-center gap-x-2 font-semibold text-gray-900">
            {service.name}
            {service.emergency && <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700">24/7</span>}
            {hasMore && <FaChevronDown className={`h-2.5 w-2.5 text-gray-400 transition ${open ? "rotate-180" : ""}`} aria-hidden />}
          </p>
          <p className="truncate text-xs text-gray-500">{[service.category, service.duration].filter(Boolean).join(" · ") || "Plumbing service"}</p>
        </button>
        <div className="text-right">
          <p className="whitespace-nowrap text-sm font-bold text-gray-900">{service.price || "Quote"}</p>
        </div>
        <BookButton name={service.name} compact />
      </div>
      {open && (
        <div className="ml-[3.25rem] mt-2 space-y-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
          {service.description && <p className="whitespace-pre-line">{service.description}</p>}
          {service.includes.length > 0 && <ul className="grid gap-1 sm:grid-cols-2">{service.includes.map((item) => <li key={item} className="flex items-start gap-2"><FaCheck className="mt-1 h-3 w-3 shrink-0 text-emerald-600" aria-hidden /> {item}</li>)}</ul>}
          {service.warranty && <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><FaShieldAlt className="h-3 w-3" aria-hidden /> {service.warranty}</p>}
        </div>
      )}
    </li>
  );
}

/**
 * Services the company/freelancer offers: featured ones as cards (price, duration, what's included),
 * the rest as an expandable list, with a category filter and a Book button that fills in the booking form.
 * Sample plumbers (names only) get a simple grid.
 */
export default function ProfileServices({ plumber }: { plumber: Plumber }) {
  const details = useMemo(() => plumber.serviceDetails ?? [], [plumber.serviceDetails]);
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const service of details) if (service.category) counts.set(service.category, (counts.get(service.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [details]);
  const specializations = plumber.specializations ?? [];

  if (!details.length) {
    if (!plumber.services.length) return null;
    return (
      <section id="services" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="services-heading">
        <h2 id="services-heading" className="text-xl font-bold text-gray-900">Services Offered</h2>
        <p className="mt-0.5 text-sm text-gray-500">{plumber.services.length} services · contact {plumber.companyName} for pricing</p>
        <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {plumber.services.map((name) => {
            return (
              <li key={name} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FFD60A]/20 text-[#0b1f3b]">{serviceIcon(name, "h-4 w-4")}</span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-gray-800">{name}</span>
                <BookButton name={name} compact />
              </li>
            );
          })}
        </ul>
        {specializations.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-900">Specializations</h3>
            <div className="mt-2 flex flex-wrap gap-2">{specializations.map((spec) => <span key={spec} className="rounded-full border border-[#FFD60A] bg-[#FFD60A]/10 px-3 py-1 text-xs font-semibold text-[#0b1f3b]">{spec}</span>)}</div>
          </div>
        )}
      </section>
    );
  }

  const visible = category === "All" ? details : details.filter((service) => service.category === category);
  const featured = visible.filter((service) => service.featured);
  const others = visible.filter((service) => !service.featured);
  const hasEmergency = details.some((service) => service.emergency);

  return (
    <section id="services" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="services-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="services-heading" className="text-xl font-bold text-gray-900">Services &amp; Pricing</h2>
          <p className="mt-0.5 text-sm text-gray-500">{details.length} service{details.length === 1 ? "" : "s"} from {plumber.companyName}</p>
        </div>
        {hasEmergency && <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700"><FaBolt className="h-3 w-3" aria-hidden /> Emergency service available</span>}
      </div>

      {categories.length > 1 && (
        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Service categories">
          {[["All", details.length] as [string, number], ...categories].map(([name, count]) => (
            <button key={name} type="button" role="tab" aria-selected={category === name} onClick={() => setCategory(name)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${category === name ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
              {name} <span className={category === name ? "text-white/70" : "text-gray-400"}>{count}</span>
            </button>
          ))}
        </div>
      )}

      {featured.length > 0 && <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{featured.map((service) => <FeaturedCard key={service.id} service={service} />)}</div>}
      {others.length > 0 && (
        <div className={featured.length ? "mt-6" : "mt-4"}>
          {featured.length > 0 && <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">More services</h3>}
          <ul className="mt-1 divide-y divide-gray-100">{others.map((service) => <ServiceRow key={service.id} service={service} />)}</ul>
        </div>
      )}
      <p className="mt-4 text-xs text-gray-400">Prices are a guide; the final price is confirmed by {plumber.companyName} before work starts.</p>
    </section>
  );
}
