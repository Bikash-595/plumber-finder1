import { Router } from "express";
import { listLeads } from "../../../company/leads/controllers/leadsController.js";
import { requireLeadsAccess } from "../middleware/leadsAuth.js";

// Mounted at /api/freelancers/leads. Answer leads with /api/freelancers/bookings/:id/accept|decline.
export const freelancerLeadsRouter = Router();
freelancerLeadsRouter.use(requireLeadsAccess);
freelancerLeadsRouter.get("/", listLeads);
