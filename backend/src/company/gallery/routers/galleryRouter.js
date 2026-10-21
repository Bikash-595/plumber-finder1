import { Router } from "express";
import { galleryController } from "../controllers/galleryController.js";
import { requireCompanyGalleryAccess } from "../middleware/galleryAuth.js";
import { validateGalleryCreate, validateGalleryUpdate } from "../middleware/validateGallery.js";

export const galleryRouter = Router();

// Public: gallery items shown on a published company profile (by public listing id).
galleryRouter.get("/public/:listingId", galleryController.listPublic);

// Signed-in company: manage its own gallery items.
galleryRouter.get("/", requireCompanyGalleryAccess, galleryController.list);
galleryRouter.post("/", requireCompanyGalleryAccess, validateGalleryCreate, galleryController.create);
galleryRouter.get("/:id", requireCompanyGalleryAccess, galleryController.getOne);
galleryRouter.put("/:id", requireCompanyGalleryAccess, validateGalleryUpdate, galleryController.update);
galleryRouter.patch("/:id", requireCompanyGalleryAccess, validateGalleryUpdate, galleryController.update);
galleryRouter.delete("/:id", requireCompanyGalleryAccess, galleryController.remove);
