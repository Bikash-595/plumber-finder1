"use client";

import { useState } from "react";
import { plumbers } from "@/data/plumbers";
import StateCityFilterSidebar from "@/components/find/StateCityFilterSidebar";
import ResultsHeader from "@/components/find/ResultsHeader";
import PlumberCardGrid from "@/components/find/PlumberCardGrid";
import PlumberCardList from "@/components/find/PlumberCardList";
import Pagination from "@/components/find/Pagination";

export default function StatesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(plumbers.length / itemsPerPage);
  const paginatedPlumbers = plumbers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Plumbers Across All States</h1>
          <p className="mt-1 text-gray-600">
            Browse all companies first, then filter by state and city from the sidebar.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-80 flex-shrink-0">
            <StateCityFilterSidebar />
          </aside>

          <div className="flex-1">
            <ResultsHeader
              totalResults={plumbers.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {viewMode === "grid" ? (
              <PlumberCardGrid plumbers={paginatedPlumbers} />
            ) : (
              <PlumberCardList plumbers={paginatedPlumbers} />
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
