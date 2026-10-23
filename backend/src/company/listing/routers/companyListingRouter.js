import { Router } from "express";
import { getPublishedCompanies, getPublishedCompany, getPublishedCompanyProfile } from "../controllers/companyListingController.js";

// Mounted at /api/companies.
export const companyListingRouter = Router();
companyListingRouter.get("/public", getPublishedCompanies);
companyListingRouter.get("/public/:id", getPublishedCompany);
companyListingRouter.get("/public/:id/profile", getPublishedCompanyProfile);
