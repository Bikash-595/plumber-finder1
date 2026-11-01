// Jobs = bookings the company accepted, on a board by stage. Moving a job (start, mark done, cancel) uses the
// booking actions, so the customer and admins are notified and the history is kept.
export const jobsConfig = {
  stages: ["scheduled", "in_progress", "awaiting_confirmation", "completed", "disputed", "cancelled"],
  note: { label: "note", fields: { body: { type: "text", required: true, max: 1000 } } },
};
