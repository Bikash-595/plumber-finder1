import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireCompanyReviewsAccess = requireAuth("company");
