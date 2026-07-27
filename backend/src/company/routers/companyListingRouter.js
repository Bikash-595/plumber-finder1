import { Router } from "express";
import { requireAuth } from "../../config/authMiddleware.js";
import { getPublishedCompanies, saveCompanyOnboarding } from "../controllers/companyOnboardingController.js";

export const companyListingRouter = Router();
companyListingRouter.get("/public", getPublishedCompanies);
companyListingRouter.post("/onboarding", requireAuth("company"), saveCompanyOnboarding);
