import { Router } from "express";
import { specialOffersController } from "../controllers/specialOffersController.js";
import { requireFreelancerSpecialOffersAccess } from "../middleware/specialOffersAuth.js";
import { validateSpecialOffersCreate, validateSpecialOffersUpdate } from "../middleware/validateSpecialOffers.js";

export const specialOffersRouter = Router();

// Public: special offers shown on a published freelancer profile (by public listing id).
specialOffersRouter.get("/public/:listingId", specialOffersController.listPublic);

// Signed-in freelancer: manage its own special offers.
specialOffersRouter.get("/", requireFreelancerSpecialOffersAccess, specialOffersController.list);
specialOffersRouter.post("/", requireFreelancerSpecialOffersAccess, validateSpecialOffersCreate, specialOffersController.create);
specialOffersRouter.get("/:id", requireFreelancerSpecialOffersAccess, specialOffersController.getOne);
specialOffersRouter.put("/:id", requireFreelancerSpecialOffersAccess, validateSpecialOffersUpdate, specialOffersController.update);
specialOffersRouter.patch("/:id", requireFreelancerSpecialOffersAccess, validateSpecialOffersUpdate, specialOffersController.update);
specialOffersRouter.delete("/:id", requireFreelancerSpecialOffersAccess, specialOffersController.remove);
