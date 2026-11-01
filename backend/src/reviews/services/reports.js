import { limits, REPORT_REASONS } from "../config/reviewsConfig.js";
import { CustomerReview, ReviewReport } from "../models/index.js";
import { audit } from "./audit.js";
import { heldForAdmins, reportedForAdmins } from "./events.js";

/**
 * Anyone signed in (customer, company, freelancer) can report a published review once. Admins hear about the
 * first report; enough reports from different people hold the review until a moderator looks at it.
 */
export async function reportReview(req, res, review, reporter) {
  const reason = REPORT_REASONS.includes(req.body?.reason) ? req.body.reason : null;
  if (!reason) return res.status(400).json({ message: "Choose why you're reporting this review." });
  if (reporter.type === "user" && String(review.user) === String(reporter.id)) return res.status(400).json({ message: "You can't report your own review." });
  try {
    await ReviewReport.create({ review: review._id, reporter, reason, details: typeof req.body?.details === "string" ? req.body.details.trim().slice(0, 500) : undefined });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "You've already reported this review." });
    throw error;
  }
  const updated = await CustomerReview.findByIdAndUpdate(review._id, { $inc: { reportCount: 1 } }, { new: true });
  await audit(updated, "reported", reporter, { reason });
  if (updated.reportCount === 1) await reportedForAdmins(updated, reason);
  if (updated.reportCount >= limits.holdAfterReports && updated.status === "published") {
    const why = `Reported ${updated.reportCount} times`;
    Object.assign(updated, { status: "pending", moderation: { reason: why, by: "system", at: new Date() } });
    await updated.save();
    await Promise.all([audit(updated, "held", { type: "system" }, { fromStatus: "published", toStatus: "pending", reason: why }), heldForAdmins(updated, why)]);
  }
  return res.status(201).json({ message: "Thanks — our team will look at this review." });
}
