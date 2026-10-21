import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their special offers.
export const requireFreelancerSpecialOffersAccess = requireAuth("freelancer");
