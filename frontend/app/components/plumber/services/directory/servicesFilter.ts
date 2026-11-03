import type { ServiceDetail } from "@/components/find/types";
import { splitPrice } from "../serviceVisuals";

// Filtering and sorting for the all-services page, kept apart from the UI so it's easy to read and test.

export type ServiceSort = "recommended" | "price-asc" | "price-desc" | "name";
export type ServiceFilters = { category: string; query: string; emergency: boolean; guaranteed: boolean; withMedia: boolean; sort: ServiceSort };
export const emptyFilters: ServiceFilters = { category: "All", query: "", emergency: false, guaranteed: false, withMedia: false, sort: "recommended" };

export const SORT_LABELS: Record<ServiceSort, string> = { recommended: "Recommended", "price-asc": "Price: low to high", "price-desc": "Price: high to low", name: "Name (A–Z)" };

const amountOf = (service: ServiceDetail) => splitPrice(service.price)?.amount ?? null;
const hasMedia = (service: ServiceDetail) => (service.photoCount ?? (service.image ? 1 : 0)) > 0 || (service.videoCount ?? 0) > 0;

/** Categories with how many services each has, most first. */
export function categoryCounts(services: ServiceDetail[]) {
  const counts = new Map<string, number>();
  for (const service of services) if (service.category) counts.set(service.category, (counts.get(service.category) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** The services that match the filters, in the chosen order (services without a price sort last). */
export function applyFilters(services: ServiceDetail[], f: ServiceFilters) {
  const words = f.query.trim().toLowerCase();
  const list = services.filter((s) =>
    (f.category === "All" || s.category === f.category)
    && (!f.emergency || s.emergency)
    && (!f.guaranteed || Boolean(s.warranty))
    && (!f.withMedia || hasMedia(s))
    && (!words || `${s.name} ${s.tagline ?? ""} ${s.category ?? ""} ${s.description ?? ""} ${s.includes.join(" ")}`.toLowerCase().includes(words)));
  const byPrice = (dir: 1 | -1) => (a: ServiceDetail, b: ServiceDetail) => {
    const [x, y] = [amountOf(a), amountOf(b)];
    if (x === null || y === null) return x === null ? (y === null ? 0 : 1) : -1;
    return (x - y) * dir;
  };
  const order = { recommended: (a: ServiceDetail, b: ServiceDetail) => Number(b.featured) - Number(a.featured), "price-asc": byPrice(1), "price-desc": byPrice(-1), name: (a: ServiceDetail, b: ServiceDetail) => a.name.localeCompare(b.name) }[f.sort];
  return list.map((s, i) => ({ s, i })).sort((a, b) => order(a.s, b.s) || a.i - b.i).map(({ s }) => s);
}

/** How many filters (besides search and sort) are on. */
export const activeFilterCount = (f: ServiceFilters) => Number(f.category !== "All") + Number(f.emergency) + Number(f.guaranteed) + Number(f.withMedia);
