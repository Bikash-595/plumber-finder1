import { Router } from "express";
import { freelancerReviewsController as reviews } from "../controllers/reviewsController.js";
import { requireFreelancerReviewsAccess } from "../middleware/reviewsAuth.js";

// Mounted at /api/freelancers/reviews. No Google routes: freelancers don't have Google reviews.
export const freelancerReviewsRouter = Router();
freelancerReviewsRouter.use(requireFreelancerReviewsAccess);
freelancerReviewsRouter.get("/", reviews.list);
freelancerReviewsRouter.get("/unanswered", reviews.unanswered);
freelancerReviewsRouter.post("/:id/reply", reviews.findMine, reviews.reply);
freelancerReviewsRouter.put("/:id/reply", reviews.findMine, reviews.reply);
freelancerReviewsRouter.delete("/:id/reply", reviews.findMine, reviews.removeReply);
freelancerReviewsRouter.post("/:id/report", reviews.findMine, reviews.report);
