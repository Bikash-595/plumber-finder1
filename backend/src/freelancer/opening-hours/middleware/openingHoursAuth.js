import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their opening hours.
export const requireFreelancerOpeningHoursAccess = requireAuth("freelancer");
