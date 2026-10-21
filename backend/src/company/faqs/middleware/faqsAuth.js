import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their FAQs.
export const requireCompanyFaqsAccess = requireAuth("company");
