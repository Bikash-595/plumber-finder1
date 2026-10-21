import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their service areas.
export const requireFreelancerServiceAreasAccess = requireAuth("freelancer");
