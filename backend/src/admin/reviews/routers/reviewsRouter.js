import { Router } from "express";
import { listReviews, moderateReview, reviewHistory } from "../controllers/reviewsController.js";
import { requireReviewsAccess } from "../middleware/reviewsAuth.js";
import { validateModeration } from "../middleware/validateModeration.js";

// Mounted at /api/admin/reviews — moderation of every PlumberFinder review.
export const adminReviewsRouter = Router();
adminReviewsRouter.use(requireReviewsAccess);
adminReviewsRouter.get("/", listReviews);
adminReviewsRouter.get("/:id/history", reviewHistory);
adminReviewsRouter.patch("/:id", validateModeration, moderateReview);
