// export default function Home() {
//   return (
//     <main className="min-h-screen bg-[color:var(--color-dark-navy)] text-white">
//       <section
//         className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,#123260,transparent_45%),radial-gradient(circle_at_top_right,#0f2a4d,transparent_40%),radial-gradient(circle_at_bottom_left,#0f2a4d,transparent_35%)]"
//         style={{
//           backgroundImage:
//             "url('/Plumber%20working%20under%20a%20modern%20sink.png'), radial-gradient(circle at top left, #123260 0%, transparent 45%), radial-gradient(circle at top right, #0f2a4d 0%, transparent 40%), radial-gradient(circle at bottom left, #0f2a4d 0%, transparent 35%)",
//           backgroundSize: "cover, auto, auto, auto",
//           backgroundPosition: "center 30%",
//         }}
//       >
//         <div className="absolute inset-0 bg-[#0b1f3b]/55" aria-hidden />

//         <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24 lg:items-start">
//           <div className="max-w-3xl space-y-4">
//             <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
//               Find top-rated plumbers in your area fast
//             </h1>
//             <p className="text-base text-white/80 sm:text-lg">
//               Compare vetted local plumbers, read verified reviews, and book the right pro with transparent pricing, no phone tag required.
//             </p>
//           </div>

//           <div className="w-full max-w-5xl rounded-2xl bg-white/10 p-4 backdrop-blur shadow-2xl ring-1 ring-white/10">
//             <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
//               <label className="flex flex-[3] items-center gap-3 rounded-full bg-white px-4 py-3 text-[color:var(--color-dark-navy)] shadow-lg">
//                 <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-primary-blue)]/10 text-[color:var(--color-primary-blue)]">
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
//                     <path d="m15.5 15.5 3 3" />
//                     <circle cx="11" cy="11" r="6" />
//                   </svg>
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="What can we help you with?"
//                   className="w-full bg-transparent text-base outline-none placeholder:text-[color:var(--color-dark-navy)]/50"
//                 />
//               </label>
//               <label className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-3 text-[color:var(--color-dark-navy)] shadow-lg lg:flex-[1.1] lg:w-auto">
//                 <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-alert-orange)]/10 text-[color:var(--color-alert-orange)]">
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
//                     <path d="M12 21s-7-5.373-7-10A7 7 0 0 1 19 11c0 4.627-7 10-7 10Z" />
//                     <circle cx="12" cy="11" r="2.5" />
//                   </svg>
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="Zip code"
//                   className="w-full bg-transparent text-base outline-none placeholder:text-[color:var(--color-dark-navy)]/50"
//                 />
//               </label>
//               <button className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-alert-orange)] px-6 py-3 text-base font-semibold text-white shadow-xl transition hover:brightness-110 lg:flex-[0.9]">
//                 Get Quotes
//               </button>
//             </div>
//             <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-white/70">
//               <span className="rounded-full bg-white/10 px-3 py-1">Fast Response</span>
//               <span className="rounded-full bg-white/10 px-3 py-1">Verified Reviews</span>
//               <span className="rounded-full bg-white/10 px-3 py-1">No Hidden Fees</span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/80">
//             {["Emergency Repair", "Leak Detection", "Water Heater", "Drain Cleaning", "Pipe Install", "Bathroom Remodel"].map((chip) => (
//               <span
//                 key={chip}
//                 className="rounded-full border border-white/15 px-4 py-2 backdrop-blur transition hover:border-white/40 hover:text-white"
//               >
//                 {chip}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

























"use client";

import { useEffect, useState } from "react";
import { plumbers } from "@/data/plumbers";
import type { Plumber } from "@/components/find/types";
import PlumberCardGrid from "@/components/find/PlumberCardGrid";
import PlumberCardList from "@/components/find/PlumberCardList";
import ResultsHeader from "@/components/find/ResultsHeader";
import Pagination from "@/components/find/Pagination";

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [publishedCompanies, setPublishedCompanies] = useState<Plumber[]>([]);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api"}/companies/public`)
      .then((response) => response.ok ? response.json() : { data: [] })
      .then(({ data }) => setPublishedCompanies((data || []).map((company: { _id: string; companyName: string; logo?: string; coverImage?: string; services?: string[]; serviceAreas?: string[]; location?: string; city?: string; state?: string; phone?: string; email?: string; website?: string; description?: string; rating?: number; reviewCount?: number }) => ({
        id: company._id,
        companyName: company.companyName,
        ownerName: company.companyName,
        rating: company.rating || 0,
        reviewCount: company.reviewCount || 0,
        logo: company.logo || company.coverImage || "",
        services: company.services || [],
        priceRange: "Contact for pricing",
        averageCost: 0,
        availability: "Available",
        isVerified: true,
        isEmergency: false,
        location: company.location || [company.city, company.state].filter(Boolean).join(", "),
        city: company.city,
        state: company.state,
        phone: company.phone || "",
        email: company.email || "",
        website: company.website,
        description: company.description || "",
        yearsInBusiness: 0,
        established: new Date().getFullYear(),
        insurance: "",
        certifications: [],
        serviceAreas: company.serviceAreas || [],
        specializations: company.services || [],
        responseTime: "Contact for availability",
        teamSize: 0,
        warranty: "",
        paymentMethods: [],
        languages: [],
        media: { images: company.coverImage ? [company.coverImage] : [], videos: [] },
        projects: [],
      }))))
      .catch(() => setPublishedCompanies([]));
  }, []);

  const allPlumbers = [...publishedCompanies, ...plumbers];

  // Filter plumbers based on search term
  const filteredPlumbers = allPlumbers.filter((plumber) =>
    plumber.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plumber.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPlumbers.length / itemsPerPage);
  const paginatedPlumbers = filteredPlumbers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Hero Search Section */}
      {/* <section
        className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,#123260,transparent_45%),radial-gradient(circle_at_top_right,#0f2a4d,transparent_40%),radial-gradient(circle_at_bottom_left,#0f2a4d,transparent_35%)]"
        style={{
          backgroundImage:
            "url('/Plumber%20working%20under%20a%20modern%20sink.png'), radial-gradient(circle at top left, #123260 0%, transparent 45%), radial-gradient(circle at top right, #0f2a4d 0%, transparent 40%), radial-gradient(circle at bottom left, #0f2a4d 0%, transparent 35%)",
          backgroundSize: "cover, auto, auto, auto",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 bg-[#0b1f3b]/55" aria-hidden />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:items-start lg:pb-20 lg:pt-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Find top-rated plumbers in your area fast
            </h1>
            <p className="text-base text-white/80 sm:text-lg">
              Compare vetted local plumbers, read verified reviews, and book the right pro with transparent pricing, no phone tag required.
            </p>
          </div>

          <div className="w-full max-w-5xl rounded-2xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <label className="flex flex-[3] items-center gap-3 rounded-full bg-white px-4 py-3 text-[color:var(--color-dark-navy)] shadow-lg">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-primary-blue)]/10 text-[color:var(--color-primary-blue)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="m15.5 15.5 3 3" />
                    <circle cx="11" cy="11" r="6" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="What can we help you with?"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-base outline-none placeholder:text-[color:var(--color-dark-navy)]/50"
                />
              </label>

              <label className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-3 text-[color:var(--color-dark-navy)] shadow-lg lg:w-auto lg:flex-[1.1]">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-alert-orange)]/10 text-[color:var(--color-alert-orange)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="M12 21s-7-5.373-7-10A7 7 0 0 1 19 11c0 4.627-7 10-7 10Z" />
                    <circle cx="12" cy="11" r="2.5" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Zip code"
                  className="w-full bg-transparent text-base outline-none placeholder:text-[color:var(--color-dark-navy)]/50"
                />
              </label>

              <button className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-alert-orange)] px-6 py-3 text-base font-semibold text-white shadow-xl transition hover:brightness-110 lg:flex-[0.9]">
                Get Quotes
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-white/70">
              <span className="rounded-full bg-white/10 px-3 py-1">Fast Response</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Verified Reviews</span>
              <span className="rounded-full bg-white/10 px-3 py-1">No Hidden Fees</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/80">
            {["Emergency Repair", "Leak Detection", "Water Heater", "Drain Cleaning", "Pipe Install", "Bathroom Remodel"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/15 px-4 py-2 backdrop-blur transition hover:border-white/40 hover:text-white"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section> */}

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <ResultsHeader
          totalResults={filteredPlumbers.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {paginatedPlumbers.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-500">No plumbers found. Try adjusting your search.</p>
          </div>
        ) : viewMode === "grid" ? (
          <PlumberCardGrid plumbers={paginatedPlumbers} />
        ) : (
          <PlumberCardList plumbers={paginatedPlumbers} />
        )}

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </main>
  );
}
