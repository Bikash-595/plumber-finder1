import mongoose from "mongoose";
import { User } from "../../auth/user/models/User.js";
import { sendMail } from "../../auth/verification/services/mailer.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { notify as notifyCustomer } from "../../user/notifications/services/notify.js";
import { AccountNotification, notifyAdmins, notifyProvider } from "../notifications/AccountNotification.js";
import { emailProvider } from "../notifications/providerEmail.js";
import { recordActivity } from "../../activity/recordActivity.js";
import { AUTO_CONFIRM_AFTER_MS } from "../../reviews/config/reviewsConfig.js";
import { cancelReviewRequests, processDueReviewRequests, scheduleReviewRequests } from "../../reviews/services/requests.js";
import { UserBooking } from "../../user/bookings/models/UserBooking.js";
import { frontendUrl } from "../../config/urls.js";

// How a booking moves between customer, plumber (company or freelancer), admin and the system:
//   pending ──accept──▶ scheduled ──start──▶ in_progress ──mark done──▶ awaiting_confirmation
//      │                    │                                   │            │
//      │                    └────────────mark done──────────────┘            ├─customer confirms (or 7 days pass)─▶ completed ─▶ review requests
//      ├──decline──▶ declined                                                 └─customer disputes─▶ disputed ─admin─▶ completed | scheduled | cancelled
//      └──cancel──▶ cancelled (customer: pending/scheduled; plumber: scheduled/in_progress; admin: any open booking)
// Every change is added to the booking's history and announced to the other parties and to admins.

const listings = { company: { Model: CompanyListing, owner: "company" }, freelancer: { Model: FreelancerListing, owner: "freelancer" } };
export const providerBookingsPath = { company: "/company-dashboard/bookings", freelancer: "/freelancer/bookings" };
const siteUrl = frontendUrl;

export const statusLabels = { pending: "waiting for a reply", scheduled: "confirmed", in_progress: "in progress", awaiting_confirmation: "waiting for the customer to confirm", completed: "completed", disputed: "disputed", cancelled: "cancelled", declined: "declined" };
const verbs = { scheduled: "accepted", in_progress: "started", awaiting_confirmation: "marked as done", completed: "completed", disputed: "disputed", declined: "declined", cancelled: "cancelled" };

/** Which status changes each party may make. */
export const transitions = {
  provider: { pending: ["scheduled", "declined"], scheduled: ["in_progress", "awaiting_confirmation", "cancelled"], in_progress: ["awaiting_confirmation", "cancelled"] },
  customer: { pending: ["cancelled"], scheduled: ["cancelled"], awaiting_confirmation: ["completed", "disputed"] },
  admin: {
    pending: ["scheduled", "declined", "cancelled"], scheduled: ["in_progress", "completed", "cancelled"], in_progress: ["completed", "cancelled"],
    awaiting_confirmation: ["completed", "cancelled"], disputed: ["completed", "scheduled", "cancelled"],
  },
  system: { awaiting_confirmation: ["completed"] },
};
export const canMove = (by, from, to) => (transitions[by][from] ?? []).includes(to);

/** The company/freelancer account that owns a public listing (null for the site's sample plumbers). */
export async function resolveProviderAccount(providerType, providerId) {
  if (!listings[providerType] || !mongoose.isValidObjectId(providerId) || String(providerId).length !== 24) return null;
  const { Model, owner } = listings[providerType];
  const listing = await Model.findById(providerId).select(owner).lean();
  return listing?.[owner] ?? null;
}

/** Fields every new booking gets: who booked it, and which plumber account receives it. */
export async function newBookingFields(userId, providerType, providerId) {
  const [user, providerAccount] = await Promise.all([
    User.findById(userId).select("name email preferredContact contactTime language alternateContactName alternateContactPhone").lean(),
    resolveProviderAccount(providerType, providerId),
  ]);
  // How the customer likes to be contacted, as it was when they booked (set on their profile page).
  const customerContact = Object.fromEntries(Object.entries({
    preferredContact: user?.preferredContact, contactTime: user?.contactTime, language: user?.language,
    alternateName: user?.alternateContactName, alternatePhone: user?.alternateContactPhone,
  }).filter(([, value]) => value));
  return { customerName: user?.name, customerEmail: user?.email, providerAccount, ...(Object.keys(customerContact).length ? { customerContact } : {}) };
}

/**
 * Applies a status change to a booking document (the caller saves it). Accepting can set or change the
 * visit date and time. Returns an error message when the change isn't allowed.
 */
export function applyStatus(booking, { to, by, note, scheduledDate, timeSlot }) {
  if (!canMove(by, booking.status, to)) return `This booking is ${statusLabels[booking.status]} and can't be ${verbs[to] ?? to} now.`;
  const now = new Date();
  const from = booking.status;
  booking.status = to;
  if (to === "scheduled") {
    booking.acceptedAt = now;
    if (scheduledDate) booking.scheduledDate = scheduledDate;
    if (timeSlot) booking.timeSlot = timeSlot;
  }
  if (to === "declined") booking.declinedAt = now;
  if (to === "in_progress") booking.startedAt = now;
  if (to === "awaiting_confirmation") booking.completionRequestedAt = now;
  if (to === "completed") { booking.completedAt = now; booking.completionConfirmedBy = by === "provider" ? undefined : by; }
  if (to === "disputed") { booking.disputedAt = now; booking.disputeReason = note || undefined; }
  if (to === "scheduled" && from === "disputed") booking.completionRequestedAt = undefined; // sent back to the plumber
  if (to === "cancelled") { booking.cancelledAt = now; booking.cancelledBy = by; }
  if (by === "provider" || by === "admin") booking.responseNote = note || undefined;
  booking.history.push({ status: to, by, note: note || undefined, at: now });
  return null;
}

/** The customer's phone, email and address are shared with the plumber once the booking is accepted. */
export function forProvider(booking) {
  const value = typeof booking.toObject === "function" ? booking.toObject() : { ...booking };
  const contactVisible = Boolean(value.acceptedAt);
  if (!contactVisible) {
    delete value.phone; delete value.customerEmail; delete value.address;
    // Contact preferences are fine to see before accepting; the alternate person's details are not.
    if (value.customerContact) { const { alternateName, alternatePhone, ...preferences } = value.customerContact; value.customerContact = preferences; }
  }
  delete value.user;
  return { ...value, contactVisible };
}

const when = (booking) => {
  const date = booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) : "a flexible date";
  return booking.timeSlot ? `${date}, ${booking.timeSlot}` : date;
};
const withNote = (text, note) => (note ? `${text} Message: "${note}"` : text);

// Email is a courtesy on top of in-app notifications: a failure never blocks the booking.
function email(to, subject, lines) {
  if (!to) return;
  sendMail({ to, subject, text: [...lines, "", "— Plumber Finder"].join("\n") }).catch(() => undefined);
}

/**
 * Tells everyone else about a booking event: the customer (in-app + email for decisions), the plumber
 * (in-app + email for new requests), and admins (in-app). Checkout tells the customer once for the whole order
 * (`tellCustomer: false`).
 */
export async function announce(booking, event, by = "customer", { tellCustomer = true } = {}) {
  const id = String(booking._id);
  const ref = booking.reference;
  const customerLink = "/dashboard/bookings";
  const providerLink = `${providerBookingsPath[booking.providerType]}?booking=${id}`;
  const adminLink = `/bookings?booking=${id}`;
  const note = booking.responseNote;
  const toProvider = (notice) => booking.providerAccount && notifyProvider(booking.providerType, booking.providerAccount, { type: "booking", booking: booking._id, link: providerLink, ...notice });
  const toAdmins = (notice) => notifyAdmins({ type: "booking", booking: booking._id, link: adminLink, ...notice });
  const toCustomer = (notice) => notifyCustomer(booking.user, { type: "booking", link: customerLink, ...notice });
  const tasks = [];

  // A decision on the booking answers the plumber's "accept or decline" prompt.
  if (event !== "created") tasks.push(AccountNotification.updateMany({ booking: booking._id, actionRequired: true }, { $set: { actionRequired: false } }));

  if (event === "created") {
    // The plumber's activity record (admins see who booked whom, and when).
    tasks.push(recordActivity({ providerType: booking.providerType, providerId: booking.providerId, providerAccount: booking.providerAccount, providerName: booking.providerName, event: "booking", target: { id: id, title: booking.service }, actor: { type: "user", id: String(booking.user) } }));
    tasks.push(
      tellCustomer && toCustomer({ title: "Booking request sent", message: `Your request ${ref} for ${booking.service} was sent to ${booking.providerName}. You'll be notified when they accept it.` }),
      toProvider({ title: "New booking request", message: `${booking.customerName ?? "A customer"} wants ${booking.service} on ${when(booking)} (${ref})${booking.couponCode ? ` with coupon ${booking.couponCode} (${booking.couponLabel})` : ""}. Accept or decline it.`, actionRequired: true }),
      toAdmins({ title: "New booking", message: `${booking.customerName ?? "A customer"} booked ${booking.providerName} for ${booking.service} on ${when(booking)} (${ref}).${booking.providerAccount ? "" : " This is a sample plumber with no account: handle it here."}` }),
    );
    tasks.push(emailProvider(booking.providerType, booking.providerAccount, "emailNewBooking", `New booking request ${ref}: ${booking.service}`, [
      `${booking.customerName ?? "A customer"} sent you a booking request on Plumber Finder.`, "",
      `Service: ${booking.service}`, `When: ${when(booking)}`, ...(booking.details ? [`Details: ${booking.details}`] : []), "",
      `Accept or decline it in your dashboard: ${siteUrl()}${providerLink}`,
    ]));
  }

  if (event === "scheduled") {
    tasks.push(toCustomer({ title: "Booking confirmed", message: withNote(`${booking.providerName} accepted your ${booking.service} booking (${ref}) for ${when(booking)}.`, note) }));
    if (by === "admin") tasks.push(toProvider({ title: "Booking confirmed by admin", message: `${ref} — ${booking.service} for ${booking.customerName ?? "a customer"} on ${when(booking)} was confirmed by Plumber Finder.` }));
    else tasks.push(toAdmins({ title: "Booking accepted", message: `${booking.providerName} accepted ${ref} (${booking.service}) for ${when(booking)}.` }));
    email(booking.customerEmail, `Booking confirmed: ${booking.service} (${ref})`, [`${booking.providerName} accepted your booking.`, "", `Service: ${booking.service}`, `When: ${when(booking)}`, ...(note ? [`Message from ${booking.providerName}: ${note}`] : []), "", `See your bookings: ${siteUrl()}${customerLink}`]);
  }

  if (event === "declined") {
    tasks.push(toCustomer({ title: "Booking declined", message: withNote(`${booking.providerName} can't take your ${booking.service} booking (${ref}).`, note) }));
    if (by === "admin") tasks.push(toProvider({ title: "Booking declined by admin", message: withNote(`${ref} — ${booking.service} for ${booking.customerName ?? "a customer"} was declined by Plumber Finder.`, note) }));
    else tasks.push(toAdmins({ title: "Booking declined", message: withNote(`${booking.providerName} declined ${ref} (${booking.service}).`, note) }));
    email(booking.customerEmail, `Booking declined: ${booking.service} (${ref})`, [`${booking.providerName} can't take your booking.`, ...(note ? [`Reason: ${note}`] : []), "", `Find another plumber: ${siteUrl()}/find`]);
  }

  if (event === "in_progress") {
    tasks.push(toCustomer({ title: "Your plumber has started", message: `${booking.providerName} started your ${booking.service} job (${ref}).` }));
  }

  if (event === "awaiting_confirmation") {
    tasks.push(toCustomer({ title: "Please confirm your job is done", message: withNote(`${booking.providerName} marked your ${booking.service} job (${ref}) as completed. Confirm it — or tell us if something isn't finished.`, note) }));
    if (by === "admin") tasks.push(toProvider({ title: "Job marked as done", message: `${ref} was marked as done by Plumber Finder. The customer is asked to confirm.` }));
    email(booking.customerEmail, `Please confirm your job is done: ${booking.service} (${ref})`, [`${booking.providerName} marked your job as completed.`, "", `Confirm it, or report a problem: ${siteUrl()}${customerLink}`, "", "If we don't hear from you within 7 days, the job is confirmed automatically."]);
  }

  if (event === "completed") {
    const how = { customer: `${booking.customerName ?? "The customer"} confirmed`, admin: "Plumber Finder confirmed", system: "It was confirmed automatically (no answer in 7 days):" }[by] ?? "Confirmed:";
    tasks.push(toProvider({ title: "Job completion confirmed", message: `${how} ${ref} — ${booking.service} is completed.` }));
    tasks.push(emailProvider(booking.providerType, booking.providerAccount, "emailBookingUpdates", `Job completed: ${booking.service} (${ref})`, [`${how} ${ref} — ${booking.service} is completed.`, "", "The customer has been asked for a review."]));
    if (by !== "customer") tasks.push(toCustomer({ title: "Job completed", message: `Your ${booking.service} job with ${booking.providerName} (${ref}) is completed.` }));
    tasks.push(toAdmins({ title: "Job completed", message: `${ref} (${booking.service} with ${booking.providerName}) is completed${by === "system" ? " (auto-confirmed)" : by === "admin" ? " (confirmed by an admin)" : ""}.` }));
    // The customer is asked for a verified review (now, then after 24 h and 72 h).
    tasks.push(scheduleReviewRequests(booking).then(() => processDueReviewRequests()).catch(() => undefined));
  }

  if (event === "disputed") {
    const reason = booking.disputeReason;
    tasks.push(emailProvider(booking.providerType, booking.providerAccount, "emailBookingUpdates", `Customer reported a problem: ${booking.service} (${ref})`, [`${booking.customerName ?? "The customer"} says the job isn't finished.`, ...(reason ? [`Their message: ${reason}`] : []), "", "Plumber Finder will contact you to resolve it."]));
    tasks.push(toProvider({ title: "Customer disputed completion", message: withNote(`${booking.customerName ?? "The customer"} says ${ref} (${booking.service}) isn't finished. Plumber Finder will look into it.`, reason) }));
    tasks.push(toAdmins({ title: "Booking disputed", message: withNote(`${booking.customerName ?? "A customer"} disputed completion of ${ref} with ${booking.providerName}. Resolve it in Bookings.`, reason) }));
    tasks.push(toCustomer({ title: "We've received your report", message: `Thanks — Plumber Finder will look into ${ref} and get back to you.` }));
    tasks.push(cancelReviewRequests(booking._id, "disputed"));
  }

  if (event === "scheduled" && by === "admin" && booking.history.at(-2)?.status === "disputed") {
    tasks.push(toProvider({ title: "Dispute resolved: job reopened", message: withNote(`${ref} (${booking.service}) is back to scheduled so you can finish the work.`, note) }));
  }

  if (event === "cancelled") {
    tasks.push(cancelReviewRequests(booking._id, "cancelled"));
    const reason = by === "customer" ? booking.history.at(-1)?.note : note;
    if (by !== "customer") tasks.push(toCustomer({ title: "Booking cancelled", message: withNote(`Your ${booking.service} booking with ${booking.providerName} (${ref}) was cancelled${by === "admin" ? " by Plumber Finder" : ""}.`, reason) }));
    if (by !== "provider") tasks.push(emailProvider(booking.providerType, booking.providerAccount, "emailBookingUpdates", `Booking cancelled: ${booking.service} (${ref})`, [withNote(`${by === "customer" ? booking.customerName ?? "The customer" : "Plumber Finder"} cancelled ${ref} (${booking.service} on ${when(booking)}).`, reason)]));
    if (by !== "provider") tasks.push(toProvider({ title: "Booking cancelled", message: withNote(`${by === "customer" ? booking.customerName ?? "The customer" : "Plumber Finder"} cancelled ${ref} (${booking.service} on ${when(booking)}).`, reason) }));
    if (by !== "admin") tasks.push(toAdmins({ title: "Booking cancelled", message: withNote(`${ref} (${booking.service} with ${booking.providerName}) was cancelled by the ${by === "customer" ? "customer" : "plumber"}.`, reason) }));
    if (by === "customer") tasks.push(toCustomer({ title: "Booking cancelled", message: `Your ${booking.service} booking with ${booking.providerName} (${ref}) was cancelled.` }));
    if (by !== "customer") email(booking.customerEmail, `Booking cancelled: ${booking.service} (${ref})`, [`Your booking with ${booking.providerName} was cancelled.`, ...(reason ? [`Reason: ${reason}`] : [])]);
  }

  await Promise.all(tasks.filter(Boolean));
}

/** Scheduled job: confirms jobs the customer never answered about within 7 days. Returns how many. */
export async function autoConfirmCompletions(now = new Date()) {
  const due = await UserBooking.find({ status: "awaiting_confirmation", completionRequestedAt: { $lte: new Date(now.getTime() - AUTO_CONFIRM_AFTER_MS) } }).limit(50);
  let confirmed = 0;
  for (const booking of due) {
    // Only if it's still waiting, so a customer answering at the same moment wins.
    const saved = await UserBooking.findOneAndUpdate(
      { _id: booking._id, status: "awaiting_confirmation" },
      { $set: { status: "completed", completedAt: now, completionConfirmedBy: "system" }, $push: { history: { status: "completed", by: "system", note: "Confirmed automatically after 7 days", at: now } } },
      { new: true },
    );
    if (!saved) continue;
    await announce(saved, "completed", "system");
    confirmed++;
  }
  return confirmed;
}
