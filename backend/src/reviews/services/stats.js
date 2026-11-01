import { CustomerReview } from "../models/index.js";

// Ratings are always worked out the same way, from published PlumberFinder reviews only (never held, hidden or
// rejected reviews, never Google): per source and for the whole platform.

const round1 = (value) => Math.round(value * 10) / 10;
const blank = () => ({ average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });

/** Builds { platform, directory, verified } from rows of { _id: { source, rating }, count }. */
export function statsFromGroups(rows) {
  const stats = { platform: blank(), directory: blank(), verified: blank() };
  const sums = { platform: 0, directory: 0, verified: 0 };
  for (const { _id, count } of rows) {
    const key = _id.source === "verified_booking" ? "verified" : "directory";
    for (const bucket of ["platform", key]) {
      stats[bucket].count += count;
      stats[bucket].distribution[_id.rating] += count;
      sums[bucket] += _id.rating * count;
    }
  }
  for (const bucket of Object.keys(stats)) stats[bucket].average = stats[bucket].count ? round1(sums[bucket] / stats[bucket].count) : 0;
  return stats;
}

const groupBySourceAndRating = { $group: { _id: { source: { $ifNull: ["$source", "directory"] }, rating: "$rating" }, count: { $sum: 1 } } };

/** One plumber's PlumberFinder ratings, by public listing id. */
export async function reviewStats(providerType, providerId) {
  return statsFromGroups(await CustomerReview.aggregate([{ $match: { providerType, providerId: String(providerId), status: "published" } }, groupBySourceAndRating]));
}

/** One plumber's ratings by account (their dashboard). */
export async function reviewStatsForAccount(providerType, providerAccount) {
  return statsFromGroups(await CustomerReview.aggregate([{ $match: { providerType, providerAccount, status: "published" } }, groupBySourceAndRating]));
}

/** Platform ratings for many plumbers at once (directory cards): Map(account id → { rating, reviewCount }). */
export async function ratingsByAccount(providerType, accounts) {
  const rows = await CustomerReview.aggregate([{ $match: { providerType, providerAccount: { $in: accounts }, status: "published" } }, { $group: { _id: "$providerAccount", rating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }]);
  return new Map(rows.map((row) => [String(row._id), { rating: round1(row.rating), reviewCount: row.reviewCount }]));
}

/** Latest published reviews in the shape the profile page has always used. */
export async function latestReviews(providerType, providerId, limit = 10) {
  const items = await CustomerReview.find({ providerType, providerId: String(providerId), status: "published" }).sort({ createdAt: -1 }).limit(limit).lean();
  return items.map((item) => ({ _id: item._id, customer: item.userName, rating: item.rating, title: item.title, review: item.body, source: item.source ?? "directory", createdAt: item.createdAt }));
}
