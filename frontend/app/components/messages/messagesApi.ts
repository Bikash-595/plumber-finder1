"use client";

import { apiRequest } from "@/components/utils/apiClient";

// Messages between a customer and the plumber they booked (one conversation per booking).
// `base` is the signed-in side: "/users" (customer), "/companies" or "/freelancers".
export type MessagesBase = "/users" | "/companies" | "/freelancers";
export type Conversation = {
  _id: string; booking: string; providerName?: string; customerName?: string; reference?: string; service?: string;
  lastMessage?: { body: string; from: "customer" | "provider"; at: string }; unreadForMe: number; updatedAt: string;
  // Unread counts per side (in a thread): 0 for the other side means they've seen every message.
  unread?: { customer: number; provider: number };
};
export type ChatMessage = { _id: string; from: "customer" | "provider"; body: string; createdAt: string };
export type Thread = { conversation: Conversation; booking: { reference?: string; service: string; status: string; scheduledDate?: string; timeSlot?: string } | null; messages: ChatMessage[]; hasOlder: boolean; me: "customer" | "provider" };

export const inboxPaths: Record<MessagesBase, string> = { "/users": "/dashboard/messages", "/companies": "/company-dashboard/messages", "/freelancers": "/freelancer/messages" };

/** Where the booking behind a conversation opens for each side. */
export const bookingHref = (base: MessagesBase, bookingId: string, reference?: string) =>
  base === "/users" ? `/dashboard/bookings${reference ? `?q=${encodeURIComponent(reference)}` : ""}` : `${base === "/companies" ? "/company-dashboard" : "/freelancer"}/bookings?booking=${bookingId}`;

export const messagesApi = {
  list: (base: MessagesBase) => apiRequest<Conversation[]>(`${base}/messages`) as unknown as Promise<{ data: Conversation[]; total: number; unread: number }>,
  open: (base: MessagesBase, bookingId: string) => apiRequest<Conversation>(`${base}/messages`, { method: "POST", body: { bookingId } }),
  thread: (base: MessagesBase, id: string, before?: string) => apiRequest<Thread>(`${base}/messages/${id}${before ? `?before=${before}` : ""}`),
  send: (base: MessagesBase, id: string, body: string) => apiRequest<ChatMessage>(`${base}/messages/${id}`, { method: "POST", body: { body } }),
  read: (base: MessagesBase, id: string) => apiRequest(`${base}/messages/${id}/read`, { method: "PATCH" }),
};

/** "Today", "Yesterday", "Monday" (this week) or "Mon, Oct 27" — the separators between days in a thread. */
export const dayLabel = (value: string) => {
  const date = new Date(value);
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(new Date()) - startOf(date)) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}) });
};

export const clockTime = (value: string) => new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export const shortTime = (value: string) => {
  const date = new Date(value);
  const today = new Date();
  return date.toDateString() === today.toDateString() ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
