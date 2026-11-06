import { Admin } from "../../../auth/admin/models/Admin.js";
import { CompanyListing } from "../../../company/listing/models/CompanyListing.js";
import { DIRECTORY_SERVICES, serviceBySlug } from "../../../directory/config/directoryServices.js";
import { PAGE_TEMPLATES, RANKING_FACTORS, RANKING_TYPES, TEMPLATE_PLACEHOLDERS, rankingDefaults } from "../../../directory/config/rankingDefaults.js";
import { US_STATES, stateByCode } from "../../../directory/config/usStates.js";
import { SearchLog } from "../../../directory/models/SearchLog.js";
import { locationKey, pagesAt, sitemapPages } from "../../../directory/services/landingPages.js";
import { citiesByState, locationFromSlugs } from "../../../directory/services/locations.js";
import { savePageSetting, storedPageSettings } from "../../../directory/services/pageSettings.js";
import { rankingConfigWithHistory, saveConfigChange, validateConfigChange } from "../../../directory/services/rankingConfig.js";
import { hasActivePremium, rankProviders, scoreEntry } from "../../../directory/services/rankingEngine.js";
import { rankingEntries } from "../../../directory/services/rankingIndex.js";
import { FreelancerListing } from "../../../freelancer/listing/models/FreelancerListing.js";

/** Excluded listings with their names, so the admin sees who they are. */
async function namedExclusions(exclusions) {
  const ids = (type) => exclusions.filter((item) => item.providerType === type).map((item) => item.listingId);
  const [companies, freelancers] = await Promise.all([
    CompanyListing.find({ _id: { $in: ids("company") } }).select("companyName city state").lean(),
    FreelancerListing.find({ _id: { $in: ids("freelancer") } }).select("displayName city state").lean(),
  ]);
  const names = new Map([...companies.map((item) => [`company:${item._id}`, item.companyName]), ...freelancers.map((item) => [`freelancer:${item._id}`, item.displayName])]);
  return exclusions.map((item) => ({ ...item, name: names.get(`${item.providerType}:${item.listingId}`) ?? "(listing removed)" }));
}

async function configResponse() {
  const { settings, history, updatedAt } = await rankingConfigWithHistory();
  return {
    settings: { ...settings, exclusions: await namedExclusions(settings.exclusions), placements: await namedExclusions(settings.placements) },
    defaults: rankingDefaults, factors: RANKING_FACTORS, rankingTypes: RANKING_TYPES, templates: PAGE_TEMPLATES, placeholders: TEMPLATE_PLACEHOLDERS,
    services: DIRECTORY_SERVICES.map(({ slug, name }) => ({ slug, name })), history, updatedAt,
  };
}

/** `?state=usa|<slug>&city=<slug>` → { state, city } (state null = the USA), or null when unknown. */
async function placeFrom(query) {
  if (!query.state || query.state === "usa") return { state: null, city: null };
  return locationFromSlugs(query.state, query.city || undefined);
}

const PAGE_KEY = /^\/top-(10|50)-[a-z][a-z-]*(-usa|\/[a-z0-9-]+(\/[a-z0-9-]+)?)$/;
const LOCATION_KEY = /^(usa|state:[A-Z]{2}|city:[A-Z]{2}\/[a-z0-9-]+)$/;

export const directoryAdminController = {
  // GET /config — ranking settings, the defaults, and the last changes.
  getConfig: async (_req, res, next) => {
    try { res.json({ data: await configResponse() }); } catch (error) { next(error); }
  },

  // PUT /config { weights?, minimumQualifyingCompanies?, …, exclusions? } — only the fields sent change.
  updateConfig: async (req, res, next) => {
    try {
      const { values, errors } = validateConfigChange(req.body ?? {});
      if (errors) return res.status(400).json({ message: "Please check the ranking settings.", errors });
      if (values.weights && Object.values({ ...(await rankingConfigWithHistory()).settings.weights, ...values.weights }).every((weight) => weight === 0)) return res.status(400).json({ message: "At least one ranking factor needs a weight above 0.", errors: { weights: "all weights are 0" } });
      const admin = await Admin.findById(req.auth.sub).select("name").lean();
      await saveConfigChange(values, admin);
      res.json({ message: "Ranking settings saved.", data: await configResponse() });
    } catch (error) { next(error); }
  },

  // GET /preview?state=<slug>&city=<slug>&service=<slug>&limit=10|50 — the ranking with every score explained,
  // including excluded providers (marked), so the admin can check the settings before and after a change.
  preview: async (req, res, next) => {
    try {
      const place = await placeFrom(req.query);
      if (!place) return res.status(400).json({ message: "Choose a valid state (and city)." });
      const service = req.query.service ? serviceBySlug.get(String(req.query.service)) ?? null : null;
      const limit = Number(req.query.limit) === 50 ? 50 : 10;
      const ranking = await rankProviders({ state: place.state, city: place.city, service, limit });
      const { settings } = await rankingConfigWithHistory();
      const excludedKeys = new Set(settings.exclusions.map((item) => `${item.providerType}:${item.listingId}`));
      const context = { stateCode: place.state?.code ?? null, citySlug: place.city?.slug ?? null };
      const excluded = (await rankingEntries()).filter((entry) => excludedKeys.has(entry.key) && (!place.state || entry.stateCode === place.state.code))
        .map((entry) => ({ providerType: entry.providerType, listingId: entry.listingId, name: entry.name, city: entry.city, premium: hasActivePremium(entry), ...scoreEntry(entry, context, settings) }));
      const shape = (item) => ({ position: item.position, providerType: item.entry.providerType, listingId: item.entry.listingId, name: item.entry.name, city: item.entry.city, stateCode: item.entry.stateCode, url: item.entry.url, verified: item.entry.verified, premium: Boolean(item.entry.premium), placement: item.placement?.kind, rating: Math.round(item.ratingAverage * 10) / 10, reviews: item.ratingCount, completedJobs: item.entry.completedJobs, score: item.score, breakdown: item.breakdown, newBusinessPenalty: item.newBusinessPenalty });
      res.json({ data: { location: { state: place.state?.name ?? "USA", city: place.city?.name ?? null }, items: ranking.items.map(shape), sponsored: ranking.sponsored.map(shape), qualifying: ranking.qualifying, otherProviders: ranking.otherProviders, seo: ranking.seo, excluded } });
    } catch (error) { next(error); }
  },

  // GET /premium?state=<code>&q=<name> — every listing with an active premium plan: whether it can rank (an admin
  // can make it ineligible — it is then excluded), verified or not, where, which plan and until when.
  premium: async (req, res, next) => {
    try {
      const { settings } = await rankingConfigWithHistory();
      const excluded = new Map(settings.exclusions.map((item) => [`${item.providerType}:${item.listingId}`, item.reason]));
      const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase().slice(0, 80) : "";
      const stateCode = typeof req.query.state === "string" ? req.query.state.toUpperCase() : "";
      const soon = Date.now() + 7 * 86_400_000;
      const rows = (await rankingEntries())
        .filter((entry) => hasActivePremium(entry) && (!stateCode || entry.stateCode === stateCode) && (!q || entry.name.toLowerCase().includes(q)))
        .map((entry) => ({
          providerType: entry.providerType, listingId: entry.listingId, name: entry.name, url: entry.url, city: entry.city, stateCode: entry.stateCode,
          tier: entry.premium.tier, until: entry.premium.until, expiresSoon: Boolean(entry.premium.until && new Date(entry.premium.until).getTime() < soon),
          verified: entry.verified, blocked: entry.blocked, missingLocation: !entry.stateCode,
          eligible: !excluded.has(entry.key) && !entry.blocked && Boolean(entry.stateCode), excludedReason: excluded.get(entry.key) ?? null,
        }))
        .sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.name.localeCompare(b.name));
      res.json({ data: { rows, total: rows.length, eligible: rows.filter((row) => row.eligible).length, verified: rows.filter((row) => row.eligible && row.verified).length } });
    } catch (error) { next(error); }
  },

  // GET /pages?state=usa|<slug>&city=<slug> — every landing page at a location (Top 10 / Top 50 × plumbers,
  // licensed plumbers and each service): premium providers, published, indexable, and the admin's wording.
  pages: async (req, res, next) => {
    try {
      const place = await placeFrom(req.query);
      if (!place) return res.status(400).json({ message: "Choose a valid state (and city)." });
      const stored = new Map((await storedPageSettings()).map((doc) => [doc.key, doc]));
      const location = locationKey(place.state?.code ?? null, place.city?.slug ?? null);
      const pages = (await pagesAt(place.state, place.city)).map((page) => {
        const doc = stored.get(page.path);
        return { ...page, title: doc?.title ?? "", description: doc?.description ?? "", intro: doc?.intro ?? "", updatedBy: doc?.updatedBy ?? null, updatedAt: doc?.updatedAt ?? null };
      });
      res.json({ data: { location: { key: location, published: stored.get(location)?.published !== false, state: place.state?.name ?? null, city: place.city?.name ?? null }, pages } });
    } catch (error) { next(error); }
  },

  // PUT /pages { key, kind: "page" | "location", published?, title?, description?, intro? } — publish / unpublish a
  // landing page (or a whole location) and set its SEO title, description and introduction.
  savePage: async (req, res, next) => {
    try {
      const { key, kind, published, title = "", description = "", intro = "" } = req.body ?? {};
      const errors = {};
      if (kind === "page" ? !PAGE_KEY.test(String(key)) : kind === "location" ? !LOCATION_KEY.test(String(key)) : true) errors.key = "must be a ranking page path or a location (usa, state:TX, city:TX/austin)";
      if (published !== undefined && typeof published !== "boolean") errors.published = "must be true or false";
      for (const [field, value, max] of [["title", title, 160], ["description", description, 320], ["intro", intro, 1500]]) if (typeof value !== "string" || value.length > max) errors[field] = `must be text up to ${max} characters`;
      if (kind === "location" && (title || description || intro)) errors.title = "a location can only be published or unpublished";
      if (Object.keys(errors).length) return res.status(400).json({ message: "Please check the page settings.", errors });
      const admin = await Admin.findById(req.auth.sub).select("name").lean();
      await savePageSetting({ key, kind, published, title: title.trim(), description: description.trim(), intro: intro.trim() }, admin?.name);
      res.json({ message: published === false ? "Unpublished: the page answers 404 and leaves the sitemap." : "Page settings saved." });
    } catch (error) { next(error); }
  },

  // GET /sitemap-status — what the directory sitemaps list (per page design), the pages kept out and why, and
  // unpublished pages. Google's own indexing status lives in Search Console (it has no public API without the
  // site owner's credentials), so this reports what the site tells search engines.
  sitemapStatus: async (_req, res, next) => {
    try {
      const listed = await sitemapPages();
      const byScope = Object.fromEntries(["usa", "state", "city"].map((scope) => [scope, listed.filter((page) => page.scope === scope).length]));
      const entries = await rankingEntries();
      const premiumStates = new Set(entries.filter((entry) => hasActivePremium(entry)).map((entry) => entry.stateCode));
      const thin = [];
      for (const state of US_STATES) {
        if (!premiumStates.has(state.code)) continue;
        const ranking = await rankProviders({ state, limit: 10 });
        if (!ranking.seo.isIndexable) thin.push({ path: `/top-10-plumbers/${state.slug}`, qualifying: ranking.qualifying, needs: ranking.seo.minimumQualifyingCompanies });
      }
      const cityCount = [...(await citiesByState()).values()].reduce((sum, list) => sum + list.size, 0);
      const unpublished = (await storedPageSettings()).filter((doc) => doc.published === false).map((doc) => ({ key: doc.key, kind: doc.kind, updatedBy: doc.updatedBy ?? null, updatedAt: doc.updatedAt }));
      const siteUrl = (process.env.SITE_URL || process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim().replace(/\/$/, "");
      res.json({
        data: {
          total: listed.length, byScope,
          sitemaps: ["usa", "states", "cities"].map((name) => `${siteUrl}/sitemaps/${name}.xml`).concat(`${siteUrl}/sitemap.xml`),
          robots: `${siteUrl}/robots.txt`,
          statesWithPremium: premiumStates.size, statesWithoutPremium: US_STATES.length - premiumStates.size, cities: cityCount,
          thinStatePages: thin, unpublished,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) { next(error); }
  },

  // GET /search-stats?days=7|30|90 — what people search for, and the searches that found nothing.
  searchStats: async (req, res, next) => {
    try {
      const days = [7, 30, 90].includes(Number(req.query.days)) ? Number(req.query.days) : 30;
      const since = new Date(Date.now() - days * 86_400_000);
      const match = { $match: { createdAt: { $gte: since } } };
      const top = (field, extra = {}) => [match, { $match: { [field]: { $nin: [null, ""] }, ...extra } }, { $group: { _id: `$${field}`, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }];
      const [[totals], intents, services, states, cities, limits, noResults, queries] = await Promise.all([
        SearchLog.aggregate([match, { $group: { _id: null, searches: { $sum: 1 }, noResults: { $sum: { $cond: [{ $eq: ["$results", 0] }, 1, 0] } } } }]),
        SearchLog.aggregate(top("intent")),
        SearchLog.aggregate(top("service")),
        SearchLog.aggregate(top("stateCode")),
        SearchLog.aggregate([match, { $match: { city: { $nin: [null, ""] } } }, { $group: { _id: { city: "$city", state: "$stateCode" }, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
        SearchLog.aggregate([match, { $match: { intent: "ranking" } }, { $group: { _id: "$limit", count: { $sum: 1 } } }]),
        SearchLog.aggregate([match, { $match: { $or: [{ results: 0 }, { intent: "unknown-location" }] } }, { $group: { _id: "$q", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 15 }]),
        SearchLog.aggregate(top("q")),
      ]);
      const named = (rows, label) => rows.map((row) => ({ label: label(row._id), count: row.count }));
      res.json({
        data: {
          days, searches: totals?.searches ?? 0, noResults: totals?.noResults ?? 0,
          intents: named(intents, (id) => id), queries: named(queries, (id) => id),
          services: named(services, (id) => serviceBySlug.get(id)?.name ?? id),
          states: named(states, (id) => stateByCode.get(id)?.name ?? id),
          cities: named(cities, (id) => `${id.city}, ${id.state}`),
          top10: limits.find((row) => row._id === 10)?.count ?? 0, top50: limits.find((row) => row._id === 50)?.count ?? 0,
          noResultQueries: named(noResults, (id) => id),
        },
      });
    } catch (error) { next(error); }
  },
};
