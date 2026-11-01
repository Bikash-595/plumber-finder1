import { sendMail } from "../../auth/verification/services/mailer.js";
import { notifyAdmins, notifyProvider } from "../../shared/notifications/AccountNotification.js";
import { emailProvider } from "../../shared/notifications/providerEmail.js";
import { UserSettings } from "../../user/settings/models/UserSettings.js";
import { User } from "../../auth/user/models/User.js";
import { notify as notifyCustomer } from "../../user/notifications/services/notify.js";

// Everyone who hears about review events, in one place: customers (in-app + email when they allow it),
// plumbers and admins (in-app).

export const siteUrl = () => (process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim();
export const providerReviewsPath = { company: "/company-dashboard/business-profile/reviews", freelancer: "/freelancer/business-profile/reviews" };
export const profileReviewsPath = (providerId, bookingId) => `/plumber/${providerId}${bookingId ? `?review=${bookingId}` : ""}#reviews`;

/** True unless the customer turned email notifications off in Settings. */
export async function emailAllowed(userId) {
  const settings = await UserSettings.findOne({ user: userId }).select("emailNotifications").lean();
  return settings?.emailNotifications !== false;
}

/** Emails a customer if they allow it. Resolves to true when an email was handed to the mailer. */
export async function emailCustomer(userId, subject, lines) {
  if (!(await emailAllowed(userId))) return false;
  const user = await User.findById(userId).select("email").lean();
  if (!user?.email) return false;
  await sendMail({ to: user.email, subject, text: [...lines, "", "— Plumber Finder"].join("\n") });
  return true;
}

export function newReviewForProvider(review) {
  if (!review.providerAccount) return null;
  const verified = review.source === "verified_booking" ? "verified customer " : "";
  const title = `New ${review.rating}★ ${verified}review`;
  const message = `${review.userName ?? "A customer"} reviewed you${review.title ? `: “${review.title}”` : "."}`;
  return Promise.all([
    notifyProvider(review.providerType, review.providerAccount, { type: "review", title, message, link: providerReviewsPath[review.providerType] }),
    emailProvider(review.providerType, review.providerAccount, "emailNewReview", title, [message, "", `Read and reply: ${siteUrl()}${providerReviewsPath[review.providerType]}`]),
  ]);
}

export const replyForCustomer = (review, body) => notifyCustomer(review.user, { type: "review", title: `${review.providerName ?? "The plumber"} replied to your review`, message: body.length > 140 ? `${body.slice(0, 137)}…` : body, link: profileReviewsPath(review.providerId) });

export const heldForAdmins = (review, reason) => notifyAdmins({ type: "review", title: "Review held for moderation", message: `${review.userName ?? "A customer"}'s review of ${review.providerName ?? "a plumber"} needs a check: ${reason}.`, link: `/reviews?status=pending&review=${review._id}` });

export const reportedForAdmins = (review, reason) => notifyAdmins({ type: "review", title: "Review reported", message: `A review of ${review.providerName ?? "a plumber"} was reported (${reason.replace("_", " ")}).`, link: `/reviews?status=reported&review=${review._id}` });

/** Tells the reviewer what moderators decided (and the plumber when their review comes back or goes). */
export function moderationDecision(review, status, reason) {
  const words = { published: "is live again", hidden: "was hidden by our moderators", rejected: "wasn't published" };
  const tasks = [notifyCustomer(review.user, { type: "review", title: `Your review of ${review.providerName ?? "a plumber"} ${words[status]}`, message: reason ? `Reason: ${reason}` : undefined, link: "/dashboard/reviews" })];
  if (review.providerAccount && (status === "hidden" || status === "published")) {
    tasks.push(notifyProvider(review.providerType, review.providerAccount, { type: "review", title: status === "hidden" ? "A review was removed by moderators" : "A review was published after a check", message: `${review.userName ?? "A customer"}'s ${review.rating}★ review.`, link: providerReviewsPath[review.providerType] }));
  }
  return Promise.all(tasks);
}
