import { CompanyListing } from "../listing/models/CompanyListing.js";

/** Maps a public listing id (used in /plumber/:id URLs) to its company id, or null if not published. */
export async function resolvePublishedCompany(listingId) {
  const listing = await CompanyListing.findOne({ _id: listingId, isPublished: true }).select("company").lean();
  return listing?.company ?? null;
}
