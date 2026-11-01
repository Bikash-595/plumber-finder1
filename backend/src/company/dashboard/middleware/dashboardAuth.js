import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireDashboardAccess = requireAuth("company");
