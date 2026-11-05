// Default ranking settings. Admins change them in Directory & SEO (stored in RankingConfiguration); every
// factor is a 0–1 score per provider (see services/rankingEngine.js) and the weights say how much each counts.

export const RANKING_FACTORS = [
  { key: "rating", label: "Customer rating and review quality", default: 25 },
  { key: "verified", label: "Verified business", default: 20 },
  { key: "jobs", label: "Completed jobs and satisfaction", default: 20 },
  { key: "relevance", label: "Service and location relevance", default: 15 },
  { key: "completeness", label: "Profile completeness", default: 10 },
  { key: "engagement", label: "Recent customer engagement", default: 10 },
];

export const RANKING_TYPES = [
  { key: "top-rated", label: "Top Rated" },
  { key: "most-reviewed", label: "Most Reviewed" },
  { key: "most-popular", label: "Most Popular" },
  { key: "verified", label: "Verified Companies" },
  { key: "recently-recommended", label: "Recently Recommended" },
];

export const RANKING_LIMITS = [10, 50];

export const rankingDefaults = {
  weights: Object.fromEntries(RANKING_FACTORS.map((factor) => [factor.key, factor.default])),
  // Reviews a provider needs before its own average counts fully (fewer pull it towards the site-wide average).
  ratingConfidenceReviews: 5,
  // Completed bookings that earn the full "jobs" score (fewer score proportionally, on a log scale).
  jobsForFullScore: 50,
  // Profile views and contact clicks in the last 90 days that earn the full "engagement" score.
  engagementForFullScore: 200,
  // A provider younger than this many days loses up to `newBusinessPenalty` of its score, so a brand-new
  // listing can't overtake established ones on day one.
  newBusinessDays: 90,
  newBusinessPenalty: 0.15,
  // A ranking page is indexable by search engines only with at least this many qualifying providers.
  minimumQualifyingCompanies: 3,
  // Results for a general "best plumbers in X" search (no number asked for).
  defaultResultLimit: 10,
  // Paid (premium) listings shown in the separate, labelled "Sponsored" box on a ranking page.
  sponsoredSlots: 2,
  // Listings an admin has removed from rankings: [{ providerType, listingId, reason }].
  exclusions: [],
};
