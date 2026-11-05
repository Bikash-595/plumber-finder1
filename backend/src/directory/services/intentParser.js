import { DIRECTORY_SERVICES, serviceByUrlNoun } from "../config/directoryServices.js";
import { RANKING_LIMITS } from "../config/rankingDefaults.js";
import { resolveLocation } from "./locations.js";

// What a search means and where it should go. Each kind of result has one URL, and plain listings reuse the
// pages the site already has, so no duplicate pages are made:
//   "Top 10 plumbers in New York"        → ranking   /top-10-plumbers/new-york
//   "Best emergency plumbers in Texas"   → ranking   /top-10-emergency-plumbers/texas (the default number)
//   "Top 10 licensed plumbers in LA"     → ranking   /top-10-licensed-plumbers/california/los-angeles (verified only)
//   "Plumbers in Brooklyn, NY"           → location  /states/new-york?city=Brooklyn (existing state page)
//   "Drain cleaning"                     → service   /services/drain-cleaning (existing service page)
//   "Best plumbers near me"              → nearby    /find?near=1
//   anything else (a company name, ...)  → keyword   /find?search=...

const PLUMBING = /\b(plumb\w*|contractors?|companies|company|pros?|services?|technicians?|repair|installers?)\b/;
const RANKING_WORDS = /\b(best|top|top[- ]rated|highest[- ]rated|leading|recommended|trusted|most reviewed|popular)\b/;
const NEAR_ME = /\b(near me|nearby|close to me|around me|my area)\b/;
const VERIFIED_WORDS = /\b(licensed|verified|certified|insured|bonded)\b/;
const FILLER = /\b(the|best|top|\d{1,3}|top[- ]rated|highest[- ]rated|rated|leading|recommended|trusted|most|reviewed|popular|good|cheap|affordable|local|licensed|verified|certified|insured|bonded|plumbers?|plumbing|plumbs?|contractors?|companies|company|services?|pros?|technicians?|repair|repairs|experts?|specialists?|for|a|an|of|and|find|me|my)\b/g;

const normalize = (q) => String(q ?? "").toLowerCase().replace(/[“”"']/g, "").replace(/\s+/g, " ").trim();

/** The service a search mentions (longest keyword wins: "water heater" over "heater"). */
export function findService(text) {
  let best = null;
  for (const service of DIRECTORY_SERVICES) for (const keyword of service.keywords) {
    if (new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}\\b`).test(text) && (!best || keyword.length > best.keyword.length)) best = { service, keyword };
  }
  return best;
}

/** "top 10" → 10, "top 50" → 50, "top 25" → 50 (pages exist for 10 and 50); null when no number is asked for. */
function requestedLimit(text) {
  const match = /\btop[\s-]*(\d{1,3})\b/.exec(text) ?? /\b(\d{1,3})\s+best\b/.exec(text);
  if (!match) return null;
  const n = Number(match[1]);
  return { requested: n, limit: RANKING_LIMITS.find((limit) => n <= limit) ?? RANKING_LIMITS.at(-1) };
}

function rankingType(text) {
  if (/\bmost reviewed\b/.test(text)) return "most-reviewed";
  if (/\b(most )?popular\b/.test(text)) return "most-popular";
  if (VERIFIED_WORDS.test(text)) return "verified";
  if (/\brecommended\b/.test(text)) return "recently-recommended";
  return "top-rated";
}

/**
 * The text that names the place: after " in " / " near " / " around " (`explicit`), else what's left once plumbing
 * words are removed ("austin plumbers" → "austin"), which only counts if it really is a place.
 */
function locationText(text) {
  const marker = /\b(?:in|near|around|at)\s+(.+)$/.exec(text);
  if (marker && !NEAR_ME.test(marker[0])) return { text: marker[1].trim(), explicit: true };
  const rest = text.replace(FILLER, " ").replace(new RegExp(DIRECTORY_SERVICES.flatMap((s) => s.keywords).sort((a, b) => b.length - a.length).map((k) => `\\b${k.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}\\b`).join("|"), "g"), " ").replace(/\s+/g, " ").trim();
  return rest ? { text: rest, explicit: false } : null;
}

/** The URL noun of a ranking page: "plumbers", "licensed-plumbers" or a service's ("drain-cleaning-companies"). */
export const rankingNoun = (service, type) => (service ? service.urlNoun : type === "verified" ? "licensed-plumbers" : "plumbers");

/** "/top-10-plumbers/new-york/brooklyn" for a ranking page. */
export const rankingPath = ({ limit, service, type, state, city }) => `/top-${limit}-${rankingNoun(service, type)}/${state.slug}${city ? `/${city.slug}` : ""}`;

/** Ranking URL noun → { service, verifiedOnly } or null when it isn't one. */
export function parseRankingNoun(noun) {
  if (noun === "plumbers") return { service: null, verifiedOnly: false };
  if (noun === "licensed-plumbers") return { service: null, verifiedOnly: true };
  const service = serviceByUrlNoun.get(noun);
  return service ? { service, verifiedOnly: false } : null;
}

/** Parses a search and decides where it goes. `defaultLimit` is used when "best ..." doesn't ask for a number. */
export async function parseSearch(query, { defaultLimit = 10 } = {}) {
  const q = normalize(query);
  const empty = { q, intent: "keyword", url: q ? `/find?search=${encodeURIComponent(String(query).trim())}` : "/find" };
  if (!q) return empty;
  const service = findService(q)?.service ?? null;
  const plumbing = PLUMBING.test(q) || Boolean(service);
  const limit = requestedLimit(q);
  const ranking = Boolean(limit) || RANKING_WORDS.test(q) || VERIFIED_WORDS.test(q);
  const type = rankingType(q);

  if (NEAR_ME.test(q)) return { q, intent: "nearby", category: service?.slug ?? "plumbing", service: service?.slug ?? null, location: "user-location", url: `/find?near=1${service ? `&search=${encodeURIComponent(service.name)}` : ""}` };

  const placeText = locationText(q);
  const found = placeText ? await resolveLocation(placeText.text) : null;
  if (placeText?.explicit && (!found || found.unknownCity)) {
    // "... in <a place we don't know>": search the directory for the words instead.
    if (plumbing) return { ...empty, intent: "unknown-location", service: service?.slug ?? null, locationText: placeText.text };
    return empty;
  }
  // Leftover words that aren't a place (a company name, "cleaning") are not a location.
  const place = found && !found.unknownCity ? found : null;
  if (!place) {
    if (service) return { q, intent: "service", category: service.slug, service: service.slug, url: `/services/${service.slug}` };
    return empty;
  }
  if (!plumbing && !ranking) return empty;

  const location = { state: place.state.name, stateCode: place.state.code, stateSlug: place.state.slug, ...(place.city ? { city: place.city.name, citySlug: place.city.slug } : {}), ...(place.zip ? { zip: place.zip } : {}) };
  const alternatives = (place.alternatives ?? []).map((alt) => ({ city: alt.city.name, stateCode: alt.state.code, url: rankingPath({ limit: limit?.limit ?? defaultLimit, service, type, state: alt.state, city: alt.city }) }));
  if (ranking || service) {
    const pageLimit = limit?.limit ?? defaultLimit;
    return {
      q, intent: limit ? "ranking" : service ? "service-location" : "ranking", category: service?.slug ?? "plumbing", service: service?.slug ?? null,
      location, rankingLimit: pageLimit, ...(limit && limit.requested !== pageLimit ? { requestedLimit: limit.requested } : {}), rankingType: type,
      url: rankingPath({ limit: pageLimit, service, type, state: place.state, city: place.city }), alternatives,
    };
  }
  // "Plumbers in X": the existing state page (with the city filter).
  return { q, intent: "location", category: "plumbing", location, url: `/states/${place.state.slug}${place.city ? `?city=${encodeURIComponent(place.city.name)}` : ""}`, alternatives };
}
