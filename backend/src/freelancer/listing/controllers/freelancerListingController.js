import { FreelancerListing } from "../models/FreelancerListing.js";
import { cardSummaries, fullProfile } from "../services/publicProfile.js";

// Public directory of published freelancers.
export async function getPublishedFreelancers(_req, res, next) {
  try {
    const listings = await FreelancerListing.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
    const summaries = await cardSummaries(listings);
    res.json({ data: listings.map(({ freelancer, __v, ...listing }) => ({ ...listing, ...summaries.get(String(freelancer)) })) });
  } catch (error) { next(error); }
}

export async function getPublishedFreelancer(req, res, next) {
  try {
    const listing = await FreelancerListing.findOne({ _id: req.params.id, isPublished: true });
    if (!listing) return res.status(404).json({ message: "Freelancer listing not found." });
    res.json({ data: listing });
  } catch (error) { next(error); }
}

/** GET /public/:id/profile — the listing plus every public section (services, projects, blogs, hours, ...). */
export async function getPublishedFreelancerProfile(req, res, next) {
  try {
    const listing = await FreelancerListing.findOne({ _id: req.params.id, isPublished: true }).lean();
    if (!listing) return res.status(404).json({ message: "Freelancer listing not found." });
    res.json({ data: await fullProfile(listing) });
  } catch (error) { next(error); }
}
