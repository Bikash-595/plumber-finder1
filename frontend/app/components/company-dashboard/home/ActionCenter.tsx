import Link from "next/link";
import { FaBell, FaCalendarPlus, FaExclamationTriangle, FaStar, FaUserCheck } from "react-icons/fa";
import type { CompanyDashboard } from "../companyApi";
import { dashBase, editorHref } from "@/components/utils/providerSide";

/** What needs the company's attention right now; the most urgent are highlighted. */
export default function ActionCenter({ actions }: { actions: CompanyDashboard["actions"] }) {
  const tiles = [
    { label: "Requests to answer", value: actions.pendingRequests, href: `${dashBase()}/bookings`, icon: FaCalendarPlus, urgent: actions.pendingRequests > 0 },
    { label: "Waiting for customer", value: actions.awaitingConfirmation, href: `${dashBase()}/bookings`, icon: FaUserCheck, urgent: false },
    { label: "Disputed jobs", value: actions.disputed, href: `${dashBase()}/bookings`, icon: FaExclamationTriangle, urgent: actions.disputed > 0 },
    { label: "Reviews to reply to", value: actions.unansweredReviews, href: editorHref("reviews"), icon: FaStar, urgent: false },
    { label: "Unread notifications", value: actions.unreadNotifications, href: `${dashBase()}/notifications`, icon: FaBell, urgent: false },
  ];
  return (
    <nav aria-label="Needs your attention" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {tiles.map(({ label, value, href, icon: Icon, urgent }) => (
        <Link key={label} href={href} className={`group flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${urgent ? "border-[#FFD60A] bg-[#FFD60A]/10" : "border-gray-200/80 bg-white"}`}>
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${urgent ? "bg-[#0b1f3b] text-[#FFD60A]" : "bg-gray-100 text-gray-500"}`}><Icon className="h-4 w-4" /></span>
          <span className="min-w-0">
            <span className="block text-2xl font-bold tabular-nums leading-tight text-gray-900">{value}</span>
            <span className="block truncate text-xs font-medium text-gray-600">{label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
