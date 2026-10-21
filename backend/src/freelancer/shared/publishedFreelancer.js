import { FreelancerListing } from "../listing/models/FreelancerListing.js";

/** Maps a public freelancer listing id to the freelancer id, or null if it is not published. */
export async function resolvePublishedFreelancer(listingId) {
  const listing = await FreelancerListing.findOne({ _id: listingId, isPublished: true }).select("freelancer").lean();
  return listing?.freelancer ?? null;
}
