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
export const googleHttp = { fetch: (...args) => fetch(...args) }; // every Google call (Places and OAuth) goes through this
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
  const place = await call(`/places/${encodeURIComponent(placeId)}?languageCode=en`, { headers: { "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews" } });
  return {
    origin: "places",
    displayName: place.displayName?.text,
    address: place.formattedAddress,
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
      ownerReply: null, // the Places API doesn't return owner replies (Business Profile OAuth does)
    })),
  };
}

/** Businesses matching a search (so an owner can find their own Place ID). */
export async function searchPlaces(textQuery) {
  const result = await call("/places:searchText", { method: "POST", headers: { "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri" }, body: JSON.stringify({ textQuery, maxResultCount: 5 }) });
  return (result.places ?? []).map((place) => ({ placeId: place.id, name: place.displayName?.text, address: place.formattedAddress, phone: place.nationalPhoneNumber, website: place.websiteUri, rating: place.rating ?? null, userRatingCount: place.userRatingCount ?? 0, googleMapsUri: place.googleMapsUri }));
}
