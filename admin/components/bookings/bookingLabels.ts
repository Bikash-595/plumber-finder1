import { type AdminBookingStatus, type BookingStatus } from "@/lib/adminApi";

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const statuses = [{ value: "all", label: "All" }, { value: "pending", label: "Waiting for plumber" }, { value: "scheduled", label: "Confirmed" }, { value: "in_progress", label: "In progress" }, { value: "awaiting_confirmation", label: "Waiting for customer" }, { value: "disputed", label: "Disputed" }, { value: "completed", label: "Completed" }, { value: "declined", label: "Declined" }, { value: "cancelled", label: "Cancelled" }];

export const statusLabels: Record<BookingStatus, string> = { pending: "Waiting for plumber", scheduled: "Confirmed", in_progress: "In progress", awaiting_confirmation: "Waiting for customer", disputed: "Disputed", completed: "Completed", declined: "Declined", cancelled: "Cancelled" };

export const historyLabels: Record<BookingStatus, string> = { pending: "Request sent", scheduled: "Accepted", in_progress: "Job started", awaiting_confirmation: "Marked as done", disputed: "Customer disputed", completed: "Completed", declined: "Declined", cancelled: "Cancelled" };

export const byLabels = { customer: "Customer", provider: "Plumber", admin: "Admin", system: "System" };

// Mirrors the backend rules (shared/bookings/bookingWorkflow.js): completed, declined, and cancelled are final.
const cancel = { label: "Cancel", status: "cancelled" as AdminBookingStatus, tone: "border border-red-200 text-red-600", needsNote: true };

export const actions: Record<BookingStatus, { label: string; status: AdminBookingStatus; tone: string; needsNote?: boolean }[]> = {
  pending: [{ label: "Confirm", status: "scheduled", tone: "bg-blue-600 text-white" }, { label: "Decline", status: "declined", tone: "border border-red-200 text-red-600", needsNote: true }, cancel],
  scheduled: [{ label: "Mark in progress", status: "in_progress", tone: "border border-indigo-200 text-indigo-700" }, { label: "Complete", status: "completed", tone: "bg-emerald-600 text-white" }, cancel],
  in_progress: [{ label: "Complete", status: "completed", tone: "bg-emerald-600 text-white" }, cancel],
  awaiting_confirmation: [{ label: "Confirm completion", status: "completed", tone: "bg-emerald-600 text-white" }, cancel],
  // Resolving a dispute: the work is done (completed → the customer is asked for a review), send it back to the plumber, or cancel.
  disputed: [{ label: "Work is done — complete", status: "completed", tone: "bg-emerald-600 text-white", needsNote: true }, { label: "Send back to plumber", status: "scheduled", tone: "bg-blue-600 text-white", needsNote: true }, cancel],
  completed: [], declined: [], cancelled: [],
};

export const fieldClass = "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A]";

export const fmtDateTime = (value: string) => new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
