import { Router } from "express";
import { listLeads } from "../controllers/leadsController.js";
import { requireLeadsAccess } from "../middleware/leadsAuth.js";

// Mounted at /api/companies/leads. Answer leads with the booking actions (/api/companies/bookings/:id/accept|decline).
export const companyLeadsRouter = Router();
companyLeadsRouter.use(requireLeadsAccess);
companyLeadsRouter.get("/", listLeads);
