import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts can manage their gallery items.
export const requireFreelancerGalleryAccess = requireAuth("freelancer");
