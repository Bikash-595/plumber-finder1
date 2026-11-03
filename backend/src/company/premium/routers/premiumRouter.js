import { createPremiumRouter } from "../../../premium/routers/createPremiumRouter.js";
import { requirePremiumAccess } from "../middleware/premiumAuth.js";

// Mounted at /api/companies/premium. Plans, Stripe and billing logic live in src/premium.
export const companyPremiumRouter = createPremiumRouter(requirePremiumAccess);
