// Admins move bookings forward; completed and cancelled bookings are final.
export const bookingsConfig = {
  statuses: ["pending", "scheduled", "completed", "cancelled"],
  transitions: { pending: ["scheduled", "cancelled"], scheduled: ["completed", "cancelled"], completed: [], cancelled: [] },
  statusFields: { status: { type: "enum", values: ["scheduled", "completed", "cancelled"], required: true } },
};
