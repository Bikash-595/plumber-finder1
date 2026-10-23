import { Router } from "express";
import { clearCompanyOnboardingStep, deleteCompanyOnboarding, getCompanyOnboarding, saveCompanyOnboarding, saveCompanyOnboardingStep } from "../controllers/companyOnboardingController.js";
import { requireCompanyOnboardingAccess } from "../middleware/onboardingAuth.js";

// Mounted at /api/companies/onboarding.
export const companyOnboardingRouter = Router();
companyOnboardingRouter.use(requireCompanyOnboardingAccess);
companyOnboardingRouter.get("/", getCompanyOnboarding);
companyOnboardingRouter.post("/", saveCompanyOnboarding);
companyOnboardingRouter.put("/steps/:stepId", saveCompanyOnboardingStep);
companyOnboardingRouter.delete("/", deleteCompanyOnboarding);
companyOnboardingRouter.delete("/steps/:stepId", clearCompanyOnboardingStep);
