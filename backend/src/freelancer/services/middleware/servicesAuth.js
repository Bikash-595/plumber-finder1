import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their services.
export const requireFreelancerServicesAccess = requireAuth("freelancer");
