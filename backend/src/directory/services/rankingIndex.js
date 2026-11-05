import { Company } from "../../auth/company/models/Company.js";
import { Freelancer } from "../../auth/freelancer/models/Freelancer.js";
import { ProfileActivity } from "../../activity/ProfileActivity.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { cardSummaries as companySummaries } from "../../company/listing/services/publicProfile.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { cardSummaries as freelancerSummaries } from "../../freelancer/listing/services/publicProfile.js";
import { mediaMarkers, withMediaUrls } from "../../media/mediaUrls.js";
import { CustomerReview, GoogleBusinessLink } from "../../reviews/models/index.js";
import { CompanySeo } from "../../company/seo/models/CompanySeo.js";
import { FreelancerSeo } from "../../freelancer/seo/models/FreelancerSeo.js";
import { directoryVersion } from "../../shared/business/directoryCache.js";
import { UserBooking } from "../../user/bookings/models/UserBooking.js";
import { findState } from "../config/usStates.js";

// Everything the ranking engine needs about every published company and freelancer, read from the existing
// collections (listings, card summaries, reviews, Google ratings, bookings, profile activity) — no copies are
// stored. Built in a handful of batched queries and kept in memory; rebuilt in the background when directory
// data changes (at most every REBUILD_MIN_MS) or every MAX_AGE_MS, so a ranking request never waits on it twice.

const MAX_AGE_MS = 10 * 60_000;
const REBUILD_MIN_MS = 30_000;
const RECENT_DAYS = 90;
const ENGAGEMENT_EVENTS = ["profile_view", "call_click", "email_click", "website_click", "share"];

export const slugify = (value) => String(value ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const isUpload = (value) => typeof value === "string" && value.length > 0;

/** "Austin, TX" / "12 Oak St, Austin, Texas 78701" → { city, state } when the listing has no separate fields. */
function placeFrom(listing) {
  const state = findState(listing.state);
  if (state) return { city: listing.city?.trim() || null, state };
  const parts = String(listing.location ?? "").split(",").map((part) => part.trim()).filter(Boolean);
  for (let i = parts.length - 1; i > 0; i--) {
    const found = findState(parts[i].replace(/\s+\d{5}(-\d{4})?$/, ""));
    if (found) return { city: listing.city?.trim() || parts[i - 1] || null, state: found };
  }
  return { city: listing.city?.trim() || null, state: null };
}

const countBy = (rows) => new Map(rows.map((row) => [`${row._id.type}:${row._id.account}`, row]));

async function buildEntries() {
  const since = new Date(Date.now() - RECENT_DAYS * 86_400_000);
  const [companyListings, freelancerListings] = await Promise.all([
    CompanyListing.aggregate([{ $match: { isPublished: true } }, { $unset: "previousSlugs" }, mediaMarkers(["logo", "coverImage"])]),
    FreelancerListing.aggregate([{ $match: { isPublished: true } }, mediaMarkers(["photo", "coverImage"], ["coverImages"])]),
  ]);
  const companyIds = companyListings.map((listing) => listing.company);
  const freelancerIds = freelancerListings.map((listing) => listing.freelancer);
  const accounts = [...companyIds, ...freelancerIds];

  const [cSummaries, fSummaries, companies, freelancers, jobs, engagement, recentPositive, google, companySeo, freelancerSeo] = await Promise.all([
    companySummaries(companyListings),
    freelancerSummaries(freelancerListings),
    Company.find({ _id: { $in: companyIds } }).select("status createdAt").lean(),
    Freelancer.find({ _id: { $in: freelancerIds } }).select("verificationStatus createdAt").lean(),
    // Completed jobs and problems reported (disputes) come from real bookings only.
    UserBooking.aggregate([
      { $match: { providerAccount: { $in: accounts }, status: { $in: ["completed", "disputed"] } } },
      { $group: { _id: { type: "$providerType", account: "$providerAccount" }, completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }, disputed: { $sum: { $cond: [{ $eq: ["$status", "disputed"] }, 1, 0] } } } },
    ]),
    ProfileActivity.aggregate([
      { $match: { providerAccount: { $in: accounts }, event: { $in: ENGAGEMENT_EVENTS }, createdAt: { $gte: since } } },
      { $group: { _id: { type: "$providerType", account: "$providerAccount" }, count: { $sum: 1 } } },
    ]),
    CustomerReview.aggregate([
      { $match: { providerAccount: { $in: accounts }, status: "published", rating: { $gte: 4 }, createdAt: { $gte: since } } },
      { $group: { _id: { type: "$providerType", account: "$providerAccount" }, count: { $sum: 1 } } },
    ]),
    // Google ratings are kept apart from Plumber Finder reviews (they are never imported as reviews), so adding
    // them never counts the same review twice.
    GoogleBusinessLink.find({ providerAccount: { $in: accounts }, "cache.rating": { $gt: 0 } }).select("providerType providerAccount cache.rating cache.userRatingCount").lean(),
    // The SEO keywords providers chose make them findable in the site search too.
    CompanySeo.find({ company: { $in: companyIds }, "keywords.0": { $exists: true } }).select("company keywords").lean(),
    FreelancerSeo.find({ freelancer: { $in: freelancerIds }, "keywords.0": { $exists: true } }).select("freelancer keywords").lean(),
  ]);
  const companyById = new Map(companies.map((item) => [String(item._id), item]));
  const freelancerById = new Map(freelancers.map((item) => [String(item._id), item]));
  const jobsBy = countBy(jobs), engagementBy = countBy(engagement), positiveBy = countBy(recentPositive);
  const googleBy = new Map(google.map((item) => [`${item.providerType}:${item.providerAccount}`, item.cache]));
  const keywordsBy = new Map([...companySeo.map((item) => [`company:${item.company}`, item.keywords]), ...freelancerSeo.map((item) => [`freelancer:${item.freelancer}`, item.keywords])]);

  const build = (type, listing, summary, account) => {
    const accountKey = `${type}:${account._id ?? listing[type]}`;
    const place = placeFrom(listing);
    const media = type === "company" ? withMediaUrls("company-listing", listing, ["logo", "coverImage"]) : withMediaUrls("freelancer-listing", listing, ["photo", "coverImage", "coverImages"]);
    const services = (listing.services ?? []).filter(Boolean);
    const description = type === "company" ? (listing.tagline || listing.description || "") : (listing.headline || summary.headerBio || summary.bio || "");
    const g = googleBy.get(accountKey);
    const completeness = [
      isUpload(type === "company" ? listing.logo : listing.photo), isUpload(listing.coverImage), String(type === "company" ? listing.description : summary.bio ?? "").length >= 80,
      Boolean(listing.phone), Boolean(listing.website), services.length >= 3, (summary.weeklyHours ?? []).some((day) => day.isOpen), (summary.galleryCounts?.images ?? 0) > 0, Boolean(place.city && place.state),
    ];
    return {
      key: `${type}:${listing._id}`,
      providerType: type,
      listingId: String(listing._id),
      account: String(account._id ?? listing[type]),
      name: type === "company" ? listing.companyName : listing.displayName,
      url: type === "company" ? `/company/${listing.slug}` : `/plumber/${listing._id}`,
      logo: (type === "company" ? media.logo : media.photo) || null,
      city: place.city, citySlug: place.city ? slugify(place.city) : null,
      stateCode: place.state?.code ?? null,
      address: listing.location || [place.city, place.state?.code].filter(Boolean).join(", ") || null,
      phone: listing.phone || null,
      website: listing.website || null,
      description: String(description).slice(0, 280),
      services,
      serviceNames: services.map((name) => name.toLowerCase()),
      serviceAreas: (listing.serviceAreas ?? []).filter(Boolean),
      serviceAreaSlugs: (listing.serviceAreas ?? []).map(slugify).filter(Boolean),
      keywords: (keywordsBy.get(accountKey) ?? []).filter(Boolean),
      isEmergency: Boolean(summary.isEmergency),
      verified: Boolean(summary.verified),
      // Suspended companies and freelancers whose documents were rejected never rank.
      blocked: type === "company" ? account.status === "suspended" : account.verificationStatus === "rejected",
      premium: listing.premium?.tier && (!listing.premium.until || new Date(listing.premium.until) > new Date()) ? { tier: listing.premium.tier, rank: listing.premium.rank ?? 0 } : null,
      rating: summary.rating ?? 0, reviewCount: summary.reviewCount ?? 0,
      google: g ? { rating: g.rating, count: g.userRatingCount ?? 0 } : null,
      completedJobs: jobsBy.get(accountKey)?.completed ?? 0, disputedJobs: jobsBy.get(accountKey)?.disputed ?? 0,
      engagement: engagementBy.get(accountKey)?.count ?? 0,
      recentPositive: positiveBy.get(accountKey)?.count ?? 0,
      completeness: completeness.filter(Boolean).length / completeness.length,
      weeklyHours: summary.weeklyHours ?? [],
      coordinates: summary.coordinates ?? null,
      joinedAt: account.createdAt ?? listing.createdAt ?? null,
    };
  };

  return [
    ...companyListings.map((listing) => build("company", listing, cSummaries.get(String(listing.company)) ?? {}, companyById.get(String(listing.company)) ?? {})),
    ...freelancerListings.map((listing) => build("freelancer", listing, fSummaries.get(String(listing.freelancer)) ?? {}, freelancerById.get(String(listing.freelancer)) ?? {})),
  ];
}

let index = { entries: null, version: -1, at: 0, pending: null };

function rebuild() {
  if (!index.pending) {
    const version = directoryVersion();
    index.pending = buildEntries()
      .then((entries) => { index = { entries, version, at: Date.now(), pending: null }; return entries; })
      .catch((error) => { index.pending = null; throw error; });
  }
  return index.pending;
}

/** Every rankable provider. The first call waits for the build; later ones get the current copy while a newer one builds. */
export async function rankingEntries() {
  if (!index.entries) return rebuild();
  const age = Date.now() - index.at;
  if ((index.version !== directoryVersion() && age > REBUILD_MIN_MS) || age > MAX_AGE_MS) rebuild().catch(() => undefined);
  return index.entries;
}

/** A version that changes with each rebuilt index (result caches key on it). */
export const rankingIndexVersion = () => index.at;

/** Test helper: forget the index so the next call rebuilds it. */
export function resetRankingIndex() {
  index = { entries: null, version: -1, at: 0, pending: null };
}
