// The freelancer's working week, shown on the public profile with an "Open now" badge.
// `weeklyHours` (one row per weekday) is validated by shared/openingHours.js.
export const openingHoursConfig = {
  label: "Opening hours",
  fields: {
    availability24x7: { type: "boolean", default: false },
    emergencyHours: { type: "text", max: 1000 },
    holidayHours: { type: "text", max: 1000 },
    specialClosures: { type: "text", max: 1000 },
  },
};
