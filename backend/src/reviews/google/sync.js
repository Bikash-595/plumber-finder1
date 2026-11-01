import { GoogleBusinessLink } from "../models/index.js";
import { fetchBusinessProfileReviews } from "./businessProfile.js";
import { CACHE_MS, fetchPlace, googleConfigured, readReviewsUrl, writeReviewUrl } from "./places.js";

/** Asks Google for fresh data (Business Profile when connected with OAuth, else the Places API) and saves it to `link`. */
export async function syncLink(link) {
  try {
    let data = null;
    if (link.providerType === "company") data = await fetchBusinessProfileReviews(link.providerAccount, link.placeId).catch((error) => { link.lastError = { message: error.message, at: new Date() }; return null; });
    if (!data && googleConfigured()) data = await fetchPlace(link.placeId);
    if (!data) return link;
    const place = data.origin === "business_profile" && googleConfigured() ? await fetchPlace(link.placeId).catch(() => null) : null;
    link.cache = { ...data, googleMapsUri: data.googleMapsUri ?? place?.googleMapsUri, displayName: data.displayName ?? place?.displayName ?? link.businessName, fetchedAt: new Date() };
    if (data.address && !link.address) link.address = data.address;
    link.lastSyncedAt = new Date();
    if (data.origin === "places" || !link.lastError?.message) link.lastError = undefined;
  } catch (error) {
    // Nothing older than a day is shown: on failure the old copy is dropped.
    link.cache = undefined;
    link.lastError = { message: error.message, at: new Date() };
  }
  await link.save();
  return link;
}

/**
 * What to show for a company's Google reviews. Uses data under a day old, otherwise asks Google again
 * (`refresh` forces it). `link` is a GoogleBusinessLink document (or null). Never invents anything:
 * when Google can't be asked, it says why (`reason`).
 */
export async function googleSummary(link, { refresh = false } = {}) {
  if (!link || (!link.profileUrl && !link.placeId)) return { connected: false, available: false, reason: "not_connected" };
  const base = {
    connected: true, connectionStatus: link.connectionStatus, businessName: link.businessName ?? null, address: link.address ?? null,
    profileUrl: link.profileUrl || null, placeId: link.placeId || null, lastSyncedAt: link.lastSyncedAt ?? null,
    readUrl: readReviewsUrl(link.placeId, link.profileUrl, link.cache?.googleMapsUri), writeUrl: writeReviewUrl(link.placeId, link.profileUrl),
  };
  if (!link.placeId) return { ...base, available: false, reason: "no_place_id" };
  const fresh = link.cache?.fetchedAt && Date.now() - new Date(link.cache.fetchedAt).getTime() < CACHE_MS;
  if (!fresh || refresh) await syncLink(link);
  if (!link.cache?.fetchedAt) return { ...base, available: false, reason: googleConfigured() || link.lastError ? "google_error" : "api_not_configured", error: link.lastError?.message };
  return {
    ...base, available: true, origin: link.cache.origin ?? "places", readUrl: readReviewsUrl(link.placeId, link.profileUrl, link.cache.googleMapsUri),
    displayName: link.cache.displayName, rating: link.cache.rating, count: link.cache.userRatingCount, reviews: link.cache.reviews ?? [], fetchedAt: link.cache.fetchedAt, lastSyncedAt: link.lastSyncedAt,
  };
}

/** Scheduled job: refreshes connected companies whose Google data is over a day old (a few per run). */
export async function refreshStaleGoogleLinks({ now = new Date(), batch = 20 } = {}) {
  const stale = await GoogleBusinessLink.find({
    providerType: "company", connectionStatus: "connected", placeId: { $exists: true, $ne: null },
    $or: [{ "cache.fetchedAt": { $exists: false } }, { "cache.fetchedAt": { $lt: new Date(now.getTime() - CACHE_MS) } }],
  }).sort({ "cache.fetchedAt": 1 }).limit(batch);
  for (const link of stale) await syncLink(link);
  return stale.length;
}
