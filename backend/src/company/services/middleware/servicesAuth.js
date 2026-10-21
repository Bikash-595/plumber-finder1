import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their services.
export const requireCompanyServicesAccess = requireAuth("company");
