import { Freelancer } from "../../../auth/freelancer/models/Freelancer.js";
import { FreelancerListing } from "../../../freelancer/listing/models/FreelancerListing.js";
import { paginatedList, searchFilter } from "../../shared/listQuery.js";
import { freelancersConfig } from "../config/freelancersConfig.js";

/** GET /api/admin/freelancers?status=&search=&page= — includes each freelancer's public listing (if any). */
export async function listFreelancers(req, res, next) {
  try {
    const status = freelancersConfig.statuses.includes(req.query.status) ? { verificationStatus: req.query.status } : {};
    const result = await paginatedList(Freelancer, { ...status, ...searchFilter(req.query.search, freelancersConfig.searchFields) }, req.query, { select: freelancersConfig.fields });
    const listings = await FreelancerListing.find({ freelancer: { $in: result.data.map((freelancer) => freelancer._id) } }).select("freelancer displayName headline city state isPublished").lean();
    const byFreelancer = Object.fromEntries(listings.map((listing) => [String(listing.freelancer), listing]));
    res.json({ ...result, data: result.data.map((freelancer) => ({ ...freelancer, listing: byFreelancer[String(freelancer._id)] ?? null })) });
  } catch (error) { next(error); }
}

/** PATCH /api/admin/freelancers/:id/verification { verificationStatus } */
export async function setFreelancerVerification(req, res, next) {
  try {
    const freelancer = await Freelancer.findByIdAndUpdate(req.params.id, { $set: { verificationStatus: req.validated.verificationStatus } }, { new: true, runValidators: true }).select(freelancersConfig.fields);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found." });
    res.json({ message: `Freelancer marked ${freelancer.verificationStatus}.`, data: freelancer });
  } catch (error) { next(error); }
}
