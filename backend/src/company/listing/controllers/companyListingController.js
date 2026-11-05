import { cachedDirectory } from "../../../shared/business/directoryCache.js";
import { cachedProfile } from "../../../shared/business/profileCache.js";
import { mediaMarkers, withMediaUrls } from "../../../media/mediaUrls.js";
import { CompanyListing } from "../models/CompanyListing.js";
import { cardSummaries, fullProfile } from "../services/publicProfile.js";

const LISTING_IMAGES = ["logo", "coverImage"];

// Public directory of published companies (home page cards, /plumber/:id profiles). Built once and shared by
// every visitor (shared/business/directoryCache.js); pictures are links to /media/... instead of inline uploads.
export const getPublishedCompanies = cachedDirectory("companies", async () => {
  // Uses the { isPublished, premium.rank, createdAt } index; pictures are swapped for markers inside MongoDB.
  const listings = await CompanyListing.aggregate([{ $match: { isPublished: true } }, { $sort: { "premium.rank": -1, createdAt: -1 } }, { $unset: "previousSlugs" }, mediaMarkers(LISTING_IMAGES)]);
  const summaries = await cardSummaries(listings);
  return listings.map(({ company, __v, ...listing }) => ({ ...withMediaUrls("company-listing", listing, LISTING_IMAGES), ...summaries.get(String(company)) }));
});

export async function getPublishedCompany(req, res, next) {
  try {
    const listing = await CompanyListing.findOne({ _id: req.params.id, isPublished: true }).select("-company -__v").lean();
    if (!listing) return res.status(404).json({ message: "Company listing not found." });
    res.json({ data: withMediaUrls("company-listing", listing, LISTING_IMAGES) });
  } catch (error) { next(error); }
}

/**
 * GET /public/:idOrSlug/profile — the listing plus every public section (team, blogs, projects, hours, ...).
 * Accepts the listing id or its URL slug; an old slug (from before a rename) also matches, and the
 * response's `slug` is the current one so the page can redirect.
 */
export const getPublishedCompanyProfile = cachedProfile("company", async (req) => {
  const key = String(req.params.id).toLowerCase();
  const filter = /^[a-f0-9]{24}$/.test(key) ? { _id: key } : { $or: [{ slug: key }, { previousSlugs: key }] };
  const listing = await CompanyListing.findOne({ ...filter, isPublished: true }).lean();
  return listing ? { owner: `company:${listing.company}`, data: await fullProfile(listing) } : null;
}, "Company listing not found.");
