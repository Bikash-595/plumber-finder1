import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their opening hours.
export const requireCompanyOpeningHoursAccess = requireAuth("company");
