// "use client";

// import { useState } from "react";
// import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

// interface SearchHeroProps {
//   onSearch: (term: string) => void;
// }

// export default function SearchHero({ onSearch }: SearchHeroProps) {
//   const [query, setQuery] = useState("");
//   const [zip, setZip] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSearch(query);
//   };

//   return (
//     <section className="bg-gradient-to-r from-[#FFD60A]/5 to-[#B1A606]/5 border-b border-gray-200 py-12">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="text-center max-w-3xl mx-auto">
//           <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">
//             Find the Best <span className="text-[#FFD60A]">Plumbers</span> Near You
//           </h1>
//           <p className="mt-3 text-gray-600">
//             Compare verified local plumbers, read reviews, and book with confidence.
//           </p>
//           <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
//             <div className="flex-1 relative">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Service or company name"
//                 className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
//               />
//             </div>
//             <div className="sm:w-48 relative">
//               <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={zip}
//                 onChange={(e) => setZip(e.target.value)}
//                 placeholder="Zip code"
//                 className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
//               />
//             </div>
//             <button
//               type="submit"
//               className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
//             >
//               Find Plumbers
//             </button>
//           </form>
//           <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
//             <span>🔥 Emergency available</span>
//             <span>✓ Verified pros</span>
//             <span>💰 Upfront pricing</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }








"use client";

import { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaFilter, FaTimes } from "react-icons/fa";

interface SearchFilters {
  query: string;
  zip: string;
  serviceCategory: string;
  emergencyOnly: boolean;
  verifiedOnly: boolean;
}

interface SearchHeroProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const serviceCategories = [
  "All Services",
  "Leak Repair",
  "Drain Cleaning",
  "Water Heater",
  "Pipe Repair",
  "Sewer Line",
  "Emergency Service",
  "Faucet Installation",
  "Toilet Repair",
  "Garbage Disposal",
  "Hydro Jetting",
  "Bathroom Remodel"
];

export default function SearchHero({ onSearch, initialFilters = {} }: SearchHeroProps) {
  const [query, setQuery] = useState(initialFilters.query || "");
  const [zip, setZip] = useState(initialFilters.zip || "");
  const [serviceCategory, setServiceCategory] = useState(initialFilters.serviceCategory || "All Services");
  const [emergencyOnly, setEmergencyOnly] = useState(initialFilters.emergencyOnly || false);
  const [verifiedOnly, setVerifiedOnly] = useState(initialFilters.verifiedOnly || false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query,
      zip,
      serviceCategory: serviceCategory === "All Services" ? "" : serviceCategory,
      emergencyOnly,
      verifiedOnly,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setZip("");
    setServiceCategory("All Services");
    setEmergencyOnly(false);
    setVerifiedOnly(false);
    onSearch({
      query: "",
      zip: "",
      serviceCategory: "",
      emergencyOnly: false,
      verifiedOnly: false,
    });
  };

  const hasActiveFilters = query || zip || serviceCategory !== "All Services" || emergencyOnly || verifiedOnly;

  return (
    <section className="bg-gradient-to-r from-[#FFD60A]/5 to-[#B1A606]/5 border-b border-gray-200 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">
            Find the Best <span className="text-[#FFD60A]">Plumbers</span> Near You
          </h1>
          <p className="mt-3 text-gray-600">
            Compare verified local plumbers, read reviews, and book with confidence.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            {/* Main row: search + location + submit */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search plumbers, services, location, certifications..."
                  className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
                />
              </div>
              <div className="sm:w-48 relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="Zip code or city"
                  className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
              >
                Find Plumbers
              </button>
            </div>

            {/* Advanced filters toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FFD60A]"
            >
              <FaFilter className="h-3 w-3" />
              {showAdvanced ? "Hide advanced filters" : "Show advanced filters"}
            </button>

            {/* Advanced filters panel */}
            {showAdvanced && (
              <div className="mt-4 rounded-2xl bg-white/80 p-4 backdrop-blur-sm border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Service Category</label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
                    >
                      {serviceCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={emergencyOnly}
                        onChange={(e) => setEmergencyOnly(e.target.checked)}
                        className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
                      />
                      <span className="text-gray-700">Emergency 24/7</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
                      />
                      <span className="text-gray-700">Verified only</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Active filters display & clear button */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-gray-500">Active filters:</span>
                {query && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    Search: {query}
                  </span>
                )}
                {zip && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    Location: {zip}
                  </span>
                )}
                {serviceCategory !== "All Services" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {serviceCategory}
                  </span>
                )}
                {emergencyOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                    Emergency
                  </span>
                )}
                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Verified
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-3 w-3" /> Clear all
                </button>
              </div>
            )}
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span>🔥 Emergency available</span>
            <span>✓ Verified pros</span>
            <span>💰 Upfront pricing</span>
          </div>
        </div>
      </div>
    </section>
  );
}