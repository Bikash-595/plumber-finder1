import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireCustomersAccess = requireAuth("company");
