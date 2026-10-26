import { newBookingReference, UserBooking } from "../../user/bookings/models/UserBooking.js";
import { newBookingFields } from "./bookingWorkflow.js";

/**
 * Bookings made before references and plumber inboxes existed: gives each one a reference, the plumber
 * account it belongs to, who booked it, and a starting history. Only fills in missing fields; safe to run
 * on every start (it does nothing once every booking has a reference).
 */
export async function backfillBookings() {
  const old = await UserBooking.collection.find({ reference: { $exists: false } }).toArray();
  for (const booking of old) {
    const fields = await newBookingFields(booking.user, booking.providerType, booking.providerId);
    const history = [{ status: "pending", by: "customer", at: booking.createdAt ?? new Date() }];
    if (booking.status && booking.status !== "pending") history.push({ status: booking.status, by: "system", at: booking.updatedAt ?? new Date() });
    await UserBooking.collection.updateOne({ _id: booking._id, reference: { $exists: false } }, {
      $set: {
        reference: newBookingReference(),
        providerAccount: fields.providerAccount,
        ...(booking.customerName ? {} : { customerName: fields.customerName }),
        ...(booking.customerEmail ? {} : { customerEmail: fields.customerEmail }),
        ...(booking.history ? {} : { history }),
        ...(booking.status === "scheduled" && !booking.acceptedAt ? { acceptedAt: booking.updatedAt ?? new Date() } : {}),
      },
    });
  }
  return old.length;
}
