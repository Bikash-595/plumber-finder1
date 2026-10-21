import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their special offers.
export const requireCompanySpecialOffersAccess = requireAuth("company");
