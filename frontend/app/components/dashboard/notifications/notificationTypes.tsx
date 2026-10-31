import { FaBell, FaCalendarCheck, FaCommentDots, FaReceipt, FaTag } from "react-icons/fa";
import type { Notification } from "@/components/utils/userApi";
import type { Tone } from "../ui/tones";

export const notificationTypes: Record<Notification["type"], { label: string; tone: Tone; icon: React.ReactNode }> = {
  booking: { label: "Bookings", tone: "info", icon: <FaCalendarCheck className="h-4 w-4" /> },
  order: { label: "Orders", tone: "success", icon: <FaReceipt className="h-4 w-4" /> },
  offer: { label: "Offers", tone: "brand", icon: <FaTag className="h-4 w-4" /> },
  comment: { label: "Comments", tone: "violet", icon: <FaCommentDots className="h-4 w-4" /> },
  system: { label: "Account", tone: "neutral", icon: <FaBell className="h-4 w-4" /> },
};
