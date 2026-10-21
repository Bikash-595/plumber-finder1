import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their FAQs.
export const requireFreelancerFaqsAccess = requireAuth("freelancer");
