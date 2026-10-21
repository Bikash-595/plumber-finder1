import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can publish their listing through the Add Company wizard.
export const requireCompanyOnboardingAccess = requireAuth("company");
