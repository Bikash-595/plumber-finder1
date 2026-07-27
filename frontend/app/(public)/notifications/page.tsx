// app/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FaBell, FaEnvelope, FaUserPlus, FaCheckCircle, FaClock, FaTrashAlt } from "react-icons/fa";

interface Notification {
  id: number;
  type: "lead" | "system" | "message";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
}

const mockNotifications: Notification[] = [
  { id: 1, type: "lead", title: "New Lead Request", message: "A homeowner in Chicago needs a water heater repair.", time: "5 minutes ago", read: false, icon: FaUserPlus },
  { id: 2, type: "system", title: "Profile Verification", message: "Your business license has been approved.", time: "1 hour ago", read: false, icon: FaCheckCircle },
  { id: 3, type: "message", title: "Message from Client", message: "Sarah Johnson asked for a quote on drain cleaning.", time: "3 hours ago", read: true, icon: FaEnvelope },
  { id: 4, type: "lead", title: "Booking Confirmed", message: "You have a new appointment on Friday at 2 PM.", time: "Yesterday", read: true, icon: FaBell },
  { id: 5, type: "system", title: "Review Received", message: "A customer left a 5-star review on your profile.", time: "2 days ago", read: false, icon: FaBell },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = notifications.filter((n) => (filter === "unread" ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">Loading notifications...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Stay updated with your leads and account activity</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`pb-2 text-sm font-medium transition ${
              filter === "all"
                ? "border-b-2 border-[#FFD60A] text-[#FFD60A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`pb-2 text-sm font-medium transition ${
              filter === "unread"
                ? "border-b-2 border-[#FFD60A] text-[#FFD60A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
              No notifications to show.
            </div>
          ) : (
            filtered.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md ${
                    !notif.read ? "border-l-4 border-l-[#FFD60A]" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#FFD60A]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <FaClock className="h-3 w-3" />
                          {notif.time}
                        </span>
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <FaTrashAlt className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-[#FFD60A] hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}