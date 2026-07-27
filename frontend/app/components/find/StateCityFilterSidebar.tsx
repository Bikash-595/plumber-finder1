// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { plumbers } from "@/data/plumbers";
// import { getStateName, allStateAbbrs } from "../utils/location";

// interface StateCityFilterSidebarProps {
//   selectedState?: string;   // state abbreviation (e.g., "NY")
//   selectedCity?: string;
// }

// export default function StateCityFilterSidebar({ selectedState, selectedCity }: StateCityFilterSidebarProps) {
//   const [expandedState, setExpandedState] = useState(selectedState ?? "");

//   const citiesByState = allStateAbbrs.reduce<Record<string, string[]>>((acc, stateAbbr) => {
//     const cities = Array.from(
//       new Set(
//         plumbers
//           .filter((plumber) => plumber.state === stateAbbr)
//           .map((plumber) => plumber.city)
//           .filter((city): city is string => Boolean(city))
//       )
//     ).sort((a, b) => a.localeCompare(b));

//     acc[stateAbbr] = cities;
//     return acc;
//   }, {});

//   const toggleState = (stateAbbr: string) => {
//     setExpandedState((current) => (current === stateAbbr ? "" : stateAbbr));
//   };

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//       <div>
//         <h3 className="mb-1 font-semibold text-gray-900">Filter by State and City</h3>
//         <p className="mb-4 text-sm text-gray-500">
//           Open a state to browse its cities. States without listings will show an empty result page.
//         </p>

//         <div className="max-h-[38rem] space-y-2 overflow-y-auto pr-1">
//           {allStateAbbrs.map((stateAbbr) => {
//             const stateName = getStateName(stateAbbr);
//             const isSelected = selectedState === stateAbbr;
//             const isExpanded = expandedState === stateAbbr;
//             const stateCities = citiesByState[stateAbbr];
//             const hasPlumbers = stateCities.length > 0;
//             const stateHref = `/states/${stateName.toLowerCase().replace(/\s/g, "-")}`;

//             const className = `block rounded-md px-3 py-1.5 text-sm transition ${
//               isSelected
//                 ? "bg-[#FFD60A] font-semibold text-white"
//                 : isExpanded
//                   ? "bg-yellow-50 font-medium text-black"
//                   : hasPlumbers
//                     ? "text-black hover:bg-gray-100 hover:text-black"
//                     : "text-black hover:bg-gray-50 hover:text-black"
//             }`;

//             return (
//               <div key={stateAbbr} className="overflow-hidden rounded-xl border border-gray-100">
//                 <div className="flex items-center gap-2 bg-white p-1">
//                   <Link href={stateHref} className={`${className} flex-1`}>
//                     <span>{stateName}</span>
//                     <span
//                       className={`ml-2 text-xs ${
//                         isSelected ? "text-white/85" : hasPlumbers ? "text-gray-500" : "text-gray-500"
//                       }`}
//                     >
//                       {hasPlumbers ? `${stateCities.length} cities` : "0 cities"}
//                     </span>
//                   </Link>

//                   <button
//                     type="button"
//                     onClick={() => toggleState(stateAbbr)}
//                     className={`rounded-md p-2 transition ${
//                       isExpanded
//                         ? "bg-yellow-100 text-black"
//                         : "text-gray-500 hover:bg-gray-100 hover:text-black"
//                     }`}
//                     aria-label={`${isExpanded ? "Collapse" : "Expand"} ${stateName} cities`}
//                     aria-expanded={isExpanded}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
//                     >
//                       <path d="m6 9 6 6 6-6" />
//                     </svg>
//                   </button>
//                 </div>

//                 {isExpanded && (
//                   <div className="border-t border-gray-100 bg-gray-50 px-3 py-3">
//                     {hasPlumbers ? (
//                       <div className="space-y-1">
//                         {stateCities.map((city) => (
//                           <Link
//                             key={city}
//                             href={`${stateHref}?city=${encodeURIComponent(city)}`}
//                             className={`block rounded-md px-3 py-2 text-sm transition ${
//                               selectedState === stateAbbr && selectedCity === city
//                                 ? "bg-[#FFD60A] font-semibold text-white"
//                                 : "text-black hover:bg-white hover:text-black"
//                             }`}
//                           >
//                             {city}
//                           </Link>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="rounded-md border border-dashed border-gray-200 bg-white px-3 py-3 text-sm text-gray-500">
//                         No plumbing companies listed in {stateName} yet.
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }













// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { plumbers } from "@/data/plumbers";
// import { getStateName, allStateAbbrs } from "../utils/location";

// interface StateCityFilterSidebarProps {
//   selectedState?: string;
//   selectedCity?: string;
// }

// export default function StateCityFilterSidebar({ selectedState, selectedCity }: StateCityFilterSidebarProps) {
//   const [expandedState, setExpandedState] = useState(selectedState ?? "");

//   const citiesByState = allStateAbbrs.reduce<Record<string, string[]>>((acc, stateAbbr) => {
//     const cities = Array.from(
//       new Set(
//         plumbers
//           .filter((plumber) => plumber.state === stateAbbr)
//           .map((plumber) => plumber.city)
//           .filter((city): city is string => Boolean(city))
//       )
//     ).sort((a, b) => a.localeCompare(b));

//     acc[stateAbbr] = cities;
//     return acc;
//   }, {});

//   const toggleState = (stateAbbr: string) => {
//     setExpandedState((current) => (current === stateAbbr ? "" : stateAbbr));
//   };

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//       <div>
//         <h3 className="mb-1 text-lg font-semibold text-gray-900">Filter by State & City</h3>
//         <p className="mb-4 text-sm text-gray-600">Click on a state to expand and see its cities.</p>

//         <div className="max-h-[38rem] space-y-3 overflow-y-auto pr-1">
//           {allStateAbbrs.map((stateAbbr) => {
//             const stateName = getStateName(stateAbbr);
//             const isSelected = selectedState === stateAbbr;
//             const isExpanded = expandedState === stateAbbr;
//             const stateCities = citiesByState[stateAbbr];
//             const hasPlumbers = stateCities.length > 0;
//             const stateHref = `/states/${stateName.toLowerCase().replace(/\s/g, "-")}`;

//             return (
//               <div key={stateAbbr} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
//                 <div className="flex items-center justify-between p-2">
//                   <Link
//                     href={stateHref}
//                     className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
//                       isSelected
//                         ? "bg-[#FFD60A] text-gray-900"
//                         : "text-gray-800 hover:bg-gray-50 hover:text-gray-900"
//                     }`}
//                   >
//                     <span>{stateName}</span>
//                     {hasPlumbers && (
//                       <span className="ml-2 text-xs text-gray-600">({stateCities.length})</span>
//                     )}
//                   </Link>

//                   {hasPlumbers && (
//                     <button
//                       type="button"
//                       onClick={() => toggleState(stateAbbr)}
//                       className={`ml-1 rounded-md p-2 transition ${
//                         isExpanded
//                           ? "bg-[#FFD60A]/20 text-[#B1A606]"
//                           : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//                       }`}
//                       aria-label={`${isExpanded ? "Collapse" : "Expand"} ${stateName} cities`}
//                       aria-expanded={isExpanded}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         className={`h-4 w-4 transition-transform duration-200 ${
//                           isExpanded ? "rotate-180" : ""
//                         }`}
//                       >
//                         <path d="m6 9 6 6 6-6" />
//                       </svg>
//                     </button>
//                   )}
//                 </div>

//                 {isExpanded && hasPlumbers && (
//                   <div className="border-t border-gray-100 bg-gray-50 p-3">
//                     <div className="grid grid-cols-1 gap-1">
//                       {stateCities.map((city) => (
//                         <Link
//                           key={city}
//                           href={`${stateHref}?city=${encodeURIComponent(city)}`}
//                           className={`rounded-md px-3 py-2 text-sm transition ${
//                             selectedState === stateAbbr && selectedCity === city
//                               ? "bg-[#FFD60A] font-medium text-gray-900"
//                               : "text-gray-800 hover:bg-white hover:text-gray-900"
//                           }`}
//                         >
//                           {city}
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {isExpanded && !hasPlumbers && (
//                   <div className="border-t border-gray-100 bg-gray-50 p-3">
//                     <div className="rounded-md border border-dashed border-gray-200 bg-white px-3 py-3 text-center text-sm text-gray-500">
//                       No plumbing companies listed in {stateName} yet.
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }













"use client";

import Link from "next/link";
import { useState } from "react";
import { plumbers } from "@/data/plumbers";
import { getStateName, allStateAbbrs } from "../utils/location";

interface StateCityFilterSidebarProps {
  selectedState?: string;
  selectedCity?: string;
}

export default function StateCityFilterSidebar({
  selectedState,
  selectedCity,
}: StateCityFilterSidebarProps) {
  const [expandedState, setExpandedState] = useState(selectedState ?? "");

  const citiesByState = allStateAbbrs.reduce<Record<string, string[]>>(
    (acc, stateAbbr) => {
      const cities = Array.from(
        new Set(
          plumbers
            .filter((plumber) => plumber.state === stateAbbr)
            .map((plumber) => plumber.city)
            .filter((city): city is string => Boolean(city))
        )
      ).sort((a, b) => a.localeCompare(b));

      acc[stateAbbr] = cities;
      return acc;
    },
    {}
  );

  const toggleState = (stateAbbr: string) => {
    setExpandedState((current) =>
      current === stateAbbr ? "" : stateAbbr
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-sm">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-black">
          Filter by State & City
        </h3>
        <p className="mb-4 text-sm text-gray-700">
          Click on a state to expand and see its cities.
        </p>

        <div className="max-h-[38rem] space-y-3 overflow-y-auto pr-1">
          {allStateAbbrs.map((stateAbbr) => {
            const stateName = getStateName(stateAbbr);
            const isSelected = selectedState === stateAbbr;
            const isExpanded = expandedState === stateAbbr;
            const stateCities = citiesByState[stateAbbr];
            const hasPlumbers = stateCities.length > 0;

            const stateHref = `/states/${stateName
              .toLowerCase()
              .replace(/\s/g, "-")}`;

            return (
              <div
                key={stateAbbr}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white text-black shadow-sm"
              >
                {/* STATE ROW */}
                <div className="flex items-center justify-between p-2">
                  <Link
                    href={stateHref}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-yellow-400 text-gray-950"
                        : "text-black hover:bg-yellow-100 hover:text-gray-950 active:scale-[0.98]"
                    }`}
                  >
                    <span>{stateName}</span>
                    {hasPlumbers && (
                      <span className="ml-2 text-xs text-black/70">
                        ({stateCities.length})
                      </span>
                    )}
                  </Link>

                  {/* TOGGLE BUTTON */}
                  {hasPlumbers && (
                    <button
                      type="button"
                      onClick={() => toggleState(stateAbbr)}
                      className={`ml-1 rounded-md p-2 transition ${
                        isExpanded
                          ? "bg-yellow-200 text-gray-950"
                          : "text-black/70 hover:bg-gray-100 hover:text-gray-950"
                      }`}
                      aria-label={`${
                        isExpanded ? "Collapse" : "Expand"
                      } ${stateName} cities`}
                      aria-expanded={isExpanded}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* CITY LIST */}
                {isExpanded && hasPlumbers && (
                  <div className="border-t border-gray-100 bg-gray-50 p-3 text-black">
                    <div className="grid grid-cols-1 gap-1">
                      {stateCities.map((city) => (
                        <Link
                          key={city}
                          href={`${stateHref}?city=${encodeURIComponent(
                            city
                          )}`}
                          className={`rounded-md px-3 py-2 text-sm transition-colors ${
                            selectedState === stateAbbr &&
                            selectedCity === city
                              ? "bg-yellow-400 text-gray-950 font-semibold"
                              : "text-black hover:bg-yellow-100 hover:text-gray-950 active:scale-[0.98]"
                          }`}
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* EMPTY STATE */}
                {isExpanded && !hasPlumbers && (
                  <div className="border-t border-gray-100 bg-gray-50 p-3">
                    <div className="rounded-md border border-dashed border-gray-200 bg-white px-3 py-3 text-center text-sm text-black/60">
                      No plumbing companies listed in {stateName} yet.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
