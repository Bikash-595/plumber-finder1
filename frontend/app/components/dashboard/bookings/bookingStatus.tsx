import { FaBan, FaCalendarCheck, FaCheckCircle, FaClock, FaExclamationTriangle, FaTimesCircle, FaTools, FaUserCheck } from "react-icons/fa";
import type { Booking } from "@/components/utils/userApi";
import type { Tone } from "../ui/tones";

// What each booking status means to the customer, shared by the bookings page and the dashboard home.
export const bookingStatus: Record<Booking["status"], { label: string; history: string; tone: Tone; icon: React.ReactNode }> = {
  pending: { label: "Waiting for reply", history: "Request sent", tone: "warning", icon: <FaClock className="h-3 w-3" /> },
  scheduled: { label: "Confirmed", history: "Accepted", tone: "info", icon: <FaCalendarCheck className="h-3 w-3" /> },
  in_progress: { label: "In progress", history: "Job started", tone: "info", icon: <FaTools className="h-3 w-3" /> },
  awaiting_confirmation: { label: "Please confirm", history: "Marked as done", tone: "violet", icon: <FaUserCheck className="h-3 w-3" /> },
  disputed: { label: "Problem reported", history: "You reported a problem", tone: "warning", icon: <FaExclamationTriangle className="h-3 w-3" /> },
  completed: { label: "Completed", history: "Completed", tone: "success", icon: <FaCheckCircle className="h-3 w-3" /> },
  declined: { label: "Declined", history: "Declined", tone: "danger", icon: <FaTimesCircle className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", history: "Cancelled", tone: "neutral", icon: <FaBan className="h-3 w-3" /> },
};

export const bookingFilters: { value: Booking["status"] | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Waiting" },
  { value: "scheduled", label: "Confirmed" },
  { value: "in_progress", label: "In progress" },
  { value: "awaiting_confirmation", label: "To confirm" },
  { value: "completed", label: "Completed" },
  { value: "disputed", label: "Disputed" },
  { value: "declined", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
];

export const canCancel = (booking: Booking) => booking.status === "pending" || booking.status === "scheduled";
export const bookingTotal = (booking: Booking) => (booking.price === undefined || booking.price === null ? null : booking.price * booking.quantity);
