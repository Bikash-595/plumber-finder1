import { FreelancerListing } from "../models/FreelancerListing.js";

// Public directory of published freelancers.
export async function getPublishedFreelancers(_req, res, next) {
  try { res.json({ data: await FreelancerListing.find({ isPublished: true }).sort({ createdAt: -1 }) }); } catch (error) { next(error); }
}

export async function getPublishedFreelancer(req, res, next) {
  try {
    const listing = await FreelancerListing.findOne({ _id: req.params.id, isPublished: true });
    if (!listing) return res.status(404).json({ message: "Freelancer listing not found." });
    res.json({ data: listing });
  } catch (error) { next(error); }
}
