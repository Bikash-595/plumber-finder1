"use client";

import { FaBell, FaCheckCircle, FaInfoCircle, FaExclamationCircle, FaTrash } from "react-icons/fa";
import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Booking Confirmed",
      message: "Your booking with Elite LA Plumbing has been confirmed for March 15, 2024.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Quote Available",
      message: "Premier New York Services sent you a new quote for $150.",
      time: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Payment Reminder",
      message: "Your payment for Modern Chicago Plumbing is due in 2 days.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Service Completed",
      message: "Your plumbing service with Quick Fix Plumbing has been completed.",
      time: "3 days ago",
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="h-5 w-5 text-green-600" />;
      case "info":
        return <FaInfoCircle className="h-5 w-5 text-blue-600" />;
      case "warning":
        return <FaExclamationCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <FaBell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return "bg-white";
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-gray-50";
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="rounded-lg bg-[#FFD60A] px-4 py-2 font-medium text-gray-900 hover:bg-[#FFD60A]/90 transition">
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <FaBell className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-600">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border border-gray-200 p-4 transition ${getNotificationBg(notification.type, notification.read)}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                        {notification.title}
                      </p>
                      <p className={`mt-1 text-sm ${notification.read ? "text-gray-600" : "text-gray-700"}`}>
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="rounded-lg px-3 py-1 text-xs font-medium text-[#FFD60A] hover:bg-[#FFD60A]/10 transition"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
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
