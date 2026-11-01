import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireLeadsAccess = requireAuth("company");
