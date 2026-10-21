import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their blog posts.
export const requireCompanyBlogsAccess = requireAuth("company");
