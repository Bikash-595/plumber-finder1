import { Router } from "express";
import { requireAuth } from "../../config/authMiddleware.js";
import { getPublishedCompanies, getPublishedCompany, saveCompanyOnboarding } from "../controllers/companyOnboardingController.js";

export const companyListingRouter = Router();
companyListingRouter.get("/public", getPublishedCompanies);
companyListingRouter.get("/public/:id", getPublishedCompany);
companyListingRouter.post("/onboarding", requireAuth("company"), saveCompanyOnboarding);
