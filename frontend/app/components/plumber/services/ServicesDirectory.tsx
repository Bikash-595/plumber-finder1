"use client";

import { useMemo, useState } from "react";
import type { ServiceDetail } from "@/components/find/types";
import ServiceCard from "./ServiceCard";
import ServicesToolbar from "./ServicesToolbar";

/** Every service, with category tabs and search: the all-services page. */
export default function ServicesDirectory({ services, hrefs }: { services: ServiceDetail[]; hrefs: Record<string, string | undefined> }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const service of services) if (service.category) counts.set(service.category, (counts.get(service.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [services]);
  const shown = useMemo(() => {
    const words = query.trim().toLowerCase();
    return services
      .filter((service) => category === "All" || service.category === category)
      .filter((service) => !words || `${service.name} ${service.category ?? ""} ${service.description ?? ""} ${service.includes.join(" ")}`.toLowerCase().includes(words))
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [services, category, query]);
  return (
    <div className="@container">
      <ServicesToolbar categories={categories} total={services.length} category={category} onCategory={setCategory} query={query} onQuery={setQuery} showSearch />
      {shown.length ? (
        <ul className="mt-6 grid grid-cols-2 gap-3 @2xl:grid-cols-3 @2xl:gap-4 @5xl:grid-cols-4 @7xl:grid-cols-5">
          {shown.map((service) => <li key={service.id}><ServiceCard service={service} href={hrefs[service.id]} bookOnPage={false} /></li>)}
        </ul>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No services match{query ? ` “${query}”` : " this category"}. <button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="font-bold text-[#0b1f3b] underline">Show all</button></p>
      )}
    </div>
  );
}
