// Admins can answer a booking for the plumber (confirm, decline), complete it, or cancel it — see
// shared/bookings/bookingWorkflow.js for who may make each change. Completed, cancelled, and declined are final.
export const bookingsConfig = {
  statuses: ["pending", "scheduled", "completed", "cancelled", "declined"],
  statusFields: {
    status: { type: "enum", values: ["scheduled", "declined", "completed", "cancelled"], required: true },
    // Shown to the customer (and the plumber): required to decline or cancel.
    note: { type: "text", max: 500 },
    scheduledDate: { type: "date" },
    timeSlot: { type: "string", max: 60 },
  },
};
