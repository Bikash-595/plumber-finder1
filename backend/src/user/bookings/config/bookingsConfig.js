// Booking requests a customer sends to a plumber (directly, or created by checkout).
// Customers can create and cancel bookings; only the plumber/admin side may schedule or complete them.
export const bookingsConfig = {
  label: "Booking",
  statuses: ["pending", "scheduled", "completed", "cancelled"],
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
