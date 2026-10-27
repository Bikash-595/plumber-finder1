// Booking requests a customer sends to a plumber (directly, or created by checkout).
// Customers can create and cancel bookings; the plumber (or an admin) accepts, declines, and completes them.
export const bookingsConfig = {
  label: "Booking",
  // pending = waiting for the plumber; scheduled = accepted (confirmed); declined = the plumber said no.
  statuses: ["pending", "scheduled", "completed", "cancelled", "declined"],
  cancellable: ["pending", "scheduled"],
  fields: {
    providerType: { type: "enum", values: ["company", "freelancer"], required: true },
    providerId: { type: "string", required: true, max: 64 },
    providerName: { type: "string", required: true, max: 150 },
    service: { type: "string", required: true, max: 150 },
    scheduledDate: { type: "date" },
    timeSlot: { type: "string", max: 60 },
    address: { type: "string", max: 300 },
    phone: { type: "string", max: 40 },
    details: { type: "text", max: 2000 },
    offer: { type: "string", max: 120 },
    // A coupon code from the plumber's special offers; checked and priced on the server (shared/bookings/bookingQuote.js).
    couponCode: { type: "string", max: 40, uppercase: true },
  },
  // A requested date cannot be in the past (today is fine).
  validate: ({ scheduledDate }) => {
    if (!scheduledDate) return null;
    const today = new Date();
    // Compare with the start of yesterday (UTC) so customers in any time zone can still pick "today".
    const earliest = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - 24 * 60 * 60 * 1000;
    return scheduledDate.getTime() < earliest ? { scheduledDate: "cannot be in the past" } : null;
  },
};
