import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only the signed-in company account manages its own premium plan.
export const requirePremiumAccess = requireAuth("company");
