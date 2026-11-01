// The PlumberFinder review system: rules shared by the customer, company, freelancer and admin areas.
//
// Three review sources, never mixed into one score:
//   directory         — any signed-in customer reviews a plumber from its directory profile (no booking needed)
//   verified_booking  — tied to one of the customer's completed PlumberFinder bookings ("Verified Booking")
//   google            — companies only, read from Google (never stored as PlumberFinder reviews)
// Freelancers have directory and verified_booking reviews only.

export const REVIEW_SOURCES = ["directory", "verified_booking"];
export const REVIEW_STATUSES = ["published", "pending", "hidden", "rejected"]; // pending = held for moderation
export const SERVICE_CATEGORIES = ["Leak repair", "Drain cleaning", "Water heater", "Toilet & fixtures", "Pipe repair & repiping", "Sewer line", "Gas line", "Emergency plumbing", "Bathroom & kitchen", "Inspection & maintenance", "Commercial plumbing", "Other"];
export const REPORT_REASONS = ["spam", "offensive", "fake", "not_relevant", "personal_info", "other"];
export const PROVIDER_TYPES = ["company", "freelancer"];
/** Google reviews are offered to companies only. */
export const googleAllowed = (providerType) => providerType === "company";

export const limits = {
  pageSize: 10,
  reviewsPerDay: 5,          // reviews one customer can write in 24 hours
  holdAfterReports: 3,       // reports from different people that hold a review for moderation
  replyMaxLength: 1500,
};

// Review requests after a completed booking: the first straight away, then reminders.
export const reviewRequestSchedule = [
  { kind: "request", afterMs: 0 },
  { kind: "reminder_24h", afterMs: 24 * 60 * 60 * 1000 },
  { kind: "reminder_72h", afterMs: 72 * 60 * 60 * 1000 },
];
// A job the plumber marked as done is confirmed automatically if the customer doesn't answer.
export const AUTO_CONFIRM_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

// The fields a customer sends with a review. Who wrote it, which plumber and which booking are decided on the server.
export const reviewFields = {
  rating: { type: "number", integer: true, min: 1, max: 5, required: true },
  title: { type: "string", max: 120 },
  body: { type: "text", max: 3000, required: true },
  serviceCategory: { type: "enum", values: SERVICE_CATEGORIES },
  photos: { type: "images", maxItems: 4, max: 1_250_000 },
};
