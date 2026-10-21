import { Router } from "express";
import { listCompanies, setCompanyStatus } from "../controllers/companiesController.js";
import { requireCompaniesAccess } from "../middleware/companiesAuth.js";
import { validateCompaniesStatus } from "../middleware/validateCompaniesStatus.js";

// Mounted at /api/admin/companies.
export const companiesRouter = Router();
companiesRouter.use(requireCompaniesAccess);
companiesRouter.get("/", listCompanies);
companiesRouter.patch("/:id/status", validateCompaniesStatus, setCompanyStatus);
