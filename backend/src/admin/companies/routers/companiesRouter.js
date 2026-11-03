import { Router } from "express";
import { getCompanyVerification, listCompanies, setCompanyStatus } from "../controllers/companiesController.js";
import { requireCompaniesAccess } from "../middleware/companiesAuth.js";
import { validateCompaniesStatus } from "../middleware/validateCompaniesStatus.js";

// Mounted at /api/admin/companies.
export const companiesRouter = Router();
companiesRouter.use(requireCompaniesAccess);
companiesRouter.get("/", listCompanies);
companiesRouter.get("/:id/verification", getCompanyVerification);
companiesRouter.patch("/:id/status", validateCompaniesStatus, setCompanyStatus);
