import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their previous projects.
export const requireCompanyPreviousProjectsAccess = requireAuth("company");
