import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireAvailabilityAccess = requireAuth("company");
