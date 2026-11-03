import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their map location.
export const requireCompanyLocationAccess = requireAuth("company");
