import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their social links.
export const requireCompanySocialLinksAccess = requireAuth("company");
