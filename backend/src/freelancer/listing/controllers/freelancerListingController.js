import { cachedDirectory } from "../../../shared/business/directoryCache.js";
import { cachedProfile } from "../../../shared/business/profileCache.js";
import { mediaMarkers, withMediaUrls } from "../../../media/mediaUrls.js";
import { FreelancerListing } from "../models/FreelancerListing.js";
import { cardSummaries, fullProfile } from "../services/publicProfile.js";

const LISTING_IMAGES = ["photo", "coverImage", "coverImages"];

// Public directory of published freelancers (cached and shared like the company directory).
export const getPublishedFreelancers = cachedDirectory("freelancers", async () => {
  // Pictures are swapped for markers inside MongoDB (see media/mediaUrls.js).
  const listings = await FreelancerListing.aggregate([{ $match: { isPublished: true } }, { $sort: { "premium.rank": -1, createdAt: -1 } }, mediaMarkers(["photo", "coverImage"], ["coverImages"])]);
  const summaries = await cardSummaries(listings);
  return listings.map(({ freelancer, __v, ...listing }) => ({ ...withMediaUrls("freelancer-listing", listing, LISTING_IMAGES), ...summaries.get(String(freelancer)) }));
});

export async function getPublishedFreelancer(req, res, next) {
  try {
    const listing = await FreelancerListing.findOne({ _id: req.params.id, isPublished: true }).select("-freelancer -__v").lean();
    if (!listing) return res.status(404).json({ message: "Freelancer listing not found." });
    res.json({ data: withMediaUrls("freelancer-listing", listing, LISTING_IMAGES) });
  } catch (error) { next(error); }
}

/** GET /public/:id/profile — the listing plus every public section (services, projects, blogs, hours, ...). */
export const getPublishedFreelancerProfile = cachedProfile("freelancer", async (req) => {
  const listing = await FreelancerListing.findOne({ _id: req.params.id, isPublished: true }).lean();
  return listing ? { owner: `freelancer:${listing.freelancer}`, data: await fullProfile(listing) } : null;
}, "Freelancer listing not found.");
