import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their booking settings.
export const requireCompanyBookingAccess = requireAuth("company");
