"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { plumbers } from "@/data/plumbers";
import type { Plumber } from "@/components/find/types";
import { companyListingToPlumber, type CompanyListing } from "@/components/find/companyListing";
import ResultsHeader from "@/components/find/ResultsHeader";
import PlumberCardGrid from "@/components/find/PlumberCardGrid";
import PlumberCardList from "@/components/find/PlumberCardList";
import Pagination from "@/components/find/Pagination";
import { ServiceIcon } from "./serviceIcons";
import { offersService, serviceDefinitions, type ServiceDefinition } from "./serviceData";

const ITEMS_PER_PAGE = 6;

export default function ServiceCompanies({ service }: { service: ServiceDefinition }) {
  const [publishedCompanies, setPublishedCompanies] = useState<Plumber[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Companies published through the company dashboard live in the backend.
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api"}/companies/public`)
      .then((response) => response.ok ? response.json() : { data: [] })
      .then(({ data }) => setPublishedCompanies(((data || []) as CompanyListing[]).map(companyListingToPlumber)))
      .catch(() => setPublishedCompanies([]));
  }, []);

  const allCompanies = useMemo(() => [...publishedCompanies, ...plumbers], [publishedCompanies]);
  const companies = allCompanies.filter((company) => offersService(company, service));
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
              <p className="text-gray-500">No companies are listed for {service.name.toLowerCase()} yet.</p>
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

function ServiceFilterSidebar({ selectedSlug, counts }: { selectedSlug: string; counts: Record<string, number> }) {
  return (
    <nav aria-label="Filter by service" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-lg font-semibold text-black">Filter by Service</h3>
      <p className="mb-4 mt-1 text-sm text-gray-700">Choose a service to see the companies that provide it.</p>
      {/* Horizontal chips on phones/tablets, vertical list on laptops and up. */}
      <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:max-h-[38rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:px-0 lg:pb-0">
        {serviceDefinitions.map((item) => {
          const isSelected = item.slug === selectedSlug;
          return (
            <li key={item.slug} className="shrink-0">
              <Link
                href={`/services/${item.slug}`}
                aria-current={isSelected ? "page" : undefined}
                className={`flex items-center gap-3 whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-yellow-400 bg-yellow-400 text-gray-950"
                    : "border-gray-100 text-black hover:bg-yellow-100 hover:text-gray-950"
                }`}
              >
                <ServiceIcon slug={item.slug} className={`h-4 w-4 shrink-0 ${isSelected ? "text-gray-950" : "text-[#0b1f3b]/60"}`} />
                <span className="lg:flex-1">{item.name}</span>
                <span className={`text-xs ${isSelected ? "text-gray-900" : "text-black/60"}`}>({counts[item.slug] ?? 0})</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
