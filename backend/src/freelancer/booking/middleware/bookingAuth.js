import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their booking settings.
export const requireFreelancerBookingAccess = requireAuth("freelancer");
