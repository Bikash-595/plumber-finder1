import { FaCalendarCheck, FaCheckCircle, FaClock, FaTimesCircle, FaBan } from "react-icons/fa";
import type { Booking } from "@/components/utils/userApi";
import type { Tone } from "../ui/tones";

// What each booking status means to the customer, shared by the bookings page and the dashboard home.
export const bookingStatus: Record<Booking["status"], { label: string; history: string; tone: Tone; icon: React.ReactNode }> = {
  pending: { label: "Waiting for reply", history: "Request sent", tone: "warning", icon: <FaClock className="h-3 w-3" /> },
  scheduled: { label: "Confirmed", history: "Accepted", tone: "info", icon: <FaCalendarCheck className="h-3 w-3" /> },
  completed: { label: "Completed", history: "Completed", tone: "success", icon: <FaCheckCircle className="h-3 w-3" /> },
  declined: { label: "Declined", history: "Declined", tone: "danger", icon: <FaTimesCircle className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", history: "Cancelled", tone: "neutral", icon: <FaBan className="h-3 w-3" /> },
};

export const bookingFilters: { value: Booking["status"] | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Waiting" },
  { value: "scheduled", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
];

export const canCancel = (booking: Booking) => booking.status === "pending" || booking.status === "scheduled";
export const bookingTotal = (booking: Booking) => (booking.price === undefined || booking.price === null ? null : booking.price * booking.quantity);
