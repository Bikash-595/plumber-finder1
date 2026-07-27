import { requireAuth } from "../../../config/authMiddleware.js";

export const requireCompanyHeaderProfileAccess = requireAuth("company");
