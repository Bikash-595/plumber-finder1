// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useMemo } from "react";
// import { FaChevronDown, FaMapMarkerAlt, FaMapMarkerAlt as FaPin, FaSearch } from "react-icons/fa";
// import { plumbers } from "@/data/plumbers";

// type SuggestionDeal = {
//   id: string;
//   companyName: string;
//   title: string;
//   location: string;
//   discount?: string;
//   promoCode?: string;
//   image: string;
//   rating: number;
//   priceRange: string;
// };

// const RECENT_DEALS_KEY = "plumberfinder_recent_deals";
// const LOCATION_KEY = "plumberfinder_location";

// const defaultLocation = "Chicago";

// const locationOptions = ["Chicago", "Austin", "New York", "Los Angeles", "Houston", "Phoenix"];

// function getDealImage(plumber: (typeof plumbers)[number]) {
//   return plumber.media?.images?.[0] || plumber.logo || "/Plumber.png";
// }

// function buildDeals(): SuggestionDeal[] {
//   return plumbers
//     .filter((plumber) => plumber.discount || plumber.promoCode)
//     .slice(0, 6)
//     .map((plumber) => ({
//       id: plumber.id,
//       companyName: plumber.companyName,
//       title: plumber.discount || plumber.specializations[0] || "Limited time offer",
//       location: plumber.location,
//       discount: plumber.discount,
//       promoCode: plumber.promoCode,
//       image: getDealImage(plumber),
//       rating: plumber.rating,
//       priceRange: plumber.priceRange,
//     }));
// }

// function buildServiceSuggestions() {
//   const counts = new Map<string, number>();

//   for (const plumber of plumbers) {
//     for (const service of plumber.services) {
//       counts.set(service, (counts.get(service) ?? 0) + 1);
//     }
//   }

//   return [...counts.entries()]
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 10)
//     .map(([service, count]) => ({ service, count }));
// }

// interface SearchSuggestionsPanelProps {
//   open: boolean;
//   onClose: () => void;
//   query: string;
//   onQueryChange: (value: string) => void;
//   location: string;
//   onLocationChange: (value: string) => void;
//   onSearch: (term: string, location: string) => void;
// }

// export default function SearchSuggestionsPanel({
//   open,
//   onClose,
//   query,
//   onQueryChange,
//   location,
//   onLocationChange,
//   onSearch,
// }: SearchSuggestionsPanelProps) {
//   const recentDeals = useMemo(() => {
//     if (!open) return [];

//     try {
//       const stored = typeof window === "undefined" ? null : window.localStorage.getItem(RECENT_DEALS_KEY);
//       const parsed = stored ? (JSON.parse(stored) as SuggestionDeal[]) : [];
//       return parsed.length ? parsed : buildDeals();
//     } catch {
//       return buildDeals();
//     }
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;
//     const storedLocation = window.localStorage.getItem(LOCATION_KEY);
//     if (!location && storedLocation) onLocationChange(storedLocation);
//   }, [open, location, onLocationChange]);

//   const serviceSuggestions = useMemo(() => buildServiceSuggestions(), []);

//   const handleChipClick = (chip: string) => {
//     onQueryChange(chip);
//     onSearch(chip, location || defaultLocation);
//     onClose();
//   };

//   const setLocation = (nextLocation: string) => {
//     onLocationChange(nextLocation);
//     window.localStorage.setItem(LOCATION_KEY, nextLocation);
//   };

//   if (!open) return null;

//   return (
//     <div className="absolute left-0 top-full z-50 mt-3 w-[min(100vw-2rem,980px)] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
//       <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-6 py-5">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Location first</p>
//             <h3 className="mt-1 text-2xl font-semibold text-slate-900">Choose your service area</h3>
//           </div>
//           <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 md:flex">
//             <FaPin />
//             Live suggestions
//           </div>
//         </div>

//         <div className="mt-4 flex flex-wrap gap-2">
//           {locationOptions.map((item) => (
//             <button
//               key={item}
//               type="button"
//               onClick={() => setLocation(item)}
//               className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
//                 (location || defaultLocation) === item
//                   ? "bg-slate-900 text-white shadow-lg"
//                   : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
//               }`}
//             >
//               <FaMapMarkerAlt className="text-xs" />
//               {item}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid gap-0 border-b border-slate-100 bg-slate-50/60 px-6 py-5 lg:grid-cols-[1.2fr_0.8fr]">
//         <div>
//           <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
//             <FaSearch className="text-[11px]" />
//             Popular plumber services
//           </div>
//           <p className="mt-2 text-sm text-slate-600">Search terms based on the most common plumbing services in the network.</p>
//           <div className="mt-4 flex flex-wrap gap-2">
//             {serviceSuggestions.map(({ service, count }) => (
//               <button
//                 key={service}
//                 type="button"
//                 onClick={() => handleChipClick(service)}
//                 className="rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
//               >
//                 {service}
//                 <span className="ml-2 text-xs font-medium text-slate-500">{count}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-4 lg:mt-0">
//           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active location</p>
//           <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
//             <FaMapMarkerAlt className="text-emerald-700" />
//             {(location || defaultLocation)}
//           </div>
//           <p className="mt-2 text-sm text-slate-600">
//             This updates the service suggestions and search results in the find page.
//           </p>
//           <button
//             type="button"
//             onClick={() => onSearch(query, location || defaultLocation)}
//             className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
//           >
//             Search this area
//             <FaChevronDown className="text-[11px]" />
//           </button>
//         </div>
//       </div>

//       <div className="px-6 py-5">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-2xl font-semibold text-slate-900">Last viewed deals</h3>
//             <p className="mt-1 text-sm text-slate-500">The most recent plumber offers you opened.</p>
//           </div>
//           <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
//             Updated from profile views
//           </div>
//         </div>

//         <div className="mt-5 grid gap-4">
//           {recentDeals.map((deal) => (
//             <Link
//               key={deal.id}
//               href={`/plumber/${deal.id}`}
//               onClick={onClose}
//               className="group grid gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg sm:grid-cols-[172px_1fr]"
//             >
//               <div className="relative h-40 overflow-hidden rounded-[1.25rem] bg-slate-200 sm:h-full">
//                 <Image src={deal.image} alt={deal.companyName} fill className="object-cover transition duration-500 group-hover:scale-105" />
//                 <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-extrabold text-slate-900 shadow">
//                   ⭐ {deal.rating.toFixed(1)}
//                 </div>
//                 {deal.promoCode && (
//                   <div className="absolute bottom-3 left-3 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white">
//                     Code {deal.promoCode}
//                   </div>
//                 )}
//               </div>

//               <div className="min-w-0 py-1">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{deal.companyName}</p>
//                   <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
//                     Deal
//                   </span>
//                 </div>
//                 <h4 className="mt-2 text-2xl font-extrabold leading-tight text-slate-900">
//                   {deal.title}
//                 </h4>
//                 <p className="mt-2 text-sm text-slate-600">{deal.location}</p>
//                 <div className="mt-4 flex flex-wrap items-center gap-3">
//                   <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-600">
//                     {deal.discount || "Special offer"}
//                   </span>
//                   <span className="text-sm text-slate-500">{deal.priceRange}</span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }






































"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FaArrowRight, FaArrowTrendUp, FaBolt, FaClockRotateLeft, FaLocationDot, FaMagnifyingGlass, FaStar, FaXmark } from "react-icons/fa6";
import { serviceDefinitions } from "@/components/services/serviceData";
import { ServiceIcon } from "@/components/services/serviceIcons";
import { forgetSearch, recentSearches } from "./smartSearch";

// The search panel under the header search box. Before typing: recent searches, trending searches, popular
// services, Top 10 pages by state and recently viewed profiles. While typing: the live suggestions (`top`).

type ViewedProfile = { id: string; companyName: string; title?: string; location?: string; image?: string; rating?: number };

const RECENT_VIEWS_KEY = "plumberfinder_recent_deals"; // written by the plumber profile page
const TRENDING = ["Emergency plumbers near me", "Top 10 plumbers in New York", "Drain cleaning", "Water heater repair", "Best plumbers in Texas", "Leak detection"];
const POPULAR_STATES = [["New York", "new-york"], ["California", "california"], ["Texas", "texas"], ["Florida", "florida"], ["Illinois", "illinois"], ["Arizona", "arizona"]] as const;
const POPULAR_SERVICES = serviceDefinitions.slice(0, 8);

function recentlyViewed(): ViewedProfile[] {
  try {
    const list = JSON.parse(window.localStorage.getItem(RECENT_VIEWS_KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((item) => item && typeof item.id === "string" && typeof item.companyName === "string").slice(0, 4) : [];
  } catch { return []; }
}

const SectionTitle = ({ icon, children, action }: { icon: ReactNode; children: ReactNode; action?: ReactNode }) => (
  <div className="mb-2.5 flex items-center justify-between gap-2">
    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{icon}{children}</p>
    {action}
  </div>
);

interface SearchSuggestionsPanelProps {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  /** Runs a search for this text (recent and trending searches). */
  onSubmitQuery: (value: string) => void;
  /** Live suggestions for what's typed, shown instead of the panel's starting content. */
  top?: ReactNode;
}

export default function SearchSuggestionsPanel({ open, onClose, query, onQueryChange, onSubmitQuery, top }: SearchSuggestionsPanelProps) {
  if (!open) return null;
  const typing = query.trim().length >= 2 && Boolean(top);
  return (
    <div className="absolute left-1/2 top-full z-50 mt-2 w-[min(100vw-2rem,920px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-12px_rgba(11,31,59,0.35)] ring-1 ring-black/[0.02]">
      {typing ? top : <StartPanel onClose={onClose} onQueryChange={onQueryChange} onSubmitQuery={onSubmitQuery} />}
    </div>
  );
}

/** Before anything is typed. Mounted each time the panel opens, so stored lists are read fresh. */
function StartPanel({ onClose, onQueryChange, onSubmitQuery }: Pick<SearchSuggestionsPanelProps, "onClose" | "onQueryChange" | "onSubmitQuery">) {
  const [recent, setRecent] = useState<string[]>(() => recentSearches());
  const [viewed] = useState<ViewedProfile[]>(() => recentlyViewed());
  const run = (value: string) => { onQueryChange(value); onSubmitQuery(value); };
  const chip = "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10 hover:text-[#0b1f3b]";

  return (
    <div className="max-h-[min(75vh,640px)] overflow-y-auto">
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-6">
        <div className="space-y-6">
          {recent.length > 0 && (
            <section>
              <SectionTitle icon={<FaClockRotateLeft className="h-3 w-3" aria-hidden />} action={<button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { forgetSearch(); setRecent([]); }} className="text-xs font-semibold text-slate-400 hover:text-slate-700">Clear</button>}>Recent searches</SectionTitle>
              <ul className="space-y-0.5">
                {recent.map((item) => (
                  <li key={item} className="group flex items-center rounded-xl hover:bg-slate-50">
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run(item)} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left text-sm text-slate-700">
                      <FaClockRotateLeft className="h-3 w-3 shrink-0 text-slate-300" aria-hidden /><span className="truncate">{item}</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { forgetSearch(item); setRecent((list) => list.filter((value) => value !== item)); }} aria-label={`Remove “${item}” from recent searches`} className="mr-1 grid h-7 w-7 place-items-center rounded-full text-slate-300 opacity-0 transition hover:bg-white hover:text-slate-600 focus:opacity-100 group-hover:opacity-100">
                      <FaXmark className="h-3 w-3" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <SectionTitle icon={<FaArrowTrendUp className="h-3 w-3" aria-hidden />}>Trending searches</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((item) => (
                <button key={item} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run(item)} className={chip}>
                  <FaMagnifyingGlass className="h-2.5 w-2.5 text-slate-400" aria-hidden />{item}
                </button>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle icon={<FaLocationDot className="h-3 w-3" aria-hidden />}>Top 10 plumbers by state</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {POPULAR_STATES.map(([name, slug]) => (
                <Link key={slug} href={`/top-10-plumbers/${slug}`} onClick={onClose} className={chip}>{name}</Link>
              ))}
              <Link href="/states" onClick={onClose} className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-[#0b1f3b] hover:underline">All states <FaArrowRight className="h-2.5 w-2.5" aria-hidden /></Link>
            </div>
          </section>
        </div>

        <section>
          <SectionTitle icon={<ServiceIcon slug="pipe-repair" className="h-3 w-3" />} action={<Link href="/services" onClick={onClose} className="text-xs font-semibold text-[#0b1f3b] hover:underline">All services</Link>}>Popular services</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} onClick={onClose} className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition hover:border-[#FFD60A] hover:bg-white hover:shadow-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#0b1f3b] shadow-sm ring-1 ring-slate-100 transition group-hover:bg-[#FFD60A]"><ServiceIcon slug={service.slug} className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800">{service.name}</span>
                  <span className="block truncate text-xs text-slate-500">{service.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {viewed.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-4 md:px-6">
          <SectionTitle icon={<FaClockRotateLeft className="h-3 w-3" aria-hidden />}>Recently viewed</SectionTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {viewed.map((item) => (
              <Link key={item.id} href={`/plumber/${item.id}`} onClick={onClose} className="group flex items-center gap-2.5 rounded-xl border border-slate-100 p-2 transition hover:border-slate-200 hover:shadow-sm">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.image ? <Image src={item.image} alt="" fill sizes="40px" className="object-cover" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800">{item.companyName}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    {item.rating ? <><FaStar className="h-2.5 w-2.5 text-amber-400" aria-hidden />{item.rating.toFixed(1)}</> : null}
                    {item.location && <span className="truncate">{item.rating ? "· " : ""}{item.location}</span>}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/services/emergency-plumbing" onClick={onClose} className="group flex items-center gap-3 bg-[#0b1f3b] px-5 py-3 text-white md:px-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFD60A] text-[#0b1f3b]"><FaBolt className="h-3.5 w-3.5" aria-hidden /></span>
        <span className="min-w-0 flex-1 text-sm"><b>Plumbing emergency?</b> <span className="text-white/70">See plumbers available 24/7</span></span>
        <FaArrowRight className="h-3 w-3 text-[#FFD60A] transition group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </div>
  );
}
