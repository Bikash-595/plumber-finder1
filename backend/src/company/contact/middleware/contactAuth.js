import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their contact details.
export const requireCompanyContactAccess = requireAuth("company");
