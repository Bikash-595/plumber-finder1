import { offersService } from "../config/directoryServices.js";
import { RANKING_FACTORS } from "../config/rankingDefaults.js";
import { inCity, servesCity } from "./locations.js";
import { rankingEntries, rankingIndexVersion } from "./rankingIndex.js";
import { rankingConfig, rankingConfigVersion } from "./rankingConfig.js";

// Ranks real providers for a place (and optionally a service). Every factor is a 0–1 score:
//   rating       reviews from Plumber Finder customers plus the Google rating (kept as separate sources, so nothing is
//                counted twice), as a Bayesian average: few reviews are pulled towards a neutral 3.0, so one 5-star
//                review doesn't beat fifty 4.8-star ones
//   verified     1 for an approved company / a freelancer whose documents were verified
//   jobs         completed bookings on Plumber Finder (log scale up to `jobsForFullScore`), less the share disputed
//   relevance    1 when based in the city (or no city asked), 0.7 when the city is only in their service areas
//   completeness the share of profile basics filled in (logo, cover, description, phone, website, 3+ services, hours, photos, city)
//   engagement   profile views and contact clicks in the last 90 days (log scale up to `engagementForFullScore`)
// score = Σ weight × factor / Σ weights × 100, less up to `newBusinessPenalty` for providers younger than `newBusinessDays`.
// Paid (premium) listings never get organic positions for money: they appear in a separate, labelled Sponsored box.

const NEUTRAL_RATING = 3;
const clamp = (value) => Math.max(0, Math.min(1, value));
const logScore = (value, full) => clamp(Math.log10(1 + Math.max(0, value)) / Math.log10(1 + Math.max(1, full)));
const round = (value, digits = 1) => Math.round(value * 10 ** digits) / 10 ** digits;

/** The combined rating shown and ranked: Plumber Finder reviews + Google rating, weighted by their counts. */
export function combinedRating(entry) {
  const googleCount = entry.google?.count ?? 0;
  const count = entry.reviewCount + googleCount;
  const sum = entry.rating * entry.reviewCount + (entry.google?.rating ?? 0) * googleCount;
  return { average: count ? sum / count : 0, count };
}

/** One provider's score and the explanation of it. */
export function scoreEntry(entry, context, config) {
  const { average, count } = combinedRating(entry);
  const confidence = config.ratingConfidenceReviews;
  const bayes = (NEUTRAL_RATING * confidence + average * count) / (confidence + count);
  const satisfaction = entry.completedJobs ? clamp((entry.completedJobs - entry.disputedJobs) / entry.completedJobs) : 1;
  const factors = {
    rating: clamp((bayes - 1) / 4),
    verified: entry.verified ? 1 : 0,
    jobs: logScore(entry.completedJobs, config.jobsForFullScore) * satisfaction,
    relevance: context.citySlug ? (inCity(entry, context.stateCode, context.citySlug) ? 1 : 0.7) : 1,
    completeness: entry.completeness,
    engagement: logScore(entry.engagement, config.engagementForFullScore),
  };
  const totalWeight = RANKING_FACTORS.reduce((sum, factor) => sum + (config.weights[factor.key] ?? 0), 0) || 1;
  let score = RANKING_FACTORS.reduce((sum, factor) => sum + (config.weights[factor.key] ?? 0) * factors[factor.key], 0) / totalWeight * 100;
  const ageDays = entry.joinedAt ? (Date.now() - new Date(entry.joinedAt).getTime()) / 86_400_000 : config.newBusinessDays;
  const newPenalty = ageDays < config.newBusinessDays ? config.newBusinessPenalty * (1 - ageDays / config.newBusinessDays) : 0;
  score *= 1 - newPenalty;
  return {
    score: round(score),
    breakdown: RANKING_FACTORS.map((factor) => ({ key: factor.key, label: factor.label, weight: config.weights[factor.key] ?? 0, value: round(factors[factor.key], 2), points: round((config.weights[factor.key] ?? 0) * factors[factor.key] / totalWeight * 100) })),
    newBusinessPenalty: newPenalty ? round(newPenalty * 100) : 0,
  };
}

/** Keys that identify the same business listed twice: phone number, website, name + city. */
function duplicateKeys(entry) {
  const keys = [`name:${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}|${entry.stateCode}|${entry.citySlug ?? ""}`];
  const phone = String(entry.phone ?? "").replace(/\D/g, "").slice(-10);
  if (phone.length === 10) keys.push(`phone:${phone}`);
  try {
    const host = entry.website ? new URL(entry.website).hostname.replace(/^www\./, "") : "";
    if (host && !/(facebook|instagram|yelp|google|linkedin|x|twitter|youtube|tiktok|nextdoor|angi|thumbtack|homeadvisor)\.com$/.test(host)) keys.push(`web:${host}`);
  } catch { /* not a URL */ }
  return keys;
}

const sorters = {
  "top-rated": (a, b) => b.score - a.score || b.ratingCount - a.ratingCount,
  "most-reviewed": (a, b) => b.ratingCount - a.ratingCount || b.score - a.score,
  "most-popular": (a, b) => b.entry.engagement - a.entry.engagement || b.score - a.score,
  verified: (a, b) => b.score - a.score || b.ratingCount - a.ratingCount,
  "recently-recommended": (a, b) => b.entry.recentPositive - a.entry.recentPositive || b.score - a.score,
};

const resultCache = new Map();
const RESULT_TTL_MS = 60_000;

/**
 * The ranking for one page: up to `limit` real providers (never padded), duplicates removed, suspended/rejected/
 * excluded ones left out. Also returns the Sponsored box, counts and whether search engines should index the page.
 */
export async function rankProviders({ state, city = null, service = null, limit = 10, type = "top-rated", verifiedOnly = false }) {
  const config = await rankingConfig();
  const cacheKey = [state.code, city?.slug, service?.slug, limit, type, verifiedOnly, rankingIndexVersion(), rankingConfigVersion()].join("|");
  const cached = resultCache.get(cacheKey);
  if (cached && Date.now() - cached.at < RESULT_TTL_MS) return cached.result;

  const excluded = new Set(config.exclusions.map((item) => `${item.providerType}:${item.listingId}`));
  const context = { stateCode: state.code, citySlug: city?.slug ?? null };
  const onlyVerified = verifiedOnly || type === "verified";
  const candidates = (await rankingEntries()).filter((entry) => !entry.blocked && !excluded.has(entry.key)
    && entry.stateCode === state.code
    && (!city || inCity(entry, state.code, city.slug) || servesCity(entry, state.code, city.slug))
    && offersService(entry, service)
    && (!onlyVerified || entry.verified)
    && (type !== "recently-recommended" || entry.recentPositive > 0));

  const scored = candidates.map((entry) => {
    const { average, count } = combinedRating(entry);
    return { entry, ...scoreEntry(entry, context, config), ratingAverage: average, ratingCount: count };
  }).sort(sorters[type] ?? sorters["top-rated"]);

  // The same business listed twice keeps only its best-scoring listing.
  const seen = new Set();
  const unique = scored.filter((item) => {
    const keys = duplicateKeys(item.entry);
    if (keys.some((key) => seen.has(key))) return false;
    keys.forEach((key) => seen.add(key));
    return true;
  });

  const sponsored = unique.filter((item) => item.entry.premium).sort((a, b) => b.entry.premium.rank - a.entry.premium.rank || b.score - a.score).slice(0, config.sponsoredSlots);
  const items = unique.slice(0, limit).map((item, index) => ({ position: index + 1, ...item }));
  const qualifying = unique.length;
  const result = {
    items, sponsored, qualifying,
    // Indexable only with enough real providers; a Top 50 page with no more than 10 would repeat the Top 10 page.
    seo: { minimumQualifyingCompanies: config.minimumQualifyingCompanies, isIndexable: qualifying >= config.minimumQualifyingCompanies && (limit <= 10 || qualifying > 10), duplicateOfTop10: limit > 10 && qualifying <= 10 },
  };
  resultCache.set(cacheKey, { at: Date.now(), result });
  if (resultCache.size > 2000) resultCache.delete(resultCache.keys().next().value);
  return result;
}

/** Test helper. */
export const clearRankingResults = () => resultCache.clear();
