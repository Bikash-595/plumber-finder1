import { Router } from "express";
import { reviewsController } from "../controllers/reviewsController.js";
import { requireCompanyReviewsAccess } from "../middleware/reviewsAuth.js";
import { validateReviewsCreate, validateReviewsUpdate } from "../middleware/validateReviews.js";

export const reviewsRouter = Router();

// Public: reviews shown on a published company profile (by public listing id).
reviewsRouter.get("/public/:listingId", reviewsController.listPublic);

// Signed-in company: manage its own reviews.
reviewsRouter.get("/", requireCompanyReviewsAccess, reviewsController.list);
reviewsRouter.post("/", requireCompanyReviewsAccess, validateReviewsCreate, reviewsController.create);
reviewsRouter.get("/:id", requireCompanyReviewsAccess, reviewsController.getOne);
reviewsRouter.put("/:id", requireCompanyReviewsAccess, validateReviewsUpdate, reviewsController.update);
reviewsRouter.patch("/:id", requireCompanyReviewsAccess, validateReviewsUpdate, reviewsController.update);
reviewsRouter.delete("/:id", requireCompanyReviewsAccess, reviewsController.remove);
