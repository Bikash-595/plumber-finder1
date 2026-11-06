// Default ranking settings. Admins change them in Directory & SEO (stored in RankingConfiguration); every
// factor is a 0–1 score per provider (see services/rankingEngine.js) and the weights say how much each counts.
// Only listings with an active premium plan are ranked; the score decides their order (paying never does).

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

// The three page designs: the whole USA, one state, one city.
export const PAGE_TEMPLATES = [
  { key: "usa", label: "USA-wide" },
  { key: "state", label: "State-wide" },
  { key: "city", label: "City-wide" },
];

// Words an admin can use in a template's SEO title / description; filled in for each page.
export const TEMPLATE_PLACEHOLDERS = ["{limit}", "{noun}", "{place}", "{state}", "{city}", "{count}"];

const template = { title: "", description: "", showMap: true, showFaq: true };

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
  // The most featured / sponsored placements shown (in their own labelled box) on one ranking page.
  sponsoredSlots: 2,
  // Listings an admin has removed from rankings (and premium listings made ineligible): [{ providerType, listingId, reason }].
  exclusions: [],
  // Featured / sponsored placements an admin sold or chose: [{ providerType, listingId, kind, stateCode, citySlug, until, note }].
  // A placement with no state shows on the USA pages, with a state on that state's pages (and its cities), with a
  // city on that city's pages. They are always labelled and never change the ranked order.
  placements: [],
  // Per page design: SEO title / description patterns (empty = the built-in wording) and optional sections.
  templates: { usa: { ...template }, state: { ...template }, city: { ...template } },
};
