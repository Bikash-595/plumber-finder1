import { stateByCode } from "../config/usStates.js";
import { serviceBySlug } from "../config/directoryServices.js";
import { SearchLog } from "../models/SearchLog.js";
import { parseSearch } from "../services/intentParser.js";
import { searchProviders, searchShape } from "../services/providerSearch.js";
import { rankingConfig } from "../services/rankingConfig.js";
import { rankProviders } from "../services/rankingEngine.js";
import { searchSuggestions } from "../services/suggestions.js";

const MAX_QUERY = 200;
const queryOf = (req) => (typeof req.query.q === "string" ? req.query.q.slice(0, MAX_QUERY) : "");

/**
 * GET /api/search?q=…&log=1 — what a search means and the page it should open ({ intent, url, location, … }),
 * with how many real providers that page has. `log=1` (the site's search box) records it for Search analytics.
 */
export async function search(req, res, next) {
  try {
    const q = queryOf(req);
    const config = await rankingConfig();
    let result = await parseSearch(q, { defaultLimit: config.defaultResultLimit });
    // A company's name ("Bayou Drain Pros"), or a service with other words ("drain cleaning houston"), opens the
    // search results (every word counts) rather than the general service page.
    if (result.intent === "service") {
      const shape = await searchShape(q);
      if (shape.nameHit || shape.otherWords.length) result = { ...result, intent: "keyword", url: `/find?search=${encodeURIComponent(q.trim())}` };
    }
    let results = null;
    if ((result.location?.stateCode || result.location?.country) && (result.intent === "ranking" || result.intent === "service-location")) {
      const state = result.location.stateCode ? stateByCode.get(result.location.stateCode) : null;
      const ranking = await rankProviders({ state, city: result.location.citySlug ? { slug: result.location.citySlug, name: result.location.city } : null, service: result.service ? serviceBySlug.get(result.service) : null, limit: result.rankingLimit, type: result.rankingType });
      results = Math.min(ranking.qualifying, result.rankingLimit);
    }
    if (req.query.log === "1" && q.trim()) {
      SearchLog.create({ q: q.trim().toLowerCase(), intent: result.intent, service: result.service ?? undefined, stateCode: result.location?.stateCode, city: result.location?.city, limit: result.rankingLimit, results: results ?? undefined }).catch(() => undefined);
    }
    res.json({ data: { ...result, results } });
  } catch (error) { next(error); }
}

/** GET /api/search/suggestions?q=… — up to 8 suggestions [{ kind, label, url, hint? }]. */
export async function suggestions(req, res, next) {
  try {
    res.set("Cache-Control", "public, max-age=60");
    res.json({ data: await searchSuggestions(queryOf(req)) });
  } catch (error) { next(error); }
}

const flag = (value) => value === "1" || value === "true";

/**
 * GET /api/search/providers?q=…&sort=relevance|rating|reviews|name&service=&state=&verified=1&emergency=1&minRating=4&limit=
 * Profiles matching the search (typo and prefix tolerant, best first), a corrected query when it was misspelled,
 * related profiles when few match, and counts for the filters.
 */
export async function providers(req, res, next) {
  try {
    const text = (key) => (typeof req.query[key] === "string" ? req.query[key].slice(0, 60) : undefined);
    const minRating = Number(req.query.minRating);
    const limit = Number(req.query.limit);
    res.set("Cache-Control", "public, max-age=30");
    res.json({ data: await searchProviders({
      q: queryOf(req), sort: text("sort"), service: text("service"), state: text("state"),
      verified: flag(req.query.verified), emergency: flag(req.query.emergency),
      minRating: Number.isFinite(minRating) && minRating > 0 ? Math.min(5, minRating) : undefined,
      limit: Number.isInteger(limit) && limit > 0 ? limit : undefined,
    }) });
  } catch (error) { next(error); }
}
