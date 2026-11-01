import mongoose from "mongoose";
import { pagination, searchFilter } from "../../admin/shared/listQuery.js";
import { limits, REVIEW_SOURCES, REVIEW_STATUSES } from "../config/reviewsConfig.js";
import { CustomerReview, ReviewReport } from "../models/index.js";
import { audit } from "./audit.js";
import { replyForCustomer } from "./events.js";
import { present } from "./present.js";
import { reportReview } from "./reports.js";
import { reviewStatsForAccount } from "./stats.js";

const sorts = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, highest: { rating: -1, createdAt: -1 }, lowest: { rating: 1, createdAt: -1 } };
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * A company's or freelancer's review inbox (used by company/reviews and freelancer/reviews): every review about
 * them with its status, stats per source, public replies and reporting. Providers can never change a rating
 * or a customer's words — only their own reply.
 */
export function createProviderReviewsController(providerType) {
  const mine = (req) => ({ providerType, providerAccount: new mongoose.Types.ObjectId(String(req.auth.sub)) });
  const actor = (req) => ({ type: providerType, id: req.auth.sub });

  const findMine = async (req, res, next) => {
    try {
      req.review = mongoose.isValidObjectId(req.params.id) ? await CustomerReview.findOne({ ...mine(req), _id: req.params.id }) : null;
      if (!req.review) return res.status(404).json({ message: "Review not found." });
      next();
    } catch (error) { next(error); }
  };

  // GET /?source=&status=&rating=&unanswered=true&search=&sort=&page=
  const list = async (req, res, next) => {
    try {
      const owner = mine(req);
      const rating = Number(req.query.rating);
      const filter = {
        ...owner,
        ...(REVIEW_STATUSES.includes(req.query.status) ? { status: req.query.status } : {}),
        ...(REVIEW_SOURCES.includes(req.query.source) ? { source: req.query.source } : {}),
        ...([1, 2, 3, 4, 5].includes(rating) ? { rating } : {}),
        ...(req.query.unanswered === "true" || req.unansweredOnly ? { status: "published", "reply.body": { $exists: false } } : {}),
        ...searchFilter(req.query.search, ["title", "body", "userName", "serviceCategory", "bookingReference"]),
      };
      const { page, limit, skip } = pagination(req.query);
      const [items, total, stats, byStatus, unanswered, newThisWeek, reported, listing] = await Promise.all([
        CustomerReview.find(filter).sort(sorts[req.query.sort] ?? sorts.newest).skip(skip).limit(limit).lean(),
        CustomerReview.countDocuments(filter),
        reviewStatsForAccount(providerType, owner.providerAccount),
        CustomerReview.aggregate([{ $match: owner }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
        CustomerReview.countDocuments({ ...owner, status: "published", "reply.body": { $exists: false } }),
        CustomerReview.countDocuments({ ...owner, status: "published", createdAt: { $gt: new Date(Date.now() - WEEK_MS) } }),
        CustomerReview.countDocuments({ ...owner, reportCount: { $gt: 0 } }),
        CustomerReview.findOne(owner).select("providerId").lean(),
      ]);
      const reports = await ReviewReport.aggregate([{ $match: { review: { $in: items.map((item) => item._id) } } }, { $group: { _id: "$review", reasons: { $addToSet: "$reason" } } }]);
      const reasons = new Map(reports.map((row) => [String(row._id), row.reasons]));
      res.json({
        data: items.map((item) => ({ ...present(item), author: { name: item.userName }, status: item.status, moderation: item.moderation, reportCount: item.reportCount, reportReasons: reasons.get(String(item._id)) ?? [], bookingReference: item.bookingReference ?? null })),
        page, limit, total,
        summary: {
          ...stats,
          byStatus: Object.fromEntries(REVIEW_STATUSES.map((name) => [name, byStatus.find((row) => row._id === name)?.count ?? 0])),
          unanswered, newThisWeek, reported,
        },
        listingId: listing?.providerId ?? null,
      });
    } catch (error) { next(error); }
  };

  // POST /:id/reply (first reply) and PUT /:id/reply (edit) { body } — shown publicly under the review.
  const reply = async (req, res, next) => {
    try {
      const { review } = req;
      if (review.status !== "published") return res.status(409).json({ message: "You can reply once the review is published." });
      const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
      if (body.length < 2) return res.status(400).json({ message: "Write a reply first." });
      if (body.length > limits.replyMaxLength) return res.status(400).json({ message: `Replies can be up to ${limits.replyMaxLength} characters.` });
      const first = !review.reply?.body;
      review.reply = { body, createdAt: review.reply?.createdAt ?? new Date(), updatedAt: new Date() };
      await review.save();
      await audit(review, "reply", actor(req), { reason: first ? "Reply posted" : "Reply edited" });
      if (first) await replyForCustomer(review, body);
      res.status(first ? 201 : 200).json({ message: first ? "Reply posted. The customer has been notified." : "Reply updated.", data: review.reply });
    } catch (error) { next(error); }
  };

  const removeReply = async (req, res, next) => {
    try {
      req.review.reply = undefined;
      await req.review.save();
      await audit(req.review, "reply_deleted", actor(req));
      res.json({ message: "Reply deleted." });
    } catch (error) { next(error); }
  };

  const report = async (req, res, next) => {
    try { await reportReview(req, res, req.review, actor(req)); } catch (error) { next(error); }
  };

  /** GET /unanswered — published reviews still waiting for a reply. */
  const unanswered = (req, res, next) => { req.unansweredOnly = true; return list(req, res, next); };

  return { findMine, list, unanswered, reply, removeReply, report };
}
