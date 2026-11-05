import type { Tone } from "@/components/dashboard/ui/tones";

// Booking status as a small label in conversations (worded for both sides, unlike the customer's bookings page).
export const messageStatus: Record<string, { label: string; tone: Tone }> = {
  pending: { label: "Awaiting reply", tone: "warning" },
  scheduled: { label: "Confirmed", tone: "info" },
  in_progress: { label: "In progress", tone: "info" },
  awaiting_confirmation: { label: "Awaiting confirmation", tone: "violet" },
  disputed: { label: "Problem reported", tone: "warning" },
  completed: { label: "Completed", tone: "success" },
  declined: { label: "Declined", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};
