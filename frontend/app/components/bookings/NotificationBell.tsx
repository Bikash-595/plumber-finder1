"use client";

import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { useUnreadCount, type ProviderBase } from "./bookingsApi";

/** Navbar bell with the number of unread notifications (new booking requests, cancellations, ...). */
export default function NotificationBell({ base, href }: { base: ProviderBase; href: string }) {
  const unread = useUnreadCount(base);
  return (
    <Link
      href={href}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#FFD60A] hover:text-[#0b1f3b]"
      aria-label={unread ? `Notifications (${unread} unread)` : "Notifications"}
    >
      <FaBell className="h-4 w-4" />
      {unread > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unread > 99 ? "99+" : unread}</span>}
    </Link>
  );
}
