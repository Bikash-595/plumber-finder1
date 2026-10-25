// Real places for addresses: US ZIP code -> city/state (Zippopotam.us) and coordinates ->
// ZIP/city/state (OpenStreetMap Nominatim). Results are cached; lookups time out after 8 s.
// `placeLookup.zip` / `placeLookup.reverse` can be swapped out by the automated tests.

const cache = new Map();
const CACHE_MS = 24 * 3600_000;
const USER_AGENT = "PlumberFinder/1.0 (https://plumberfinder.com)";

export class LookupUnavailableError extends Error {
  constructor() { super("The location service is not responding. Please try again in a moment."); this.status = 503; this.expose = true; }
}

async function getJson(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;
  let response;
  try {
    response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  } catch {
    throw new LookupUnavailableError();
  }
  if (response.status === 404) { cache.set(url, { value: null, at: Date.now() }); return null; }
  if (!response.ok) throw new LookupUnavailableError();
  const value = await response.json();
  cache.set(url, { value, at: Date.now() });
  if (cache.size > 2000) cache.delete(cache.keys().next().value);
  return value;
}

export const placeLookup = {
  /** "78701" -> { zipCode, city, state, stateCode, latitude, longitude } or null if no such ZIP. */
  async zip(zipCode) {
    const data = await getJson(`https://api.zippopotam.us/us/${encodeURIComponent(zipCode)}`);
    const place = data?.places?.[0];
    if (!place) return null;
    return { zipCode: data["post code"], city: place["place name"], state: place.state, stateCode: place["state abbreviation"], latitude: Number(place.latitude), longitude: Number(place.longitude) };
  },

  /** "Round Rock" in "TX" -> { name, stateCode, latitude, longitude } (centre of its ZIP codes), or null. */
  async city(name, stateCode) {
    if (!name || !/^[A-Za-z]{2}$/.test(stateCode ?? "")) return null;
    const data = await getJson(`https://api.zippopotam.us/us/${stateCode.toLowerCase()}/${encodeURIComponent(name.trim().toLowerCase())}`);
    const places = (data?.places ?? []).map((place) => ({ lat: Number(place.latitude), lng: Number(place.longitude) })).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
    if (!places.length) return null;
    const average = (key) => Number((places.reduce((sum, p) => sum + p[key], 0) / places.length).toFixed(5));
    return { name: data["place name"] ?? name, stateCode: (data["state abbreviation"] ?? stateCode).toUpperCase(), latitude: average("lat"), longitude: average("lng") };
  },

  /** A US address or place ("1100 Congress Ave, Austin, TX") -> { name, latitude, longitude }, or null. */
  async search(query) {
    const data = await getJson(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=${encodeURIComponent(query)}`);
    const hit = Array.isArray(data) ? data[0] : null;
    if (!hit) return null;
    return { name: hit.display_name, latitude: Number(Number(hit.lat).toFixed(5)), longitude: Number(Number(hit.lon).toFixed(5)) };
  },

  /** Coordinates -> the same shape (US only), or null when nothing usable is there. */
  async reverse(latitude, longitude) {
    const data = await getJson(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${latitude}&lon=${longitude}`);
    const address = data?.address;
    if (!address || address.country_code !== "us" || !address.postcode) return null;
    const zipCode = String(address.postcode).slice(0, 5);
    const city = address.city || address.town || address.village || address.hamlet || address.suburb || address.county || "";
    const stateCode = (address["ISO3166-2-lvl4"] ?? "").replace("US-", "");
    return { zipCode, city, state: address.state ?? "", stateCode, latitude: Number(latitude), longitude: Number(longitude), street: [address.house_number, address.road].filter(Boolean).join(" ") };
  },
};

export const isUsZip = (value) => typeof value === "string" && /^\d{5}$/.test(value.trim());
