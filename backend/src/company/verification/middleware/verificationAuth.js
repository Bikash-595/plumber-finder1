import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only the signed-in company can see and change its own documents.
export const requireCompanyVerificationAccess = requireAuth("company");
