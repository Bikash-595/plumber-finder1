import { cleanWeeklyHours, weeklyHoursSchema } from "../openingHours.js";
import { createValidator } from "./createValidator.js";

// Opening hours, shared by companies and freelancers: one row per weekday (`weeklyHours`, validated
// by shared/openingHours.js) plus notes. Shown on the public profile with an "Open now" badge.

export const openingHoursConfig = {
  label: "Opening hours",
  fields: {
    availability24x7: { type: "boolean", default: false },
    dailyHours: { type: "text", max: 1000 }, // e.g. "Lunch break 1–2 PM"
    emergencyHours: { type: "text", max: 1000 },
    holidayHours: { type: "text", max: 1000 },
    specialClosures: { type: "text", max: 1000 },
  },
};

export const openingHoursSchemaFields = {
  weeklyHours: { type: weeklyHoursSchema, default: [] },
  availability24x7: { type: Boolean, default: false },
  dailyHours: { type: String, trim: true, maxlength: 1000 },
  emergencyHours: { type: String, trim: true, maxlength: 1000 },
  holidayHours: { type: String, trim: true, maxlength: 1000 },
  specialClosures: { type: String, trim: true, maxlength: 1000 },
};

const validateFields = createValidator(openingHoursConfig);

/** Validates the notes, then the weekly rows (sent as `weeklyHours`; an empty list clears them). */
export function validateOpeningHours(req, res, next) {
  validateFields(req, res, () => {
    if (req.body.weeklyHours === undefined) return next();
    const { values, error } = cleanWeeklyHours(req.body.weeklyHours);
    if (error) return res.status(400).json({ message: "Please check the Opening hours details.", errors: { weeklyHours: error } });
    req.validated.weeklyHours = values;
    next();
  });
}

/** The public-profile shape: { weeklyHours, availability24x7: "Yes" | undefined, notes... }. */
export function publicHours(record) {
  if (!record) return null;
  return {
    weeklyHours: record.weeklyHours ?? [],
    availability24x7: record.availability24x7 ? "Yes" : undefined,
    dailyHours: record.dailyHours || undefined,
    emergencyHours: record.emergencyHours || undefined,
    holidayHours: record.holidayHours || undefined,
    specialClosures: record.specialClosures || undefined,
  };
}
