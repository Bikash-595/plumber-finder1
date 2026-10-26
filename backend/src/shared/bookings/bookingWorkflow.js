import mongoose from "mongoose";
import { Company } from "../../auth/company/models/Company.js";
import { Freelancer } from "../../auth/freelancer/models/Freelancer.js";
import { User } from "../../auth/user/models/User.js";
import { sendMail } from "../../auth/verification/services/mailer.js";
import { CompanyListing } from "../../company/listing/models/CompanyListing.js";
import { FreelancerListing } from "../../freelancer/listing/models/FreelancerListing.js";
import { notify as notifyCustomer } from "../../user/notifications/services/notify.js";
import { AccountNotification, notifyAdmins, notifyProvider } from "../notifications/AccountNotification.js";

// How a booking moves between customer, plumber (company or freelancer), and admin:
//   pending ──accept──▶ scheduled ──complete──▶ completed
//      │                    └──cancel──▶ cancelled
//      ├──decline──▶ declined
//      └──cancel (customer/admin)──▶ cancelled
// Every change is added to the booking's history and announced to the other parties and to admins.

const listings = { company: { Model: CompanyListing, owner: "company" }, freelancer: { Model: FreelancerListing, owner: "freelancer" } };
const accounts = { company: Company, freelancer: Freelancer };
export const providerBookingsPath = { company: "/company-dashboard/bookings", freelancer: "/freelancer/bookings" };
const siteUrl = () => (process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim();

export const statusLabels = { pending: "waiting for a reply", scheduled: "confirmed", completed: "completed", cancelled: "cancelled", declined: "declined" };

/** Which status changes each party may make. */
export const transitions = {
  provider: { pending: ["scheduled", "declined"], scheduled: ["completed", "cancelled"] },
  customer: { pending: ["cancelled"], scheduled: ["cancelled"] },
  admin: { pending: ["scheduled", "declined", "cancelled"], scheduled: ["completed", "cancelled"] },
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
  const [user, providerAccount] = await Promise.all([User.findById(userId).select("name email").lean(), resolveProviderAccount(providerType, providerId)]);
  return { customerName: user?.name, customerEmail: user?.email, providerAccount };
}

/**
 * Applies a status change to a booking document (the caller saves it). Accepting can set or change the
 * visit date and time. Returns an error message when the change isn't allowed.
 */
export function applyStatus(booking, { to, by, note, scheduledDate, timeSlot }) {
  if (!canMove(by, booking.status, to)) return `This booking is ${statusLabels[booking.status]} and can't be ${({ scheduled: "accepted", declined: "declined", completed: "completed", cancelled: "cancelled" })[to] ?? to} now.`;
  const now = new Date();
  booking.status = to;
  if (to === "scheduled") {
    booking.acceptedAt = now;
    if (scheduledDate) booking.scheduledDate = scheduledDate;
    if (timeSlot) booking.timeSlot = timeSlot;
  }
  if (to === "declined") booking.declinedAt = now;
  if (to === "completed") booking.completedAt = now;
  if (to === "cancelled") { booking.cancelledAt = now; booking.cancelledBy = by; }
  if (by !== "customer") booking.responseNote = note || undefined;
  booking.history.push({ status: to, by, note: note || undefined, at: now });
  return null;
}

/** The customer's phone, email and address are shared with the plumber once the booking is accepted. */
export function forProvider(booking) {
  const value = typeof booking.toObject === "function" ? booking.toObject() : { ...booking };
  const contactVisible = Boolean(value.acceptedAt);
  if (!contactVisible) { delete value.phone; delete value.customerEmail; delete value.address; }
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
async function providerEmail(booking) {
  if (!booking.providerAccount) return null;
  const account = await accounts[booking.providerType].findById(booking.providerAccount).select("email").lean();
  return account?.email ?? null;
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
    tasks.push(
      tellCustomer && toCustomer({ title: "Booking request sent", message: `Your request ${ref} for ${booking.service} was sent to ${booking.providerName}. You'll be notified when they accept it.` }),
      toProvider({ title: "New booking request", message: `${booking.customerName ?? "A customer"} wants ${booking.service} on ${when(booking)} (${ref}). Accept or decline it.`, actionRequired: true }),
      toAdmins({ title: "New booking", message: `${booking.customerName ?? "A customer"} booked ${booking.providerName} for ${booking.service} on ${when(booking)} (${ref}).${booking.providerAccount ? "" : " This is a sample plumber with no account: handle it here."}` }),
    );
    const to = await providerEmail(booking);
    email(to, `New booking request ${ref}: ${booking.service}`, [
      `${booking.customerName ?? "A customer"} sent you a booking request on Plumber Finder.`, "",
      `Service: ${booking.service}`, `When: ${when(booking)}`, ...(booking.details ? [`Details: ${booking.details}`] : []), "",
      `Accept or decline it in your dashboard: ${siteUrl()}${providerLink}`,
    ]);
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

  if (event === "completed") {
    tasks.push(toCustomer({ title: "Job completed", message: `${booking.providerName} marked your ${booking.service} job (${ref}) as completed. You can leave them a review.` }));
    if (by === "admin") tasks.push(toProvider({ title: "Job marked completed", message: `${ref} — ${booking.service} was marked completed by Plumber Finder.` }));
    else tasks.push(toAdmins({ title: "Job completed", message: `${booking.providerName} completed ${ref} (${booking.service}).` }));
  }

  if (event === "cancelled") {
    const reason = by === "customer" ? booking.history.at(-1)?.note : note;
    if (by !== "customer") tasks.push(toCustomer({ title: "Booking cancelled", message: withNote(`Your ${booking.service} booking with ${booking.providerName} (${ref}) was cancelled${by === "admin" ? " by Plumber Finder" : ""}.`, reason) }));
    if (by !== "provider") tasks.push(toProvider({ title: "Booking cancelled", message: withNote(`${by === "customer" ? booking.customerName ?? "The customer" : "Plumber Finder"} cancelled ${ref} (${booking.service} on ${when(booking)}).`, reason) }));
    if (by !== "admin") tasks.push(toAdmins({ title: "Booking cancelled", message: withNote(`${ref} (${booking.service} with ${booking.providerName}) was cancelled by the ${by === "customer" ? "customer" : "plumber"}.`, reason) }));
    if (by === "customer") tasks.push(toCustomer({ title: "Booking cancelled", message: `Your ${booking.service} booking with ${booking.providerName} (${ref}) was cancelled.` }));
    if (by !== "customer") email(booking.customerEmail, `Booking cancelled: ${booking.service} (${ref})`, [`Your booking with ${booking.providerName} was cancelled.`, ...(reason ? [`Reason: ${reason}`] : [])]);
  }

  await Promise.all(tasks.filter(Boolean));
}
