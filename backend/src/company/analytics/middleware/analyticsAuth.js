import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireAnalyticsAccess = requireAuth("company");
