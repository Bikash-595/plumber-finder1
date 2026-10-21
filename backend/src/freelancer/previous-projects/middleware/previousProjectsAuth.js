import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their previous projects.
export const requireFreelancerPreviousProjectsAccess = requireAuth("freelancer");
