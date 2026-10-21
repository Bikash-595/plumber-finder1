import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their reviews.
export const requireCompanyReviewsAccess = requireAuth("company");
