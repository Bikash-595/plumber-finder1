import { Router } from "express";
import { saveCompanyOnboarding } from "../controllers/companyOnboardingController.js";
import { requireCompanyOnboardingAccess } from "../middleware/onboardingAuth.js";

// Mounted at /api/companies/onboarding.
export const companyOnboardingRouter = Router();
companyOnboardingRouter.post("/", requireCompanyOnboardingAccess, saveCompanyOnboarding);
