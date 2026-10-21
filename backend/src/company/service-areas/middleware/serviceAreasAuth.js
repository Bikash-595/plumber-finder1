import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their service areas.
export const requireCompanyServiceAreasAccess = requireAuth("company");
