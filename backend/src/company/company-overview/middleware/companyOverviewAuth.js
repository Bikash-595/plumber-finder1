import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their company overview.
export const requireCompanyCompanyOverviewAccess = requireAuth("company");
