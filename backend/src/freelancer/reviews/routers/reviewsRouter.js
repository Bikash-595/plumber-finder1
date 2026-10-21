import { Router } from "express";
import { reviewsController } from "../controllers/reviewsController.js";
import { requireFreelancerReviewsAccess } from "../middleware/reviewsAuth.js";
import { validateReviewsCreate, validateReviewsUpdate } from "../middleware/validateReviews.js";

export const reviewsRouter = Router();

// Public: reviews shown on a published freelancer profile (by public listing id).
reviewsRouter.get("/public/:listingId", reviewsController.listPublic);

// Signed-in freelancer: manage its own reviews.
reviewsRouter.get("/", requireFreelancerReviewsAccess, reviewsController.list);
reviewsRouter.post("/", requireFreelancerReviewsAccess, validateReviewsCreate, reviewsController.create);
reviewsRouter.get("/:id", requireFreelancerReviewsAccess, reviewsController.getOne);
reviewsRouter.put("/:id", requireFreelancerReviewsAccess, validateReviewsUpdate, reviewsController.update);
reviewsRouter.patch("/:id", requireFreelancerReviewsAccess, validateReviewsUpdate, reviewsController.update);
reviewsRouter.delete("/:id", requireFreelancerReviewsAccess, reviewsController.remove);
