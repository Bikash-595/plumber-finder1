// Google Business Profile reviews through the official Google Places API (New):
//   https://developers.google.com/maps/documentation/places/web-service/place-details
// Needs GOOGLE_PLACES_API_KEY (a server key with the Places API (New) enabled) and the business's Place ID.
// Without them, only the owner's Google links are shown — never invented review content.
//
// Google's terms: Place IDs may be stored indefinitely; other Places content is kept only briefly here
// (refreshed after CACHE_MS, never shown when older), shown with Google attribution and each review's
// author attribution, and never copied into PlumberFinder reviews.

export const CACHE_MS = 24 * 60 * 60 * 1000;
const PLACES = "https://places.googleapis.com/v1";
// Overridable in tests.
export const googleHttp = { fetch: (...args) => fetch(...args) };
const apiKey = () => (process.env.GOOGLE_PLACES_API_KEY || "").trim();
export const googleConfigured = () => Boolean(apiKey());

const GOOGLE_HOSTS = /^(?:[a-z0-9-]+\.)*(google\.[a-z.]{2,6}|goo\.gl|g\.page|maps\.app\.goo\.gl)$/i;
/** A Google Business Profile / Maps link the owner can paste (https on a Google host). */
export function isGoogleUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && GOOGLE_HOSTS.test(url.hostname);
  } catch {
    return false;
  }
}
/** Place IDs look like "ChIJN1t_tDeuEmsRUsoyG83frY4". */
export const isPlaceId = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{10,300}$/.test(value);
/** A Place ID written in a link (…place_id:XYZ or …placeid=XYZ), if there is one. */
export function placeIdFromUrl(value) {
  const match = String(value ?? "").match(/place_?id[:=]([A-Za-z0-9_-]{10,300})/i);
  return match ? match[1] : null;
}

export const writeReviewUrl = (placeId, profileUrl) => (placeId ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}` : profileUrl || null);
export const readReviewsUrl = (placeId, profileUrl, mapsUri) => mapsUri || profileUrl || (placeId ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}` : null);

async function call(path, init = {}) {
  const response = await googleHttp.fetch(`${PLACES}${path}`, { ...init, headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey(), ...init.headers } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `Google returned ${response.status}.`);
  return payload;
}

/** Rating, review count, and up to 5 reviews for a Place ID (Google decides which reviews). */
export async function fetchPlace(placeId) {
  const place = await call(`/places/${encodeURIComponent(placeId)}?languageCode=en`, { headers: { "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews" } });
  return {
    displayName: place.displayName?.text,
    rating: typeof place.rating === "number" ? place.rating : null,
    userRatingCount: typeof place.userRatingCount === "number" ? place.userRatingCount : 0,
    googleMapsUri: place.googleMapsUri,
    reviews: (place.reviews ?? []).slice(0, 5).map((review) => ({
      rating: review.rating,
      text: review.text?.text ?? review.originalText?.text ?? "",
      publishTime: review.publishTime,
      relativeTime: review.relativePublishTimeDescription,
      author: { name: review.authorAttribution?.displayName ?? "Google user", uri: review.authorAttribution?.uri, photoUri: review.authorAttribution?.photoUri },
      googleMapsUri: review.googleMapsUri,
    })),
  };
}

/** Businesses matching a search (so an owner can find their own Place ID). */
export async function searchPlaces(textQuery) {
  const result = await call("/places:searchText", { method: "POST", headers: { "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri" }, body: JSON.stringify({ textQuery, maxResultCount: 5 }) });
  return (result.places ?? []).map((place) => ({ placeId: place.id, name: place.displayName?.text, address: place.formattedAddress, rating: place.rating ?? null, userRatingCount: place.userRatingCount ?? 0, googleMapsUri: place.googleMapsUri }));
}

/**
 * What to show for a plumber's Google reviews. Uses recent data when it's under a day old, otherwise asks
 * Google again (`refresh` forces it). `link` is a GoogleBusinessLink document (or null).
 */
export async function googleSummary(link, { refresh = false } = {}) {
  if (!link || (!link.profileUrl && !link.placeId)) return { connected: false, available: false, reason: "not_connected" };
  const base = {
    connected: true, profileUrl: link.profileUrl || null, placeId: link.placeId || null,
    readUrl: readReviewsUrl(link.placeId, link.profileUrl, link.cache?.googleMapsUri), writeUrl: writeReviewUrl(link.placeId, link.profileUrl),
  };
  if (!link.placeId) return { ...base, available: false, reason: "no_place_id" };
  if (!googleConfigured()) return { ...base, available: false, reason: "api_not_configured" };
  const fresh = link.cache?.fetchedAt && Date.now() - new Date(link.cache.fetchedAt).getTime() < CACHE_MS;
  if (!fresh || refresh) {
    try {
      const place = await fetchPlace(link.placeId);
      link.cache = { ...place, fetchedAt: new Date() };
      link.lastError = undefined;
    } catch (error) {
      // Nothing older than a day is shown.
      link.cache = undefined;
      link.lastError = { message: error.message, at: new Date() };
    }
    await link.save();
  }
  if (!link.cache?.fetchedAt) return { ...base, available: false, reason: "google_error", error: link.lastError?.message };
  return {
    ...base, available: true, readUrl: readReviewsUrl(link.placeId, link.profileUrl, link.cache.googleMapsUri),
    displayName: link.cache.displayName, rating: link.cache.rating, count: link.cache.userRatingCount, reviews: link.cache.reviews ?? [], fetchedAt: link.cache.fetchedAt,
  };
}
