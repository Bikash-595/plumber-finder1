"use client";

import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import type { ServiceDetail } from "@/components/find/types";
import ServiceCard from "./ServiceCard";
import ServicesToolbar from "./ServicesToolbar";
import ServicesFilterPanel from "./directory/ServicesFilterPanel";
import { applyFilters, categoryCounts, emptyFilters, type ServiceFilters } from "./directory/servicesFilter";

/**
 * The all-services page's body: filters (sidebar on desktop, chips on phones), search and sort, and the cards —
 * 2 per row on phones, 3 on tablets and laptops, 4 on wide screens.
 */
export default function ServicesDirectory({ services, hrefs }: { services: ServiceDetail[]; hrefs: Record<string, string | undefined> }) {
  const [filters, setFilters] = useState<ServiceFilters>(emptyFilters);
  const categories = useMemo(() => categoryCounts(services), [services]);
  const shown = useMemo(() => applyFilters(services, filters), [services, filters]);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)]">
      <ServicesFilterPanel filters={filters} onChange={setFilters} categories={categories} total={services.length} />
      <div className="min-w-0 space-y-5">
        <ServicesToolbar query={filters.query} onQuery={(query) => setFilters({ ...filters, query })} sort={filters.sort} onSort={(sort) => setFilters({ ...filters, sort })} shown={shown.length} total={services.length} />
        {shown.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 2xl:grid-cols-4">
            {shown.map((service) => <li key={service.id}><ServiceCard service={service} href={hrefs[service.id]} bookOnPage={false} /></li>)}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <FaSearch className="mx-auto h-6 w-6 text-gray-300" aria-hidden />
            <p className="mt-3 font-bold text-gray-900">No services match</p>
            <p className="mt-1 text-sm text-gray-500">Try another category or search, or clear the filters.</p>
            <button type="button" onClick={() => setFilters(emptyFilters)} className="mt-4 rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-bold text-white">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
