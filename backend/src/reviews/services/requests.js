import { CustomerReview, ReviewRequest } from "../models/index.js";
import { notify as notifyCustomer } from "../../user/notifications/services/notify.js";
import { reviewRequestSchedule } from "../config/reviewsConfig.js";
import { emailCustomer, profileReviewsPath, siteUrl } from "./events.js";

// Review requests for completed bookings: "How was your plumber?" straight away, then reminders after 24 and
// 72 hours. Rows are created once per booking and kind (unique idempotency key), claimed atomically before
// sending, and cancelled as soon as the customer reviews or the booking is disputed or cancelled.

const MAX_ATTEMPTS = 3;
const STALE_CLAIM_MS = 10 * 60 * 1000;

/** Creates the request and its reminders for a booking that just became completed (safe to call twice). */
export async function scheduleReviewRequests(booking, now = new Date()) {
  if (await CustomerReview.exists({ booking: booking._id })) return 0;
  const rows = reviewRequestSchedule.map(({ kind, afterMs }) => ({
    booking: booking._id, user: booking.user, providerType: booking.providerType, providerId: booking.providerId,
    providerAccount: booking.providerAccount ?? null, providerName: booking.providerName, kind,
    scheduledAt: new Date(now.getTime() + afterMs), idempotencyKey: `${booking._id}:${kind}`,
  }));
  try {
    const created = await ReviewRequest.insertMany(rows, { ordered: false });
    return created.length;
  } catch (error) {
    if (error?.code === 11000 || error?.writeErrors) return error.insertedDocs?.length ?? 0; // already scheduled
    throw error;
  }
}

/** Stops whatever hasn't been sent yet for a booking. */
export const cancelReviewRequests = (bookingId, reason) => ReviewRequest.updateMany({ booking: bookingId, status: { $in: ["scheduled", "failed"] } }, { $set: { status: "cancelled", cancelReason: reason } });

function message(request) {
  const company = request.providerType === "company";
  const name = request.providerName ?? "your plumber";
  if (request.kind === "request") {
    return company
      ? { title: "Your plumbing service is completed!", text: `Your job with ${name} has been marked as completed. How was your experience? Share your feedback and help other customers choose the right plumbing service.` }
      : { title: "How was your experience with your plumber?", text: `Your job with ${name} has been completed. Please share your experience.` };
  }
  return { title: `Reminder: how was ${name}?`, text: `You haven't reviewed your recent job with ${name} yet. It takes a minute and helps other customers.` };
}

async function send(request) {
  const { title, text } = message(request);
  const link = profileReviewsPath(request.providerId, request.booking);
  await notifyCustomer(request.user, { type: "review", title, message: text, link });
  // Email is best effort and only once per row, even if the in-app part is retried.
  if (!request.emailed) {
    const emailed = await emailCustomer(request.user, title, [text, "", `Write a review: ${siteUrl()}${link}`]).catch(() => false);
    if (emailed) await ReviewRequest.updateOne({ _id: request._id }, { $set: { emailed: true } });
  }
}

/** Scheduled job: sends every request/reminder that is due. Returns how many were sent. */
export async function processDueReviewRequests({ now = new Date(), batch = 50 } = {}) {
  let sent = 0;
  for (let i = 0; i < batch; i++) {
    // Claim one due row (or one left half-sent by a crashed run) so no other worker sends it too.
    const request = await ReviewRequest.findOneAndUpdate(
      { scheduledAt: { $lte: now }, $or: [{ status: "scheduled" }, { status: "sending", claimedAt: { $lt: new Date(now.getTime() - STALE_CLAIM_MS) } }] },
      { $set: { status: "sending", claimedAt: now }, $inc: { attemptCount: 1 } },
      { sort: { scheduledAt: 1 }, new: true },
    );
    if (!request) break;
    // Reviewed in the meantime: nothing to remind about.
    if (await CustomerReview.exists({ booking: request.booking })) {
      await cancelReviewRequests(request.booking, "reviewed");
      await ReviewRequest.updateOne({ _id: request._id }, { $set: { status: "cancelled", cancelReason: "reviewed" } });
      continue;
    }
    try {
      await send(request);
      await ReviewRequest.updateOne({ _id: request._id }, { $set: { status: "sent", sentAt: new Date() }, $unset: { lastError: 1 } });
      sent++;
    } catch (error) {
      await ReviewRequest.updateOne({ _id: request._id }, { $set: { status: request.attemptCount >= MAX_ATTEMPTS ? "failed" : "scheduled", lastError: String(error.message).slice(0, 300) } });
    }
  }
  return sent;
}
