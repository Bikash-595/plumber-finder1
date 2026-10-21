import { Router } from "express";
import { specialOffersController } from "../controllers/specialOffersController.js";
import { requireCompanySpecialOffersAccess } from "../middleware/specialOffersAuth.js";
import { validateSpecialOffersCreate, validateSpecialOffersUpdate } from "../middleware/validateSpecialOffers.js";

export const specialOffersRouter = Router();

// Public: special offers shown on a published company profile (by public listing id).
specialOffersRouter.get("/public/:listingId", specialOffersController.listPublic);

// Signed-in company: manage its own special offers.
specialOffersRouter.get("/", requireCompanySpecialOffersAccess, specialOffersController.list);
specialOffersRouter.post("/", requireCompanySpecialOffersAccess, validateSpecialOffersCreate, specialOffersController.create);
specialOffersRouter.get("/:id", requireCompanySpecialOffersAccess, specialOffersController.getOne);
specialOffersRouter.put("/:id", requireCompanySpecialOffersAccess, validateSpecialOffersUpdate, specialOffersController.update);
specialOffersRouter.patch("/:id", requireCompanySpecialOffersAccess, validateSpecialOffersUpdate, specialOffersController.update);
specialOffersRouter.delete("/:id", requireCompanySpecialOffersAccess, specialOffersController.remove);
