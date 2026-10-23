import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their social links.
export const requireFreelancerSocialLinksAccess = requireAuth("freelancer");
