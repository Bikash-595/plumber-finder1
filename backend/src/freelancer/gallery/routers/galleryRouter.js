import { Router } from "express";
import { galleryController } from "../controllers/galleryController.js";
import { requireFreelancerGalleryAccess } from "../middleware/galleryAuth.js";
import { validateGalleryCreate, validateGalleryUpdate } from "../middleware/validateGallery.js";

export const galleryRouter = Router();

// Public: gallery items shown on a published freelancer profile (by public listing id).
galleryRouter.get("/public/:listingId", galleryController.listPublic);

// Signed-in freelancer: manage its own gallery items.
galleryRouter.get("/", requireFreelancerGalleryAccess, galleryController.list);
galleryRouter.post("/", requireFreelancerGalleryAccess, validateGalleryCreate, galleryController.create);
galleryRouter.get("/:id", requireFreelancerGalleryAccess, galleryController.getOne);
galleryRouter.put("/:id", requireFreelancerGalleryAccess, validateGalleryUpdate, galleryController.update);
galleryRouter.patch("/:id", requireFreelancerGalleryAccess, validateGalleryUpdate, galleryController.update);
galleryRouter.delete("/:id", requireFreelancerGalleryAccess, galleryController.remove);
