import { Router } from "express";
import { previousProjectsController } from "../controllers/previousProjectsController.js";
import { requireFreelancerPreviousProjectsAccess } from "../middleware/previousProjectsAuth.js";
import { validatePreviousProjectsCreate, validatePreviousProjectsUpdate } from "../middleware/validatePreviousProjects.js";

export const previousProjectsRouter = Router();

// Public: previous projects shown on a published freelancer profile (by public listing id).
previousProjectsRouter.get("/public/:listingId", previousProjectsController.listPublic);

// Signed-in freelancer: manage its own previous projects.
previousProjectsRouter.get("/", requireFreelancerPreviousProjectsAccess, previousProjectsController.list);
previousProjectsRouter.post("/", requireFreelancerPreviousProjectsAccess, validatePreviousProjectsCreate, previousProjectsController.create);
previousProjectsRouter.get("/:id", requireFreelancerPreviousProjectsAccess, previousProjectsController.getOne);
previousProjectsRouter.put("/:id", requireFreelancerPreviousProjectsAccess, validatePreviousProjectsUpdate, previousProjectsController.update);
previousProjectsRouter.patch("/:id", requireFreelancerPreviousProjectsAccess, validatePreviousProjectsUpdate, previousProjectsController.update);
previousProjectsRouter.delete("/:id", requireFreelancerPreviousProjectsAccess, previousProjectsController.remove);
