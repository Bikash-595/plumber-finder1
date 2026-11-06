"use client";

import Link from "next/link";
import { useState } from "react";
import { useDirectoryPlumbers } from "@/components/find/usePublishedPlumbers";
import { sortByDistance } from "@/components/find/distance";
import { useUserLocation } from "@/components/find/useUserLocation";
import ResultsHeader from "@/components/find/ResultsHeader";
import PlumberCardGrid from "@/components/find/PlumberCardGrid";
import PlumberCardList from "@/components/find/PlumberCardList";
import Pagination from "@/components/find/Pagination";
import { offersService, serviceDefinitions, type ServiceDefinition } from "./serviceData";
import ServiceFilterSidebar from "@/components/services/service-companies/ServiceFilterSidebar";

const ITEMS_PER_PAGE = 6;

export default function ServiceCompanies({ service }: { service: ServiceDefinition }) {
  // Companies published through the company dashboard live in the backend.
  const { plumbers: allCompanies, loading } = useDirectoryPlumbers();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const { location: userLocation } = useUserLocation();
  // Nearest companies first once the visitor shares their location.
  const companies = sortByDistance(allCompanies.filter((company) => offersService(company, service)), userLocation);
  const countsBySlug = Object.fromEntries(serviceDefinitions.map((item) => [item.slug, allCompanies.filter((company) => offersService(company, item)).length]));

  const totalPages = Math.ceil(companies.length / ITEMS_PER_PAGE);
  const paginated = companies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8" aria-labelledby="service-companies-heading">
      <div className="mb-6 sm:mb-8">
        <h2 id="service-companies-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {service.name} companies
        </h2>
        <p className="mt-1 text-gray-600">
          {companies.length} {companies.length === 1 ? "company provides" : "companies provide"} {service.name.toLowerCase()}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-80 lg:flex-shrink-0">
          <ServiceFilterSidebar selectedSlug={service.slug} counts={countsBySlug} />
        </aside>

        <div className="min-w-0 flex-1">
          <ResultsHeader totalResults={companies.length} viewMode={viewMode} onViewModeChange={setViewMode} />
          {paginated.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
              <p className="text-gray-500">{loading ? "Loading companies…" : `No companies are listed for ${service.name.toLowerCase()} yet.`}</p>
              <Link href="/find" className="mt-4 inline-flex rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b]">
                Browse all plumbers
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <PlumberCardGrid plumbers={paginated} />
          ) : (
            <PlumberCardList plumbers={paginated} />
          )}
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>
      </div>
    </section>
  );
}
