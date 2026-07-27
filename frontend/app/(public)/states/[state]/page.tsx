"use client";

export const dynamic = "force-dynamic";

import { use } from "react";
import { notFound } from "next/navigation";
import { plumbers } from "@/data/plumbers";
import { getStateAbbr } from "@/components/utils/location";
import StateCityFilterSidebar from "@/components/find/StateCityFilterSidebar";
import ResultsHeader from "@/components/find/ResultsHeader";
import PlumberCardGrid from "@/components/find/PlumberCardGrid";
import PlumberCardList from "@/components/find/PlumberCardList";
import Pagination from "@/components/find/Pagination";
import { useState } from "react";

export default function StatePage({ params, searchParams }: { params: Promise<{ state: string }>, searchParams: Promise<{ city?: string }> }) {
  const { state: statePath } = use(params);
  const { city } = use(searchParams);

  // Convert URL slug to state name (e.g., "california" -> "California")
  const stateName = statePath.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const stateAbbr = getStateAbbr(stateName);

  if (!stateAbbr) {
    notFound();
  }

  // Filter plumbers by state and optionally by city
  let filteredPlumbers = plumbers.filter(p => p.state === stateAbbr);
  if (city) {
    filteredPlumbers = filteredPlumbers.filter(p => p.city === city);
  }

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredPlumbers.length / itemsPerPage);
  const paginatedPlumbers = filteredPlumbers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Plumbers in {stateName}
            {city && ` – ${city}`}
          </h1>
          <p className="text-gray-600 mt-1">{filteredPlumbers.length} companies found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <StateCityFilterSidebar selectedState={stateAbbr} selectedCity={city} />
          </aside>
          <div className="flex-1">
            <ResultsHeader
              totalResults={filteredPlumbers.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            {paginatedPlumbers.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
                <p className="text-gray-500">No plumbers found in this location.</p>
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
        </div>
      </div>
    </main>
  );
}
