"use client";

import Link from "next/link";
import { ServiceIcon } from "../serviceIcons";
import { serviceDefinitions } from "../serviceData";

export default function ServiceFilterSidebar({ selectedSlug, counts }: { selectedSlug: string; counts: Record<string, number> }) {
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
