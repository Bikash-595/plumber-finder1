import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireSavedRepliesAccess = requireAuth("company");
