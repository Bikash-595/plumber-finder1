import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their overview.
export const requireFreelancerOverviewAccess = requireAuth("freelancer");
