// How customers can request appointments.
export const bookingConfig = {
  label: "Booking settings",
  fields: {
    instantBooking: { type: "boolean", default: true },
    approvalRequired: { type: "boolean", default: false },
    emergencyBooking: { type: "boolean", default: false },
    workingDays: { type: "string", max: 200 },
    timeSlots: { type: "string", max: 300 },
    cancellationPolicy: { type: "text", max: 2000 },
  },
};
