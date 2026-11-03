import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only the signed-in freelancer account manages its own premium plan.
export const requirePremiumAccess = requireAuth("freelancer");
