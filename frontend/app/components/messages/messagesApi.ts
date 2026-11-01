"use client";

import { apiRequest } from "@/components/utils/apiClient";

// Messages between a customer and the plumber they booked (one conversation per booking).
// `base` is the signed-in side: "/users" (customer), "/companies" or "/freelancers".
export type MessagesBase = "/users" | "/companies" | "/freelancers";
export type Conversation = {
  _id: string; booking: string; providerName?: string; customerName?: string; reference?: string; service?: string;
  lastMessage?: { body: string; from: "customer" | "provider"; at: string }; unreadForMe: number; updatedAt: string;
};
export type ChatMessage = { _id: string; from: "customer" | "provider"; body: string; createdAt: string };
export type Thread = { conversation: Conversation; booking: { reference?: string; service: string; status: string; scheduledDate?: string; timeSlot?: string } | null; messages: ChatMessage[]; hasOlder: boolean; me: "customer" | "provider" };

export const inboxPaths: Record<MessagesBase, string> = { "/users": "/dashboard/messages", "/companies": "/company-dashboard/messages", "/freelancers": "/freelancer/messages" };

export const messagesApi = {
  list: (base: MessagesBase) => apiRequest<Conversation[]>(`${base}/messages`) as unknown as Promise<{ data: Conversation[]; total: number; unread: number }>,
  open: (base: MessagesBase, bookingId: string) => apiRequest<Conversation>(`${base}/messages`, { method: "POST", body: { bookingId } }),
  thread: (base: MessagesBase, id: string, before?: string) => apiRequest<Thread>(`${base}/messages/${id}${before ? `?before=${before}` : ""}`),
  send: (base: MessagesBase, id: string, body: string) => apiRequest<ChatMessage>(`${base}/messages/${id}`, { method: "POST", body: { body } }),
  read: (base: MessagesBase, id: string) => apiRequest(`${base}/messages/${id}/read`, { method: "PATCH" }),
};

export const shortTime = (value: string) => {
  const date = new Date(value);
  const today = new Date();
  return date.toDateString() === today.toDateString() ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
