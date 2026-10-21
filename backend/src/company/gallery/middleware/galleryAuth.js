import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";

// Only signed-in company accounts can manage their gallery items.
export const requireCompanyGalleryAccess = requireAuth("company");
