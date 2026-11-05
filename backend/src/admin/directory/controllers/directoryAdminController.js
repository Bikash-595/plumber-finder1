import { Admin } from "../../../auth/admin/models/Admin.js";
import { CompanyListing } from "../../../company/listing/models/CompanyListing.js";
import { DIRECTORY_SERVICES, serviceBySlug } from "../../../directory/config/directoryServices.js";
import { RANKING_FACTORS, RANKING_TYPES, rankingDefaults } from "../../../directory/config/rankingDefaults.js";
import { stateByCode } from "../../../directory/config/usStates.js";
import { SearchLog } from "../../../directory/models/SearchLog.js";
import { locationFromSlugs } from "../../../directory/services/locations.js";
import { rankingConfigWithHistory, saveConfigChange, validateConfigChange } from "../../../directory/services/rankingConfig.js";
import { rankProviders, scoreEntry } from "../../../directory/services/rankingEngine.js";
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
  return { settings: { ...settings, exclusions: await namedExclusions(settings.exclusions) }, defaults: rankingDefaults, factors: RANKING_FACTORS, rankingTypes: RANKING_TYPES, services: DIRECTORY_SERVICES.map(({ slug, name }) => ({ slug, name })), history, updatedAt };
}

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
      const place = await locationFromSlugs(req.query.state, req.query.city || undefined);
      if (!place) return res.status(400).json({ message: "Choose a valid state (and city)." });
      const service = req.query.service ? serviceBySlug.get(String(req.query.service)) ?? null : null;
      const limit = Number(req.query.limit) === 50 ? 50 : 10;
      const ranking = await rankProviders({ state: place.state, city: place.city, service, limit });
      const { settings } = await rankingConfigWithHistory();
      const excludedKeys = new Set(settings.exclusions.map((item) => `${item.providerType}:${item.listingId}`));
      const excluded = (await rankingEntries()).filter((entry) => excludedKeys.has(entry.key) && entry.stateCode === place.state.code)
        .map((entry) => ({ providerType: entry.providerType, listingId: entry.listingId, name: entry.name, city: entry.city, ...scoreEntry(entry, { stateCode: place.state.code, citySlug: place.city?.slug ?? null }, settings) }));
      const shape = (item) => ({ position: item.position, providerType: item.entry.providerType, listingId: item.entry.listingId, name: item.entry.name, city: item.entry.city, url: item.entry.url, verified: item.entry.verified, premium: Boolean(item.entry.premium), rating: Math.round(item.ratingAverage * 10) / 10, reviews: item.ratingCount, completedJobs: item.entry.completedJobs, score: item.score, breakdown: item.breakdown, newBusinessPenalty: item.newBusinessPenalty });
      res.json({ data: { location: { state: place.state.name, city: place.city?.name ?? null }, items: ranking.items.map(shape), sponsored: ranking.sponsored.map(shape), qualifying: ranking.qualifying, seo: ranking.seo, excluded } });
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
