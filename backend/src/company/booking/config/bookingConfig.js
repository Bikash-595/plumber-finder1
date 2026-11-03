// How customers can request appointments, including the time windows they can pick.
import { bookingSlotsField, validateSlots } from "../../../shared/profileSections/bookingSlots.js";

export const bookingConfig = {
  label: "Booking settings",
  fields: {
    instantBooking: { type: "boolean", default: true },
    approvalRequired: { type: "boolean", default: false },
    emergencyBooking: { type: "boolean", default: false },
    workingDays: { type: "string", max: 200 },
    timeSlots: { type: "string", max: 300 }, // older free-text note; `slots` is what booking forms use
    slots: bookingSlotsField,
    cancellationPolicy: { type: "text", max: 2000 },
  },
  validate: validateSlots,
};
