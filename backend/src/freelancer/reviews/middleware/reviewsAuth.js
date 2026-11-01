import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireFreelancerReviewsAccess = requireAuth("freelancer");
