import mongoose from "mongoose";
import { CustomerReview, ReviewAudit, ReviewReport, ReviewRequest } from "../../../reviews/models/index.js";
import { audit } from "../../../reviews/services/audit.js";
import { moderationDecision, newReviewForProvider } from "../../../reviews/services/events.js";
import { pagination, searchFilter } from "../../shared/listQuery.js";
import { adminReviewsConfig as config } from "../config/reviewsConfig.js";

const validDate = (value) => { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date : null; };

/** GET /api/admin/reviews?status=pending|published|hidden|rejected|reported&source=&providerType=&providerId=&rating=&from=&to=&search=&page= */
export async function listReviews(req, res, next) {
  try {
    const q = req.query;
    const rating = Number(q.rating);
    const from = validDate(q.from);
    const to = validDate(q.to);
    const filter = {
      ...(config.statuses.includes(q.status) ? { status: q.status } : q.status === "reported" ? { reportCount: { $gt: 0 } } : {}),
      ...(config.sources.includes(q.source) ? { source: q.source } : {}),
      ...(config.providerTypes.includes(q.providerType) ? { providerType: q.providerType } : {}),
      ...(typeof q.providerId === "string" && q.providerId ? { providerId: q.providerId.slice(0, 64) } : {}),
      ...([1, 2, 3, 4, 5].includes(rating) ? { rating } : {}),
      ...(from || to ? { createdAt: { ...(from ? { $gte: from } : {}), ...(to ? { $lte: new Date(to.getTime() + 864e5 - 1) } : {}) } } : {}),
      ...searchFilter(q.search, ["title", "body", "userName", "providerName", "bookingReference"]),
    };
    const { page, limit, skip } = pagination(q);
    const [items, total, counts, reported] = await Promise.all([
      CustomerReview.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate("user", "name email").lean(),
      CustomerReview.countDocuments(filter),
      CustomerReview.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      CustomerReview.countDocuments({ reportCount: { $gt: 0 }, status: { $ne: "hidden" } }),
    ]);
    const reports = await ReviewReport.find({ review: { $in: items.map((item) => item._id) } }).sort({ createdAt: -1 }).lean();
    res.json({
      data: items.map((item) => ({ ...item, source: item.source ?? "directory", reports: reports.filter((r) => String(r.review) === String(item._id)).map((r) => ({ reason: r.reason, details: r.details, by: r.reporter.type, at: r.createdAt, resolved: r.resolved })) })),
      page, limit, total,
      counts: { ...Object.fromEntries(config.statuses.map((name) => [name, counts.find((row) => row._id === name)?.count ?? 0])), reported },
    });
  } catch (error) { next(error); }
}

/** GET /api/admin/reviews/:id/history — every change (audit log), the reports, and the review requests for its booking. */
export async function reviewHistory(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Review not found." });
    const [review, audits, reports] = await Promise.all([
      CustomerReview.findById(req.params.id).lean(),
      ReviewAudit.find({ review: req.params.id }).sort({ createdAt: 1 }).lean(),
      ReviewReport.find({ review: req.params.id }).sort({ createdAt: 1 }).lean(),
    ]);
    if (!review && !audits.length) return res.status(404).json({ message: "Review not found." });
    const requests = review?.booking ? await ReviewRequest.find({ booking: review.booking }).sort({ scheduledAt: 1 }).select("kind status scheduledAt sentAt attemptCount emailed cancelReason lastError").lean() : [];
    res.json({ data: { review, audits, reports, requests } });
  } catch (error) { next(error); }
}

/** PATCH /api/admin/reviews/:id { status: published|hidden|rejected, reason } — logged and sent to the reviewer. */
export async function moderateReview(req, res, next) {
  try {
    const { status, reason } = req.validated;
    if (status !== "published" && !reason) return res.status(400).json({ message: "Give a reason — the reviewer will see it.", errors: { reason: "is required" } });
    const review = mongoose.isValidObjectId(req.params.id) ? await CustomerReview.findById(req.params.id) : null;
    if (!review) return res.status(404).json({ message: "Review not found." });
    if (status === "rejected" && review.status !== "pending") return res.status(409).json({ message: "Only reviews held for moderation can be rejected. Hide a published review instead." });
    if (review.status === status) return res.status(409).json({ message: `This review is already ${status}.` });
    const from = review.status;
    review.status = status;
    review.moderation = { reason: reason || (status === "published" ? "Approved by a moderator" : "Removed by a moderator"), by: "admin", at: new Date() };
    await review.save();
    await Promise.all([
      audit(review, status, { type: "admin", id: req.auth.sub }, { fromStatus: from, toStatus: status, reason: review.moderation.reason }),
      ReviewReport.updateMany({ review: review._id, resolved: false }, { $set: { resolved: true, adminAction: `${status}: ${review.moderation.reason}` } }),
      moderationDecision(review, status, reason),
      // A review first published by a moderator is new to the plumber.
      from === "pending" && status === "published" ? newReviewForProvider(review) : null,
    ]);
    const words = { published: "Review published.", hidden: "Review hidden.", rejected: "Review rejected." };
    res.json({ message: words[status], data: review });
  } catch (error) { next(error); }
}
