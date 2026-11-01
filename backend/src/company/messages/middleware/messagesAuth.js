import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireMessagesAccess = requireAuth("company");
