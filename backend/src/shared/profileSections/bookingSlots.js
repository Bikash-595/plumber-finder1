// The time windows a company or freelancer offers for visits (Booking Settings), e.g. "8:00 AM – 10:00 AM".
// Booking forms show exactly these, and new booking requests must use one of them. Until a provider sets its
// own, the standard windows below are offered.

export const DEFAULT_SLOTS = ["8:00 AM – 10:00 AM", "10:00 AM – 12:00 PM", "1:00 PM – 3:00 PM", "3:00 PM – 5:00 PM", "5:00 PM – 7:00 PM"];
const SLOT = /^(1[0-2]|[1-9]):[0-5]\d (AM|PM) – (1[0-2]|[1-9]):[0-5]\d (AM|PM)$/;

export const bookingSlotsField = { type: "list", maxItems: 12, max: 40, pattern: SLOT };
export const bookingSlotsSchema = { type: [String], default: undefined };

/** Problem with a requested time window, or null. No window chosen is fine (the provider proposes one). */
export function slotProblem(slots, timeSlot) {
  if (!timeSlot) return null;
  const offered = slots?.length ? slots : DEFAULT_SLOTS;
  return offered.includes(timeSlot) ? null : "Please choose one of the times this plumber offers.";
}

/** The list validator ("a, b" strings) doesn't check a pattern, so the config checks each window here. */
export const validateSlots = ({ slots }) => (Array.isArray(slots) && slots.some((slot) => !SLOT.test(slot)) ? { slots: "each time must look like “8:00 AM – 10:00 AM”" } : null);
