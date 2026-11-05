import { placeLookup } from "../../location/services/placeLookup.js";
import { CITY_ALIASES, MAJOR_CITIES } from "../config/usCities.js";
import { US_STATES, findState, stateByCode, stateBySlug } from "../config/usStates.js";
import { rankingEntries, slugify } from "./rankingIndex.js";

// States and cities for directory pages and search: the major cities of every state (usCities.js) plus every city
// a published provider is in. Cities are identified by state + slug ("ny" + "brooklyn").

/** Cities by state code: Map<slug, { name, slug, providers }> including listing cities. */
export async function citiesByState() {
  const entries = await rankingEntries();
  const result = new Map(US_STATES.map((state) => [state.code, new Map()]));
  for (const [code, names] of Object.entries(MAJOR_CITIES)) for (const name of names) result.get(code).set(slugify(name), { name, slug: slugify(name), providers: 0, major: true });
  for (const entry of entries) {
    if (!entry.stateCode || !entry.citySlug) continue;
    const cities = result.get(entry.stateCode);
    const slug = canonicalCitySlug(entry.stateCode, entry.citySlug);
    const city = cities.get(slug) ?? { name: titleCase(entry.city), slug, providers: 0, major: false };
    city.providers += 1;
    cities.set(slug, city);
  }
  return result;
}

const titleCase = (value) => String(value ?? "").trim().replace(/\s+/g, " ").replace(/\b([a-z])/g, (char) => char.toUpperCase());

/** "new-york" in NY is the same city as "new-york-city"; aliases map to the major city's slug. */
export function canonicalCitySlug(stateCode, slug) {
  for (const [name, aliases] of Object.entries(CITY_ALIASES[stateCode] ?? {})) if (aliases.some((alias) => slugify(alias) === slug)) return slugify(name);
  return slug;
}

/** True when a provider is in (or serves) the given city. Aliases count ("New York" listings are in New York City). */
export const inCity = (entry, stateCode, citySlug) => entry.stateCode === stateCode && entry.citySlug && canonicalCitySlug(stateCode, entry.citySlug) === citySlug;
export const servesCity = (entry, stateCode, citySlug) => entry.stateCode === stateCode && entry.serviceAreaSlugs.some((slug) => canonicalCitySlug(stateCode, slug) === citySlug);

/** A state and optional city from URL slugs, or null when either doesn't exist. */
export async function locationFromSlugs(stateSlug, citySlug) {
  const state = stateBySlug.get(String(stateSlug ?? "").toLowerCase());
  if (!state) return null;
  if (!citySlug) return { state, city: null };
  const cities = (await citiesByState()).get(state.code);
  const city = cities.get(canonicalCitySlug(state.code, String(citySlug).toLowerCase()));
  return city ? { state, city } : null;
}

/**
 * Free text → { state, city } or null. Understands "Texas", "TX", "Brooklyn", "Brooklyn, NY", "Austin Texas",
 * "NYC", ZIP codes ("78701"). A plain "New York" is the state; "New York City", "NYC" or "New York, NY" is the city.
 * A city name used in several states picks the one with the most providers (then the largest), and lists the others.
 */
export async function resolveLocation(text) {
  const raw = String(text ?? "").trim().replace(/[.?!]+$/, "").replace(/,?\s*(usa|us|united states)$/i, "").trim();
  if (!raw) return null;
  if (/^\d{5}$/.test(raw)) {
    const place = await placeLookup.zip(raw).catch(() => null);
    const state = place && findState(place.stateCode);
    if (!state) return null;
    const cities = (await citiesByState()).get(state.code);
    const slug = canonicalCitySlug(state.code, slugify(place.city));
    return { state, city: cities.get(slug) ?? { name: place.city, slug, providers: 0, major: false }, zip: raw };
  }
  const cities = await citiesByState();
  const findCity = (code, name) => cities.get(code)?.get(canonicalCitySlug(code, slugify(name))) ?? null;

  // "City, ST" / "City, State" / "City ST" / "City State"
  const comma = raw.split(",").map((part) => part.trim()).filter(Boolean);
  if (comma.length >= 2) {
    const state = findState(comma.at(-1));
    if (state) return { state, city: findCity(state.code, comma.slice(0, -1).join(" ")) ?? null, unknownCity: findCity(state.code, comma.slice(0, -1).join(" ")) ? undefined : comma.slice(0, -1).join(", ") };
  }
  const whole = findState(raw);
  if (whole) return { state: whole, city: null };
  const words = raw.split(/\s+/);
  for (let cut = 1; cut <= Math.min(3, words.length - 1); cut++) {
    const state = findState(words.slice(-cut).join(" "));
    if (state) {
      const city = findCity(state.code, words.slice(0, -cut).join(" "));
      if (city) return { state, city };
    }
  }
  // A city on its own: every state that has it.
  const slug = slugify(raw);
  const matches = [];
  for (const [code, list] of cities) {
    const city = list.get(canonicalCitySlug(code, slug));
    if (city) matches.push({ state: stateByCode.get(code), city });
  }
  if (!matches.length) return null;
  const order = (match) => [match.city.providers, match.city.major ? MAJOR_CITIES[match.state.code].length - MAJOR_CITIES[match.state.code].indexOf(match.city.name) : 0];
  matches.sort((a, b) => order(b)[0] - order(a)[0] || order(b)[1] - order(a)[1]);
  return { ...matches[0], alternatives: matches.slice(1, 4) };
}
