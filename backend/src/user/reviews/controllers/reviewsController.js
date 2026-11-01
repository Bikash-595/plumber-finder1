import mongoose from "mongoose";
import { resolveProvider } from "../../../activity/recordActivity.js";
import { User } from "../../../auth/user/models/User.js";
import { limits } from "../../../reviews/config/reviewsConfig.js";
import { CustomerReview, ReviewRequest } from "../../../reviews/models/index.js";
import { audit } from "../../../reviews/services/audit.js";
import { checkContent, duplicateFromOthers } from "../../../reviews/services/content.js";
import { heldForAdmins, newReviewForProvider } from "../../../reviews/services/events.js";
import { presentForAuthor } from "../../../reviews/services/present.js";
import { cancelReviewRequests } from "../../../reviews/services/requests.js";
import { UserBooking } from "../../bookings/models/UserBooking.js";
import { findPage, pageParams, toObjectId } from "../../shared/paginate.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const actorOf = (req) => ({ type: "user", id: req.auth.sub });

/** Completed bookings the customer hasn't reviewed yet (newest first). */
async function eligibleBookings(user, limit = 50) {
  const completed = await UserBooking.find({ user, status: "completed" }).sort({ completedAt: -1, _id: -1 }).limit(limit).select("reference providerType providerId providerName service completedAt").lean();
  const reviewed = await CustomerReview.find({ booking: { $in: completed.map((b) => b._id) } }).select("booking").lean();
  const done = new Set(reviewed.map((review) => String(review.booking)));
  return completed.filter((booking) => !done.has(String(booking._id)));
}

export const reviewsController = {
  // GET /?limit=&cursor= — the customer's reviews (every status), newest first.
  list: async (req, res, next) => {
    try {
      const { data, nextCursor } = await findPage(CustomerReview, { user: toObjectId(req.auth.sub) }, pageParams(req.query));
      res.json({ data: data.map(presentForAuthor), nextCursor });
    } catch (error) { next(error); }
  },

  // GET /eligible — completed bookings waiting for a verified review.
  eligible: async (req, res, next) => {
    try { res.json({ data: await eligibleBookings(req.auth.sub) }); } catch (error) { next(error); }
  },

  // GET /requests — review requests we've sent that are still unanswered (with when we asked).
  requests: async (req, res, next) => {
    try {
      const pending = await eligibleBookings(req.auth.sub);
      const asked = await ReviewRequest.aggregate([{ $match: { user: toObjectId(req.auth.sub), status: "sent", booking: { $in: pending.map((b) => b._id) } } }, { $group: { _id: "$booking", firstAsked: { $min: "$sentAt" }, reminders: { $sum: { $cond: [{ $eq: ["$kind", "request"] }, 0, 1] } } } }]);
      const byBooking = new Map(asked.map((row) => [String(row._id), row]));
      res.json({ data: pending.filter((b) => byBooking.has(String(b._id))).map((b) => ({ ...b, requestedAt: byBooking.get(String(b._id)).firstAsked, reminders: byBooking.get(String(b._id)).reminders })) });
    } catch (error) { next(error); }
  },

  // POST / { providerType, providerId, bookingId?, rating, title?, body, serviceCategory?, photos? }
  create: async (req, res, next) => {
    try {
      const user = req.auth.sub;
      const { bookingId, providerName: givenName, ...values } = req.validated;
      let { providerType, providerId } = values;
      delete values.providerType; delete values.providerId;
      const content = checkContent(values);
      if (content.error) return res.status(400).json({ message: content.error });

      // Verified review: the booking must be this customer's, completed, and not reviewed yet.
      let booking = null;
      if (bookingId) {
        booking = await UserBooking.findOne({ _id: bookingId, user }).select("reference status providerType providerId providerName providerAccount").lean();
        if (!booking) return res.status(404).json({ message: "That booking wasn't found on your account." });
        if (booking.providerType !== providerType || booking.providerId !== providerId) return res.status(400).json({ message: "That booking is with a different plumber." });
        if (booking.status !== "completed") return res.status(409).json({ message: "You can write a verified review once the job is completed and confirmed." });
        if (await CustomerReview.exists({ booking: booking._id })) return res.status(409).json({ message: "You've already reviewed this booking." });
        ({ providerType, providerId } = booking);
      } else if (await CustomerReview.exists({ providerType, providerId, user, source: "directory" })) {
        return res.status(409).json({ message: "You've already reviewed this plumber — edit your review instead." });
      }

      const provider = await resolveProvider(providerType, providerId);
      if (!provider && !booking) return res.status(404).json({ message: "That plumber is not available." });
      if (await CustomerReview.countDocuments({ user, createdAt: { $gt: new Date(Date.now() - DAY_MS) } }) >= limits.reviewsPerDay) return res.status(429).json({ message: "You've written several reviews today. Please try again tomorrow." });
      if (await CustomerReview.exists({ user, body: values.body.trim() })) return res.status(409).json({ message: "You've posted this exact review before. Please write about this plumber." });
      const hold = content.hold ?? ((await duplicateFromOthers(user, values.body)) ? "Same text as another customer's review" : null);

      const account = await User.findById(user).select("name").lean();
      let review;
      try {
        review = await CustomerReview.create({
          providerType, providerId, providerAccount: provider?.account ?? booking?.providerAccount ?? null,
          providerName: provider?.name ?? booking?.providerName ?? givenName,
          user, userName: account?.name ?? "Customer", ...values, photos: values.photos?.length ? values.photos : undefined,
          source: booking ? "verified_booking" : "directory", booking: booking?._id ?? null, bookingReference: booking?.reference,
          status: hold ? "pending" : "published", ...(hold ? { moderation: { reason: hold, by: "system", at: new Date() } } : {}),
        });
      } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ message: booking ? "You've already reviewed this booking." : "You've already reviewed this plumber." });
        throw error;
      }
      await audit(review, "created", actorOf(req), { toStatus: review.status, reason: hold ?? undefined });
      if (booking) await cancelReviewRequests(booking._id, "reviewed");
      if (review.status === "published") await newReviewForProvider(review);
      else await heldForAdmins(review, hold);
      res.status(201).json({ message: review.status === "pending" ? "Thanks! Your review will appear after a quick check." : "Thanks! Your review is live.", data: presentForAuthor(review.toObject()) });
    } catch (error) { next(error); }
  },

  // PATCH /:id — edit the customer's own review (rating, title, text, category, photos). The source and booking can't change.
  update: async (req, res, next) => {
    try {
      const review = mongoose.isValidObjectId(req.params.id) ? await CustomerReview.findOne({ _id: req.params.id, user: req.auth.sub }) : null;
      if (!review) return res.status(404).json({ message: "Review not found." });
      if (review.status === "hidden" || review.status === "rejected") return res.status(409).json({ message: "This review was removed by our moderators and can't be edited." });
      const values = req.validated;
      const content = checkContent(values);
      if (content.error) return res.status(400).json({ message: content.error });
      const from = review.status;
      Object.assign(review, values, { edited: true, editedAt: new Date() });
      if (values.photos && !values.photos.length) review.photos = undefined;
      if (content.hold) Object.assign(review, { status: "pending", moderation: { reason: content.hold, by: "system", at: new Date() } });
      await review.save();
      await audit(review, "edited", actorOf(req), { fromStatus: from, toStatus: review.status, reason: content.hold });
      if (content.hold && from === "published") await heldForAdmins(review, content.hold);
      res.json({ message: review.status === "pending" ? "Saved. Your changes will appear after a quick check." : "Review updated.", data: presentForAuthor(review.toObject()) });
    } catch (error) { next(error); }
  },

  // DELETE /:id — the review stops counting; the audit log keeps a copy for moderators.
  remove: async (req, res, next) => {
    try {
      const review = mongoose.isValidObjectId(req.params.id) ? await CustomerReview.findOne({ _id: req.params.id, user: req.auth.sub }) : null;
      if (!review) return res.status(404).json({ message: "Review not found." });
      await audit(review, "deleted", actorOf(req), { fromStatus: review.status });
      await review.deleteOne();
      res.json({ message: "Review deleted." });
    } catch (error) { next(error); }
  },
};
