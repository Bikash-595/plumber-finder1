import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

export const requireSettingsAccess = requireAuth("company");
