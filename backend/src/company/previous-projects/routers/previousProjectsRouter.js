import { Router } from "express";
import { previousProjectsController } from "../controllers/previousProjectsController.js";
import { requireCompanyPreviousProjectsAccess } from "../middleware/previousProjectsAuth.js";
import { validatePreviousProjectsCreate, validatePreviousProjectsUpdate } from "../middleware/validatePreviousProjects.js";

export const previousProjectsRouter = Router();

// Public: previous projects shown on a published company profile (by public listing id).
previousProjectsRouter.get("/public/:listingId", previousProjectsController.listPublic);

// Signed-in company: manage its own previous projects.
previousProjectsRouter.get("/", requireCompanyPreviousProjectsAccess, previousProjectsController.list);
previousProjectsRouter.post("/", requireCompanyPreviousProjectsAccess, validatePreviousProjectsCreate, previousProjectsController.create);
previousProjectsRouter.get("/:id", requireCompanyPreviousProjectsAccess, previousProjectsController.getOne);
previousProjectsRouter.put("/:id", requireCompanyPreviousProjectsAccess, validatePreviousProjectsUpdate, previousProjectsController.update);
previousProjectsRouter.patch("/:id", requireCompanyPreviousProjectsAccess, validatePreviousProjectsUpdate, previousProjectsController.update);
previousProjectsRouter.delete("/:id", requireCompanyPreviousProjectsAccess, previousProjectsController.remove);
