import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only the signed-in freelancer edits its own SEO & keywords.
export const requireSeoAccess = requireAuth("freelancer");
