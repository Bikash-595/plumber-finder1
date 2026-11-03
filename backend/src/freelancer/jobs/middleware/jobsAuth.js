import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in freelancer accounts.
export const requireJobsAccess = requireAuth("freelancer");
