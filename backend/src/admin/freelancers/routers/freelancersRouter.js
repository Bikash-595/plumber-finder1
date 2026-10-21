import { Router } from "express";
import { listFreelancers, setFreelancerVerification } from "../controllers/freelancersController.js";
import { requireFreelancersAccess } from "../middleware/freelancersAuth.js";
import { validateFreelancersStatus } from "../middleware/validateFreelancersStatus.js";

// Mounted at /api/admin/freelancers.
export const freelancersRouter = Router();
freelancersRouter.use(requireFreelancersAccess);
freelancersRouter.get("/", listFreelancers);
freelancersRouter.patch("/:id/verification", validateFreelancersStatus, setFreelancerVerification);
