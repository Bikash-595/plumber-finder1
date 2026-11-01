import { bookingsConfig as customerBookings } from "../../../user/bookings/config/bookingsConfig.js";

// Admins can answer a booking for the plumber (confirm, decline), mark it in progress, complete it, cancel it,
// and resolve a customer's dispute (confirm the work, or send the job back to scheduled) — see
// shared/bookings/bookingWorkflow.js for who may make each change. Completed, cancelled, and declined are final.
export const bookingsConfig = {
  statuses: customerBookings.statuses,
  statusFields: {
    status: { type: "enum", values: ["scheduled", "in_progress", "declined", "completed", "cancelled"], required: true },
    // Shown to the customer (and the plumber): required to decline or cancel.
    note: { type: "text", max: 500 },
    scheduledDate: { type: "date" },
    timeSlot: { type: "string", max: 60 },
  },
};
