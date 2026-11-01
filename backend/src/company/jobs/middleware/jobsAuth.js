import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireJobsAccess = requireAuth("company");
