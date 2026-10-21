import { Router } from "express";
import { servicesController } from "../controllers/servicesController.js";
import { requireCompanyServicesAccess } from "../middleware/servicesAuth.js";
import { validateServicesCreate, validateServicesUpdate } from "../middleware/validateServices.js";

export const servicesRouter = Router();

// Public: services shown on a published company profile (by public listing id).
servicesRouter.get("/public/:listingId", servicesController.listPublic);

// Signed-in company: manage its own services.
servicesRouter.get("/", requireCompanyServicesAccess, servicesController.list);
servicesRouter.post("/", requireCompanyServicesAccess, validateServicesCreate, servicesController.create);
servicesRouter.get("/:id", requireCompanyServicesAccess, servicesController.getOne);
servicesRouter.put("/:id", requireCompanyServicesAccess, validateServicesUpdate, servicesController.update);
servicesRouter.patch("/:id", requireCompanyServicesAccess, validateServicesUpdate, servicesController.update);
servicesRouter.delete("/:id", requireCompanyServicesAccess, servicesController.remove);
