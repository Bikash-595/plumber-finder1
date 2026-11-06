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

import StartPanel from "@/components/search/start-panel/StartPanel";
import { type SearchSuggestionsPanelProps } from "@/components/search/start-panel/panelTypes";

// The search panel under the header search box. Before typing: recent searches, trending searches, popular
// services, Top 10 pages by state and recently viewed profiles. While typing: the live suggestions (`top`).

export default function SearchSuggestionsPanel({ open, onClose, query, onQueryChange, onSubmitQuery, top }: SearchSuggestionsPanelProps) {
  if (!open) return null;
  const typing = query.trim().length >= 2 && Boolean(top);
  return (
    <div className="absolute left-1/2 top-full z-50 mt-2 w-[min(100vw-2rem,920px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-12px_rgba(11,31,59,0.35)] ring-1 ring-black/[0.02]">
      {typing ? top : <StartPanel onClose={onClose} onQueryChange={onQueryChange} onSubmitQuery={onSubmitQuery} />}
    </div>
  );
}
