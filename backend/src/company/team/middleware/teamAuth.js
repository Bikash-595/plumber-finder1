import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their team members.
export const requireCompanyTeamAccess = requireAuth("company");
