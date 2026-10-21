import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their reviews.
export const requireFreelancerReviewsAccess = requireAuth("freelancer");
