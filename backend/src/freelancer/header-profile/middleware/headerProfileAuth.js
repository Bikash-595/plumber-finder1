import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their profile.
export const requireFreelancerHeaderProfileAccess = requireAuth("freelancer");
