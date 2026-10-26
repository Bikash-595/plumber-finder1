"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/components/utils/apiClient";

// Booking requests as a plumber (company or freelancer) sees them, and the account's notifications.

export type BookingStatus = "pending" | "scheduled" | "completed" | "cancelled" | "declined";
export type BookingHistory = { status: BookingStatus; by: "customer" | "provider" | "admin" | "system"; note?: string; at: string };
export type ProviderBooking = {
  _id: string;
  reference: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  address?: string;
  contactVisible: boolean;
  service: string;
  quantity: number;
  price?: number;
  scheduledDate?: string;
  timeSlot?: string;
  details?: string;
  offer?: string;
  status: BookingStatus;
  source: "request" | "checkout";
  responseNote?: string;
  history: BookingHistory[];
  createdAt: string;
};
export type BookingList = { data: ProviderBooking[]; page: number; limit: number; total: number; counts: Record<BookingStatus, number> };
export type AccountNotice = { _id: string; type: "booking" | "comment" | "system"; title: string; message?: string; link?: string; booking?: string; actionRequired: boolean; read: boolean; createdAt: string };

/** "/companies" or "/freelancers". */
export type ProviderBase = "/companies" | "/freelancers";
const loginMessage = "Please log in with your business account.";
export const providerApi = {
  list: (base: ProviderBase, query: { status?: string; search?: string; page?: number }) => {
    const params = new URLSearchParams(Object.entries(query).filter(([, value]) => value !== undefined && value !== "" && value !== "all").map(([key, value]) => [key, String(value)]));
    return apiRequest<ProviderBooking[]>(`${base}/bookings?${params}`, { loginMessage }) as Promise<BookingList>;
  },
  getOne: (base: ProviderBase, id: string) => apiRequest<ProviderBooking>(`${base}/bookings/${id}`, { loginMessage }),
  respond: (base: ProviderBase, id: string, action: "accept" | "decline" | "complete" | "cancel", body: Record<string, string | undefined>) =>
    apiRequest<ProviderBooking>(`${base}/bookings/${id}/${action}`, { method: "PATCH", body, loginMessage }),
  notifications: (base: ProviderBase) => apiRequest<AccountNotice[]>(`${base}/notifications`, { loginMessage }) as Promise<{ data: AccountNotice[]; unread: number }>,
  markRead: (base: ProviderBase, id: string) => apiRequest(`${base}/notifications/${id}/read`, { method: "PATCH", loginMessage }),
  markAllRead: (base: ProviderBase) => apiRequest(`${base}/notifications/read-all`, { method: "PATCH", loginMessage }),
  removeNotification: (base: ProviderBase, id: string) => apiRequest(`${base}/notifications/${id}`, { method: "DELETE", loginMessage }),
};

export const statusInfo: Record<BookingStatus, { label: string; tone: string }> = {
  pending: { label: "New request", tone: "bg-amber-50 text-amber-800 border-amber-200" },
  scheduled: { label: "Confirmed", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  completed: { label: "Completed", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Declined", tone: "bg-gray-100 text-gray-600 border-gray-200" },
  cancelled: { label: "Cancelled", tone: "bg-red-50 text-red-700 border-red-200" },
};

// Booking dates are stored as midnight UTC.
export const formatVisitDate = (value?: string) => (value ? new Date(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Flexible date");
export function timeAgo(value: string) {
  const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units: [number, string][] = [[60, "minute"], [3600, "hour"], [86400, "day"], [604800, "week"]];
  const [size, unit] = [...units].reverse().find(([limit]) => seconds >= limit)!;
  if (unit === "week" && seconds > 4 * 604800) return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const count = Math.floor(seconds / size);
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}

/** Tell the bell to refresh after notifications are read or bookings answered. */
export const NOTIFICATIONS_CHANGED = "plumberfinder:notifications-changed";
export const notificationsChanged = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));

/** Unread notification count for the navbar bell: checked on load, every 30 seconds, on focus, and after changes. */
export function useUnreadCount(base: ProviderBase) {
  const [unread, setUnread] = useState(0);
  const refresh = useCallback(() => {
    apiRequest<{ unread: number }>(`${base}/notifications/unread-count`).then(({ data }) => setUnread(data.unread)).catch(() => undefined);
  }, [base]);
  useEffect(() => {
    const first = window.setTimeout(refresh, 0);
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    window.addEventListener(NOTIFICATIONS_CHANGED, refresh);
    return () => { window.clearTimeout(first); window.clearInterval(timer); window.removeEventListener("focus", refresh); window.removeEventListener(NOTIFICATIONS_CHANGED, refresh); };
  }, [refresh]);
  return unread;
}
