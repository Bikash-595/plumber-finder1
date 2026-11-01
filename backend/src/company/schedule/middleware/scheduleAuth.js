import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireScheduleAccess = requireAuth("company");
