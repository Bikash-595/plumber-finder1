import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their blog posts.
export const requireFreelancerBlogsAccess = requireAuth("freelancer");
