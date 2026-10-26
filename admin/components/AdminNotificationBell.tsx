"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { adminApi } from "@/lib/adminApi";

export const ADMIN_NOTIFICATIONS_CHANGED = "plumberfinder:admin-notifications-changed";

/** Navbar bell with the number of unread admin notifications (new bookings, accepted/declined/cancelled ones). */
export default function AdminNotificationBell() {
  const [unread, setUnread] = useState(0);
  const refresh = useCallback(() => { adminApi.unreadNotifications().then(({ data }) => setUnread(data.unread)).catch(() => undefined); }, []);
  useEffect(() => {
    const first = window.setTimeout(refresh, 0);
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    window.addEventListener(ADMIN_NOTIFICATIONS_CHANGED, refresh);
    return () => { window.clearTimeout(first); window.clearInterval(timer); window.removeEventListener("focus", refresh); window.removeEventListener(ADMIN_NOTIFICATIONS_CHANGED, refresh); };
  }, [refresh]);
  return (
    <Link
      href="/notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#FFD60A] hover:text-[#0b1f3b]"
      aria-label={unread ? `Admin notifications (${unread} unread)` : "Admin notifications"}
    >
      <FaBell className="h-4 w-4" />
      {unread > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unread > 99 ? "99+" : unread}</span>}
    </Link>
  );
}
