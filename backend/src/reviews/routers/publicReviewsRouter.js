import mongoose from "mongoose";
import { Router } from "express";
import { UserBooking } from "../../user/bookings/models/UserBooking.js";
import { googleAllowed, limits, REVIEW_SOURCES, SERVICE_CATEGORIES } from "../config/reviewsConfig.js";
import { googleSummary } from "../google/sync.js";
import { findProvider, optionalAuth } from "../middleware/reviewAuth.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { CustomerReview, GoogleBusinessLink } from "../models/index.js";
import { present, presentForAuthor } from "../services/present.js";
import { reportReview } from "../services/reports.js";
import { reviewStats } from "../services/stats.js";

// Mounted at /api/reviews — what anyone can read on a plumber's profile. Customers write and edit their
// reviews under /api/users/reviews; plumbers manage theirs under /api/companies|freelancers/reviews.
export const publicReviewsRouter = Router();

const sorts = { newest: { createdAt: -1 }, highest: { rating: -1, createdAt: -1 }, lowest: { rating: 1, createdAt: -1 } };

/** For a signed-in customer: their reviews of this plumber and the completed bookings they can still review. */
async function viewerState(viewer, type, id) {
  if (viewer?.accountType !== "user") return { signedIn: Boolean(viewer), accountType: viewer?.accountType ?? null, canReview: false, directoryReview: null, verifiedReviews: [], eligibleBookings: [] };
  const [mine, completed] = await Promise.all([
    CustomerReview.find({ providerType: type, providerId: id, user: viewer.sub }).sort({ createdAt: -1 }).lean(),
    UserBooking.find({ user: viewer.sub, providerType: type, providerId: id, status: "completed" }).sort({ completedAt: -1 }).limit(20).select("reference service completedAt").lean(),
  ]);
  const reviewed = new Set(mine.filter((review) => review.booking).map((review) => String(review.booking)));
  const directory = mine.find((review) => (review.source ?? "directory") === "directory");
  return {
    signedIn: true, accountType: "user", canReview: true,
    directoryReview: directory ? presentForAuthor(directory) : null,
    verifiedReviews: mine.filter((review) => review.source === "verified_booking").map(presentForAuthor),
    eligibleBookings: completed.filter((booking) => !reviewed.has(String(booking._id))).map((booking) => ({ _id: booking._id, reference: booking.reference, service: booking.service, completedAt: booking.completedAt })),
  };
}

// GET /:type/:id?source=directory|verified_booking&rating=1-5&sort=&page= — published PlumberFinder reviews,
// stats per source, and (signed in) what the visitor can do.
publicReviewsRouter.get("/:type/:id", findProvider, async (req, res, next) => {
  try {
    const viewer = optionalAuth(req);
    const { type, id } = req.params;
    const rating = Number(req.query.rating);
    const filter = { providerType: type, providerId: id, status: "published", ...(REVIEW_SOURCES.includes(req.query.source) ? { source: req.query.source } : {}), ...([1, 2, 3, 4, 5].includes(rating) ? { rating } : {}) };
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const [stats, items, total, viewerInfo] = await Promise.all([
      reviewStats(type, id),
      CustomerReview.find(filter).sort(sorts[req.query.sort] ?? sorts.newest).skip((page - 1) * limits.pageSize).limit(limits.pageSize).lean(),
      CustomerReview.countDocuments(filter),
      viewerState(viewer, type, id),
    ]);
    res.json({ data: items.map((item) => present(item, viewer)), page, limit: limits.pageSize, total, stats, summary: stats.platform, viewer: viewerInfo, googleEnabled: googleAllowed(type), categories: SERVICE_CATEGORIES });
  } catch (error) { next(error); }
});

// GET /company/:id/google — the company's Google rating and reviews (when connected). Freelancers have none.
publicReviewsRouter.get("/:type/:id/google", findProvider, async (req, res, next) => {
  try {
    if (!googleAllowed(req.params.type)) return res.status(404).json({ message: "Google reviews are only available for companies." });
    const link = req.provider.account ? await GoogleBusinessLink.findOne({ providerType: "company", providerAccount: req.provider.account }) : null;
    res.json({ data: await googleSummary(link) });
  } catch (error) { next(error); }
});

// POST /item/:reviewId/report { reason, details } — any signed-in account.
publicReviewsRouter.post("/item/:reviewId/report", rateLimit({ windowMs: 10 * 60 * 1000, max: 20, message: "Too many reports. Please try again later." }), async (req, res, next) => {
  try {
    const viewer = optionalAuth(req);
    if (!viewer || !["user", "company", "freelancer"].includes(viewer.accountType)) return res.status(401).json({ message: "Please log in to report a review." });
    const review = mongoose.isValidObjectId(req.params.reviewId) ? await CustomerReview.findOne({ _id: req.params.reviewId, status: "published" }) : null;
    if (!review) return res.status(404).json({ message: "Review not found." });
    await reportReview(req, res, review, { type: viewer.accountType, id: viewer.sub });
  } catch (error) { next(error); }
});
