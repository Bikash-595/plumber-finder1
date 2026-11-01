import { Router } from "express";
import { reviewsController } from "../controllers/reviewsController.js";
import { requireReviewsAccess } from "../middleware/reviewsAuth.js";
import { limitReviewWrites, validateReviewCreate, validateReviewUpdate } from "../middleware/validateReviews.js";

// Mounted at /api/users/reviews — the signed-in customer's reviews.
export const reviewsRouter = Router();
reviewsRouter.use(requireReviewsAccess);
reviewsRouter.get("/", reviewsController.list);
reviewsRouter.get("/eligible", reviewsController.eligible);
reviewsRouter.get("/requests", reviewsController.requests);
reviewsRouter.post("/", limitReviewWrites, validateReviewCreate, reviewsController.create);
reviewsRouter.patch("/:id", limitReviewWrites, validateReviewUpdate, reviewsController.update);
reviewsRouter.delete("/:id", reviewsController.remove);
