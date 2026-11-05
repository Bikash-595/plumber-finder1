import { DIRECTORY_SERVICES, offersService } from "../config/directoryServices.js";
import { RANKING_LIMITS, RANKING_TYPES } from "../config/rankingDefaults.js";
import { US_STATES, stateBySlug } from "../config/usStates.js";
import { parseRankingNoun, rankingNoun, rankingPath } from "../services/intentParser.js";
import { canonicalCitySlug, citiesByState, inCity, locationFromSlugs, servesCity } from "../services/locations.js";
import { rankProviders } from "../services/rankingEngine.js";
import { rankingEntries } from "../services/rankingIndex.js";

const round1 = (value) => Math.round(value * 10) / 10;

/** What a ranked provider shows publicly (never internal fields such as the account id). */
function publicItem({ position, entry, score, breakdown, newBusinessPenalty, ratingAverage, ratingCount }) {
  return {
    ...(position ? { position } : {}),
    providerType: entry.providerType, listingId: entry.listingId, name: entry.name, url: entry.url, logo: entry.logo,
    address: entry.address, city: entry.city, stateCode: entry.stateCode, phone: entry.phone, website: entry.website,
    description: entry.description, services: entry.services.slice(0, 8), verified: entry.verified, isEmergency: entry.isEmergency,
    rating: { average: round1(ratingAverage), count: ratingCount, platform: { average: entry.rating, count: entry.reviewCount }, google: entry.google },
    completedJobs: entry.completedJobs, weeklyHours: entry.weeklyHours, coordinates: entry.coordinates,
    score, breakdown, newBusinessPenalty, ...(entry.premium ? { premiumTier: entry.premium.tier } : {}),
  };
}

const servicesIn = (entries, state, city) => DIRECTORY_SERVICES.map((service) => ({
  slug: service.slug, name: service.name, noun: service.noun, urlNoun: service.urlNoun,
  providers: entries.filter((entry) => !entry.blocked && entry.stateCode === state.code && (!city || inCity(entry, state.code, city.slug) || servesCity(entry, state.code, city.slug)) && offersService(entry, service)).length,
})).filter((item) => item.providers > 0).sort((a, b) => b.providers - a.providers);

/**
 * GET /api/directory/rankings/:limit/:noun/:state/:city? — one Top 10 / Top 50 page.
 *   :limit 10 | 50 · :noun plumbers | licensed-plumbers | <service>-companies… · ?sort=top-rated|most-reviewed|…
 * 404 for an unknown number, noun, state or city.
 */
export async function getRankingPage(req, res, next) {
  try {
    const limit = Number(req.params.limit);
    const noun = parseRankingNoun(String(req.params.noun));
    const place = noun && RANKING_LIMITS.includes(limit) ? await locationFromSlugs(req.params.state, req.params.city) : null;
    if (!place) return res.status(404).json({ message: "There is no such directory page." });
    const type = RANKING_TYPES.some((item) => item.key === req.query.sort) ? req.query.sort : noun.verifiedOnly ? "verified" : "top-rated";
    const { state, city } = place;
    const ranking = await rankProviders({ state, city, service: noun.service, limit, type, verifiedOnly: noun.verifiedOnly });
    const entries = await rankingEntries();
    const cities = [...(await citiesByState()).get(state.code).values()];

    const ranked = ranking.items.map(publicItem);
    const rated = ranked.filter((item) => item.rating.count > 0);
    res.json({
      data: {
        page: {
          limit, noun: rankingNoun(noun.service, noun.verifiedOnly ? "verified" : type), type, verifiedOnly: noun.verifiedOnly,
          state: { code: state.code, name: state.name, slug: state.slug },
          city: city ? { name: city.name, slug: city.slug } : null,
          service: noun.service ? { slug: noun.service.slug, name: noun.service.name, noun: noun.service.noun } : null,
          path: rankingPath({ limit, service: noun.service, type: noun.verifiedOnly ? "verified" : "top-rated", state, city }),
          top10Path: rankingPath({ limit: 10, service: noun.service, type: noun.verifiedOnly ? "verified" : "top-rated", state, city }),
          allPath: `/states/${state.slug}${city ? `?city=${encodeURIComponent(city.name)}` : ""}`,
        },
        items: ranked,
        sponsored: ranking.sponsored.map(publicItem),
        qualifying: ranking.qualifying,
        stats: {
          averageRating: rated.length ? round1(rated.reduce((sum, item) => sum + item.rating.average, 0) / rated.length) : null,
          verified: ranked.filter((item) => item.verified).length,
          emergency: ranked.filter((item) => item.isEmergency).length,
          reviews: ranked.reduce((sum, item) => sum + item.rating.count, 0),
        },
        seo: ranking.seo,
        rankingTypes: RANKING_TYPES,
        // Other cities in the state that have providers (then major cities), for "Nearby locations".
        nearby: cities.filter((item) => item.slug !== city?.slug).sort((a, b) => b.providers - a.providers || Number(b.major) - Number(a.major)).slice(0, 12).map((item) => ({ name: item.name, slug: item.slug, providers: item.providers })),
        relatedServices: servicesIn(entries, state, city).filter((item) => item.slug !== noun.service?.slug).slice(0, 8),
      },
    });
  } catch (error) { next(error); }
}

/**
 * GET /api/directory/sitemap — the ranking pages worth indexing (enough real providers): every state, city and
 * service+state page that qualifies, Top 10 and (when it has more than 10) Top 50.
 */
export async function getDirectorySitemap(_req, res, next) {
  try {
    const entries = (await rankingEntries()).filter((entry) => !entry.blocked && entry.stateCode);
    const pages = [];
    const consider = async (state, city, service) => {
      const ranking = await rankProviders({ state, city, service, limit: 10 });
      if (!ranking.seo.isIndexable) return;
      pages.push({ path: rankingPath({ limit: 10, service, type: "top-rated", state, city }), providers: ranking.qualifying });
      if (ranking.qualifying > 10) pages.push({ path: rankingPath({ limit: 50, service, type: "top-rated", state, city }), providers: ranking.qualifying });
    };
    const states = US_STATES.filter((state) => entries.some((entry) => entry.stateCode === state.code));
    const cities = await citiesByState();
    for (const state of states) {
      await consider(state, null, null);
      for (const service of DIRECTORY_SERVICES) await consider(state, null, service);
      for (const city of cities.get(state.code).values()) if (city.providers > 0) await consider(state, city, null);
    }
    res.set("Cache-Control", "public, max-age=300");
    res.json({ data: pages });
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
