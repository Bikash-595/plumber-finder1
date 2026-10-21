import mongoose from "mongoose";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";

const listingModels = { company: CompanyListing, freelancer: FreelancerListing };

/**
 * Express middleware: when an item points at a real listing (a database id), that listing must exist
 * and be published. The site's built-in sample plumbers use short ids such as "1" and are accepted as-is.
 */
export async function verifyProvider(req, res, next) {
  try {
    const { providerType, providerId } = req.validated ?? {};
    if (!providerType || !providerId || !mongoose.isValidObjectId(providerId) || providerId.length !== 24) return next();
    const listing = await listingModels[providerType].exists({ _id: providerId, isPublished: true });
    if (!listing) return res.status(404).json({ message: "That plumber is not available." });
    next();
  } catch (error) { next(error); }
}
