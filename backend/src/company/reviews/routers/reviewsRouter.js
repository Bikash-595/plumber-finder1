import { Router } from "express";
import { googleController } from "../controllers/googleController.js";
import { companyReviewsController as reviews } from "../controllers/reviewsController.js";
import { requireCompanyReviewsAccess } from "../middleware/reviewsAuth.js";
import { validateGoogleLink } from "../middleware/validateGoogle.js";

// Mounted at /api/companies/reviews.
export const companyReviewsRouter = Router();
// Google redirects the owner's browser here (no token), so it comes before the sign-in check; `state` proves who it is.
companyReviewsRouter.get("/google/oauth/callback", googleController.oauthCallback);
companyReviewsRouter.use(requireCompanyReviewsAccess);

// Google Business Profile (companies only)
companyReviewsRouter.get("/google", googleController.status);
companyReviewsRouter.put("/google", validateGoogleLink, googleController.save);
companyReviewsRouter.delete("/google", googleController.remove);
companyReviewsRouter.get("/google/matches", googleController.matches);
companyReviewsRouter.post("/google/search", googleController.search);
companyReviewsRouter.post("/google/connect", googleController.connect);
companyReviewsRouter.post("/google/refresh", googleController.refresh);
companyReviewsRouter.post("/google/oauth", googleController.oauthStart);
companyReviewsRouter.delete("/google/oauth", googleController.oauthDisconnect);

// PlumberFinder reviews (directory + verified customers)
companyReviewsRouter.get("/", reviews.list);
companyReviewsRouter.get("/unanswered", reviews.unanswered);
companyReviewsRouter.post("/:id/reply", reviews.findMine, reviews.reply);
companyReviewsRouter.put("/:id/reply", reviews.findMine, reviews.reply);
companyReviewsRouter.delete("/:id/reply", reviews.findMine, reviews.removeReply);
companyReviewsRouter.post("/:id/report", reviews.findMine, reviews.report);
