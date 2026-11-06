import type { DirectoryConfig, LandingPage } from "@/lib/adminApi";

/** "Top 10 · Drain Cleaning" for a page row. */
export const pageLabel = (page: LandingPage, config: DirectoryConfig) =>
  `Top ${page.limit} · ${page.service ? config.services.find((item) => item.slug === page.service)?.name ?? page.service : page.verifiedOnly ? "Licensed / verified plumbers" : "Plumbers"}`;

/** Why a page is not indexed, in a few words. */
export function indexNote(page: LandingPage) {
  if (!page.published) return page.hiddenBy && page.hiddenBy !== page.path ? `hidden (location ${page.hiddenBy})` : "unpublished";
  if (page.isIndexable) return "indexed · in sitemap";
  if (page.duplicateOfTop10) return "noindex · repeats the Top 10";
  return `noindex · needs ${page.minimumQualifyingCompanies} premium`;
}
