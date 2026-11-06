import { DIRECTORY_SERVICES } from "../config/directoryServices.js";
import { RANKING_LIMITS } from "../config/rankingDefaults.js";
import { US_STATES } from "../config/usStates.js";
import { rankingPath } from "./intentParser.js";
import { citiesByState } from "./locations.js";
import { locationKey, pageSettings } from "./pageSettings.js";
import { hasActivePremium, rankProviders } from "./rankingEngine.js";
import { rankingEntries } from "./rankingIndex.js";

// Every landing page there can be, for the sitemaps and the admin's page list. For one location (the USA, a state
// or a city) the pages are: plumbers, licensed plumbers and each service, as a Top 10 and a Top 50.

/** The kinds of ranking at every location: { service, verifiedOnly, type }. */
export const PAGE_KINDS = [
  { service: null, verifiedOnly: false, type: "top-rated" },
  { service: null, verifiedOnly: true, type: "verified" },
  ...DIRECTORY_SERVICES.map((service) => ({ service, verifiedOnly: false, type: "top-rated" })),
];

/** One page: its path, how many premium providers qualify, whether it is published and indexable. */
export async function describePage({ limit, kind, state, city }) {
  const path = rankingPath({ limit, service: kind.service, type: kind.type, state, city });
  const [ranking, settings] = await Promise.all([
    rankProviders({ state, city, service: kind.service, limit, type: kind.type, verifiedOnly: kind.verifiedOnly }),
    pageSettings(path, state?.code ?? null, city?.slug ?? null),
  ]);
  return {
    path, limit, service: kind.service?.slug ?? null, verifiedOnly: kind.verifiedOnly,
    scope: !state ? "usa" : city ? "city" : "state",
    qualifying: ranking.qualifying,
    published: settings.published, hiddenBy: settings.hiddenBy,
    hasOverrides: Boolean(settings.title || settings.description || settings.intro),
    isIndexable: settings.published && ranking.seo.isIndexable,
    duplicateOfTop10: ranking.seo.duplicateOfTop10,
    minimumQualifyingCompanies: ranking.seo.minimumQualifyingCompanies,
  };
}

/** Every page at one location. */
export async function pagesAt(state, city) {
  const pages = [];
  for (const kind of PAGE_KINDS) for (const limit of RANKING_LIMITS) pages.push(await describePage({ limit, kind, state, city }));
  return pages;
}

/**
 * The pages worth listing in a sitemap: published and indexable. `scope` "usa" | "state" | "city" (or all).
 * Cities are only considered where someone is listed; licensed-only pages repeat the main list, so they are left out.
 */
export async function sitemapPages(scope) {
  const pages = [];
  const add = async (state, city, kinds) => {
    for (const kind of kinds) {
      const top10 = await describePage({ limit: 10, kind, state, city });
      if (!top10.isIndexable) continue;
      pages.push(top10);
      const top50 = await describePage({ limit: 50, kind, state, city });
      if (top50.isIndexable) pages.push(top50);
    }
  };
  const kinds = PAGE_KINDS.filter((kind) => !kind.verifiedOnly);
  if (!scope || scope === "usa") await add(null, null, kinds);
  if (scope && scope === "usa") return pages;
  // Only states with a premium listing can have a ranking (skips most of the work on a young directory).
  const premiumStates = new Set((await rankingEntries()).filter((entry) => hasActivePremium(entry)).map((entry) => entry.stateCode));
  const cities = await citiesByState();
  for (const state of US_STATES) {
    if (!premiumStates.has(state.code)) continue;
    if (!scope || scope === "state") await add(state, null, kinds);
    if (!scope || scope === "city") for (const city of cities.get(state.code).values()) if (city.providers > 0) await add(state, city, kinds.slice(0, 1));
  }
  return pages;
}

export { locationKey };
