import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireCompanyHeaderProfileAccess = requireAuth("company");
