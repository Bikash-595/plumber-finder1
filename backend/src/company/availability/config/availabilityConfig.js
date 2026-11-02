// When customers can book a company: a pause switch, days off, a daily job limit and minimum notice.
export const availabilityConfig = {
  label: "availability",
  maxTimeOff: 50,
  fields: {
    acceptingBookings: { type: "boolean" },
    pauseMessage: { type: "string", max: 200 },
    maxJobsPerDay: { type: "number", integer: true, min: 0, max: 100 },   // 0 = no limit
    minNoticeDays: { type: "number", integer: true, min: 0, max: 30 },    // 0 = same day is fine
    timeOff: { type: "objects", maxItems: 50, fields: {
      start: { type: "date", required: true },
      end: { type: "date", required: true },
      reason: { type: "string", max: 120 },
    } },
  },
};
