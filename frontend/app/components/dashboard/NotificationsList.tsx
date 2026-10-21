"use client";

import Link from "next/link";
import { FaBell, FaCalendarCheck, FaReceipt, FaTag, FaTrash } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatDate, userApi, type Notification } from "@/components/utils/userApi";

const icons: Record<Notification["type"], React.ReactNode> = {
  booking: <FaCalendarCheck className="h-5 w-5 text-blue-600" />,
  order: <FaReceipt className="h-5 w-5 text-green-600" />,
  offer: <FaTag className="h-5 w-5 text-amber-600" />,
  system: <FaBell className="h-5 w-5 text-gray-600" />,
};
const unreadBg: Record<Notification["type"], string> = {
  booking: "bg-blue-50 border-blue-200", order: "bg-green-50 border-green-200", offer: "bg-amber-50 border-amber-200", system: "bg-gray-50",
};

function timeAgo(value: string) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return formatDate(value);
}

/** The customer's notifications, used by /notifications and /dashboard/notifications. */
export default function NotificationsList() {
  const { signedIn, data: notifications, setData, error, setError, loading } = useUserData(userApi.notifications);

  if (!signedIn) return <SignInPrompt what="your notifications" />;

  const update = async (action: () => Promise<unknown>, next: Notification[]) => {
    const previous = notifications;
    setData(next); // optimistic
    try { await action(); } catch (caught) { setData(previous); setError(caught instanceof Error ? caught.message : "Could not update notifications."); }
  };
  const list = notifications ?? [];
  const unreadCount = list.filter((notification) => !notification.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">{loading ? "Loading…" : unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={() => update(userApi.markAllNotificationsRead, list.map((notification) => ({ ...notification, read: true })))} className="rounded-lg bg-[#FFD60A] px-4 py-2 font-medium text-gray-900 transition hover:bg-[#FFD60A]/90">
            Mark all as read
          </button>
        )}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}

      <div className="space-y-3">
        {!loading && list.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <FaBell className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-600">No notifications yet. Booking and order updates will appear here.</p>
          </div>
        ) : (
          list.map((notification) => (
            <div key={notification._id} className={`rounded-xl border border-gray-200 p-4 transition ${notification.read ? "bg-white" : unreadBg[notification.type]}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">{icons[notification.type]}</div>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>{notification.title}</p>
                  {notification.message && <p className={`mt-1 text-sm ${notification.read ? "text-gray-600" : "text-gray-700"}`}>{notification.message}</p>}
                  <p className="mt-2 text-xs text-gray-500">
                    {timeAgo(notification.createdAt)}
                    {notification.link && <> · <Link href={notification.link} className="font-semibold text-[#0b1f3b] underline">View</Link></>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!notification.read && (
                    <button type="button" onClick={() => update(() => userApi.markNotificationRead(notification._id), list.map((item) => (item._id === notification._id ? { ...item, read: true } : item)))} className="rounded-lg px-3 py-1 text-xs font-semibold text-[#8a7300] transition hover:bg-[#FFD60A]/10">
                      Mark as read
                    </button>
                  )}
                  <button type="button" aria-label="Delete notification" onClick={() => update(() => userApi.deleteNotification(notification._id), list.filter((item) => item._id !== notification._id))} className="text-gray-400 transition hover:text-red-600">
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
