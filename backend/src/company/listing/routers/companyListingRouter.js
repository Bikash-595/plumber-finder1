import { Router } from "express";
import { getPublishedCompanies, getPublishedCompany } from "../controllers/companyListingController.js";

// Mounted at /api/companies.
export const companyListingRouter = Router();
companyListingRouter.get("/public", getPublishedCompanies);
companyListingRouter.get("/public/:id", getPublishedCompany);
