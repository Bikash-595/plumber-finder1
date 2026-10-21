import { Router } from "express";
import { servicesController } from "../controllers/servicesController.js";
import { requireFreelancerServicesAccess } from "../middleware/servicesAuth.js";
import { validateServicesCreate, validateServicesUpdate } from "../middleware/validateServices.js";

export const servicesRouter = Router();

// Public: services shown on a published freelancer profile (by public listing id).
servicesRouter.get("/public/:listingId", servicesController.listPublic);

// Signed-in freelancer: manage its own services.
servicesRouter.get("/", requireFreelancerServicesAccess, servicesController.list);
servicesRouter.post("/", requireFreelancerServicesAccess, validateServicesCreate, servicesController.create);
servicesRouter.get("/:id", requireFreelancerServicesAccess, servicesController.getOne);
servicesRouter.put("/:id", requireFreelancerServicesAccess, validateServicesUpdate, servicesController.update);
servicesRouter.patch("/:id", requireFreelancerServicesAccess, validateServicesUpdate, servicesController.update);
servicesRouter.delete("/:id", requireFreelancerServicesAccess, servicesController.remove);
