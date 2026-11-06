import { DIRECTORY_SERVICES, offersService } from "../config/directoryServices.js";
import { RANKING_LIMITS, RANKING_TYPES } from "../config/rankingDefaults.js";
import { US_STATES, stateBySlug } from "../config/usStates.js";
import { placeLookup } from "../../location/services/placeLookup.js";
import { parseRankingNoun, rankingNoun, rankingPath } from "../services/intentParser.js";
import { sitemapPages } from "../services/landingPages.js";
import { canonicalCitySlug, citiesByState, inCity, locationFromSlugs } from "../services/locations.js";
import { pageSettings } from "../services/pageSettings.js";
import { rankingConfig } from "../services/rankingConfig.js";
import { hasActivePremium, inArea, rankable, rankProviders } from "../services/rankingEngine.js";
import { rankingEntries, slugify } from "../services/rankingIndex.js";

const round1 = (value) => Math.round(value * 10) / 10;

/** What a ranked provider shows publicly (never internal fields such as the account id). */
function publicItem({ position, entry, score, breakdown, newBusinessPenalty, ratingAverage, ratingCount, placement }) {
  return {
    ...(position ? { position } : {}),
    providerType: entry.providerType, listingId: entry.listingId, name: entry.name, url: entry.url, logo: entry.logo,
    address: entry.address, city: entry.city, stateCode: entry.stateCode, phone: entry.phone, website: entry.website,
    description: entry.description, services: entry.services.slice(0, 8), verified: entry.verified, isEmergency: entry.isEmergency,
    rating: { average: round1(ratingAverage), count: ratingCount, platform: { average: entry.rating, count: entry.reviewCount }, google: entry.google },
    completedJobs: entry.completedJobs, weeklyHours: entry.weeklyHours, coordinates: entry.coordinates,
    score, breakdown, newBusinessPenalty, ...(entry.premium ? { premiumTier: entry.premium.tier } : {}),
    ...(placement ? { placement: placement.kind } : {}),
  };
}

/** Miles between two points (haversine). */
function miles(a, b) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

const centres = new Map();
/** A city's centre: the location service (answer cached, waits at most 1.5 s), else the middle of its listings. */
async function cityCentre(state, city, items) {
  const key = `${state.code}/${city.slug}`;
  if (!centres.has(key)) {
    const found = await Promise.race([placeLookup.city(city.name, state.code).catch(() => null), new Promise((resolve) => setTimeout(() => resolve(undefined), 1500))]);
    if (found !== undefined) centres.set(key, found && Number.isFinite(found.latitude) ? { lat: found.latitude, lng: found.longitude } : null);
    if (centres.size > 5000) centres.delete(centres.keys().next().value);
  }
  const known = centres.get(key);
  if (known) return known;
  const points = items.filter((item) => item.coordinates && inCity({ stateCode: item.stateCode, citySlug: slugify(item.city) }, state.code, city.slug)).map((item) => item.coordinates);
  const all = points.length ? points : items.filter((item) => item.coordinates).map((item) => item.coordinates);
  return all.length ? { lat: all.reduce((sum, p) => sum + p.lat, 0) / all.length, lng: all.reduce((sum, p) => sum + p.lng, 0) / all.length } : null;
}

/** "{limit} {noun} in {place}" patterns from the admin's page templates. */
const fill = (pattern, values) => (pattern ? pattern.replace(/\{(limit|noun|place|state|city|count)\}/g, (_, key) => String(values[key] ?? "")).replace(/\s+/g, " ").trim() : null);

/**
 * GET /api/directory/rankings/:limit/:noun/:state/:city? — one Top 10 / Top 50 page. `:state` "usa" = the whole
 * country (no city). :limit 10 | 50 · :noun plumbers | licensed-plumbers | <service>-companies… · ?sort=top-rated|…
 * 404 for an unknown number, noun, state or city, and for pages an admin unpublished.
 */
export async function getRankingPage(req, res, next) {
  try {
    const limit = Number(req.params.limit);
    const noun = parseRankingNoun(String(req.params.noun));
    const usa = String(req.params.state).toLowerCase() === "usa" && !req.params.city;
    const place = noun && RANKING_LIMITS.includes(limit) ? (usa ? { state: null, city: null } : await locationFromSlugs(req.params.state, req.params.city)) : null;
    if (!place) return res.status(404).json({ message: "There is no such directory page." });
    const type = RANKING_TYPES.some((item) => item.key === req.query.sort) ? req.query.sort : noun.verifiedOnly ? "verified" : "top-rated";
    const { state, city } = place;
    const scope = !state ? "usa" : city ? "city" : "state";
    const pathType = noun.verifiedOnly ? "verified" : "top-rated";
    const path = rankingPath({ limit, service: noun.service, type: pathType, state, city });
    const settings = await pageSettings(path, state?.code ?? null, city?.slug ?? null);
    if (!settings.published) return res.status(404).json({ message: "There is no such directory page." });

    const [ranking, entries, config] = await Promise.all([
      rankProviders({ state, city, service: noun.service, limit, type, verifiedOnly: noun.verifiedOnly }),
      rankingEntries(),
      rankingConfig(),
    ]);
    // Premium providers who could be ranked here (for the filter counts, coverage and nearby places).
    const allowed = rankable(config);
    const premium = entries.filter((entry) => allowed(entry) && hasActivePremium(entry) && (!noun.verifiedOnly || entry.verified));
    const ofService = premium.filter((entry) => offersService(entry, noun.service));
    const cities = state ? [...(await citiesByState()).get(state.code).values()] : [];
    const premiumInCity = (slug) => ofService.filter((entry) => inArea(entry, state, { slug })).length;

    let ranked = ranking.items.map(publicItem);
    let centre = null;
    if (city) {
      centre = await cityCentre(state, city, ranked);
      if (centre) ranked = ranked.map((item) => (item.coordinates ? { ...item, distanceMiles: round1(miles(centre, item.coordinates)) } : item));
    }
    const rated = ranked.filter((item) => item.rating.count > 0);
    const nounText = noun.service?.noun ?? (noun.verifiedOnly ? "Licensed Plumbers" : "Plumbers");
    const placeText = !state ? "the USA" : city ? `${city.name}, ${state.code}` : state.name;
    const template = config.templates[scope];
    const values = { limit, noun: nounText, place: placeText, state: state?.name ?? "USA", city: city?.name ?? "", count: Math.min(ranking.qualifying, limit) };

    res.json({
      data: {
        page: {
          scope, limit, noun: rankingNoun(noun.service, noun.verifiedOnly ? "verified" : type), type, verifiedOnly: noun.verifiedOnly,
          state: state ? { code: state.code, name: state.name, slug: state.slug } : null,
          city: city ? { name: city.name, slug: city.slug } : null,
          service: noun.service ? { slug: noun.service.slug, name: noun.service.name, noun: noun.service.noun } : null,
          path,
          top10Path: rankingPath({ limit: 10, service: noun.service, type: pathType, state, city }),
          allPath: !state ? "/find" : `/states/${state.slug}${city ? `?city=${encodeURIComponent(city.name)}` : ""}`,
        },
        items: ranked,
        sponsored: ranking.sponsored.map(publicItem),
        qualifying: ranking.qualifying,
        verifiedQualifying: ranking.verifiedCount,
        otherProviders: ranking.otherProviders,
        stats: {
          averageRating: rated.length ? round1(rated.reduce((sum, item) => sum + item.rating.average, 0) / rated.length) : null,
          verified: ranked.filter((item) => item.verified).length,
          emergency: ranked.filter((item) => item.isEmergency).length,
          reviews: ranked.reduce((sum, item) => sum + item.rating.count, 0),
          states: new Set(ranked.map((item) => item.stateCode)).size,
        },
        seo: { ...ranking.seo, isIndexable: ranking.seo.isIndexable && settings.published },
        // The admin's wording: this page's own, else the page design's pattern; null = the site's built-in text.
        text: {
          title: settings.title ?? fill(template.title, values),
          description: settings.description ?? fill(template.description, values),
          intro: settings.intro,
        },
        sections: { map: template.showMap, faq: template.showFaq },
        rankingTypes: RANKING_TYPES,
        // USA pages: premium providers per state (the state filter and coverage map).
        coverage: !state ? US_STATES.map((item) => ({ code: item.code, name: item.name, slug: item.slug, premium: ofService.filter((entry) => entry.stateCode === item.code).length })).filter((item) => item.premium > 0).sort((a, b) => b.premium - a.premium || a.name.localeCompare(b.name)) : [],
        // State and city pages: other cities in the state, those with premium providers first.
        nearby: cities.filter((item) => item.slug !== city?.slug)
          .map((item) => ({ name: item.name, slug: canonicalCitySlug(state.code, item.slug), providers: premiumInCity(item.slug), major: item.major }))
          .sort((a, b) => b.providers - a.providers || Number(b.major) - Number(a.major) || a.name.localeCompare(b.name)).slice(0, 16)
          .map(({ major: _major, ...item }) => item),
        relatedServices: DIRECTORY_SERVICES.map((service) => ({
          slug: service.slug, name: service.name, noun: service.noun, urlNoun: service.urlNoun,
          providers: premium.filter((entry) => inArea(entry, state, city) && offersService(entry, service)).length,
        })).filter((item) => item.providers > 0 && item.slug !== noun.service?.slug).sort((a, b) => b.providers - a.providers),
        ...(centre ? { centre } : {}),
      },
    });
  } catch (error) { next(error); }
}

/**
 * GET /api/directory/sitemap?scope=usa|state|city — the ranking pages worth indexing (published, with enough real
 * premium providers): Top 10, and Top 50 when it has more than 10.
 */
export async function getDirectorySitemap(req, res, next) {
  try {
    const scope = ["usa", "state", "city"].includes(req.query.scope) ? req.query.scope : undefined;
    const pages = await sitemapPages(scope);
    res.set("Cache-Control", "public, max-age=300");
    res.json({ data: pages.map((page) => ({ path: page.path, providers: page.qualifying, scope: page.scope })) });
  } catch (error) { next(error); }
}

/** GET /api/location/states — every state with how many providers are listed there. */
export async function listStates(_req, res, next) {
  try {
    const entries = await rankingEntries();
    const counts = new Map();
    for (const entry of entries) if (entry.stateCode && !entry.blocked) counts.set(entry.stateCode, (counts.get(entry.stateCode) ?? 0) + 1);
    res.json({ data: US_STATES.map((state) => ({ ...state, providers: counts.get(state.code) ?? 0 })) });
  } catch (error) { next(error); }
}

/** GET /api/location/states/:state/cities — the state's major cities and every city providers are in. */
export async function listCities(req, res, next) {
  try {
    const state = stateBySlug.get(String(req.params.state).toLowerCase());
    if (!state) return res.status(404).json({ message: "Unknown state." });
    const cities = [...(await citiesByState()).get(state.code).values()].sort((a, b) => b.providers - a.providers || a.name.localeCompare(b.name));
    res.json({ data: cities.map(({ name, slug, providers, major }) => ({ name, slug: canonicalCitySlug(state.code, slug), providers, major })) });
  } catch (error) { next(error); }
}
