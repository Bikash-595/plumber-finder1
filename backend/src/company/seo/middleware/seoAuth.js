import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only the signed-in company edits its own SEO & keywords.
export const requireSeoAccess = requireAuth("company");
