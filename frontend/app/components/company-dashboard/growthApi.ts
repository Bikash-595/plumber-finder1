"use client";

import { apiRequest } from "@/components/utils/apiClient";
import type { ProviderBooking } from "@/components/bookings/bookingsApi";

// Growth tools in the company dashboard: /api/companies/quotes, /availability, /saved-replies, and job assignment.
const loginMessage = "Please log in with your company account.";
const qs = (params: Record<string, string | null | undefined>) => {
  const search = new URLSearchParams(Object.entries(params).filter(([, v]) => v).map(([k, v]) => [k, String(v)]));
  return search.size ? `?${search}` : "";
};

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "withdrawn" | "expired";
export type QuoteLine = { description: string; quantity: number; unitPrice: number; amount?: number };
export type Quote = {
  _id: string; number: string; booking: string; bookingReference?: string; customerName?: string; title?: string; items: Required<QuoteLine>[];
  subtotal: number; discount: number; taxRate: number; tax: number; total: number; notes?: string; validUntil?: string;
  status: QuoteStatus; sentAt?: string; respondedAt?: string; declineReason?: string; createdAt: string;
};
export type QuoteInput = { bookingId?: string; title?: string; items: QuoteLine[]; discount?: number; taxRate?: number; notes?: string; validUntil?: string | null; send?: boolean };
export type QuotesPage = { data: Quote[]; nextCursor: string | null; counts?: Record<Exclude<QuoteStatus, "expired">, number>; value?: { open: number; won: number }; acceptanceRate?: number | null };
export type Availability = { acceptingBookings: boolean; pauseMessage: string; maxJobsPerDay: number; minNoticeDays: number; timeOff: { _id?: string; start: string; end: string; reason?: string }[] };
export type SavedReply = { _id: string; title: string; body: string; category: "message" | "decline" | "follow-up" | "other" };
export type TeamMember = { _id: string; name: string; role?: string };

export const growthApi = {
  quotes: (params: { status?: string; q?: string; cursor?: string | null }) => apiRequest<Quote[]>(`/companies/quotes${qs(params)}`, { loginMessage }) as unknown as Promise<QuotesPage>,
  quote: (id: string) => apiRequest<Quote>(`/companies/quotes/${id}`, { loginMessage }),
  createQuote: (body: QuoteInput) => apiRequest<Quote>("/companies/quotes", { method: "POST", body, loginMessage }),
  updateQuote: (id: string, body: QuoteInput) => apiRequest<Quote>(`/companies/quotes/${id}`, { method: "PATCH", body, loginMessage }),
  sendQuote: (id: string) => apiRequest<Quote>(`/companies/quotes/${id}/send`, { method: "POST", loginMessage }),
  withdrawQuote: (id: string) => apiRequest<Quote>(`/companies/quotes/${id}/withdraw`, { method: "POST", loginMessage }),
  deleteQuote: (id: string) => apiRequest(`/companies/quotes/${id}`, { method: "DELETE", loginMessage }),
  availability: () => apiRequest<Availability>("/companies/availability", { loginMessage }).then((r) => r.data),
  saveAvailability: (body: Partial<Availability>) => apiRequest<Availability>("/companies/availability", { method: "PUT", body, loginMessage }),
  savedReplies: () => apiRequest<SavedReply[]>("/companies/saved-replies", { loginMessage }).then((r) => r.data),
  addReply: (body: Omit<SavedReply, "_id">) => apiRequest<SavedReply>("/companies/saved-replies", { method: "POST", body, loginMessage }),
  updateReply: (id: string, body: Partial<Omit<SavedReply, "_id">>) => apiRequest<SavedReply>(`/companies/saved-replies/${id}`, { method: "PATCH", body, loginMessage }),
  removeReply: (id: string) => apiRequest(`/companies/saved-replies/${id}`, { method: "DELETE", loginMessage }),
  team: () => apiRequest<TeamMember[]>("/companies/jobs/team", { loginMessage }).then((r) => r.data),
  assign: (jobId: string, memberId: string | null) => apiRequest<ProviderBooking>(`/companies/jobs/${jobId}/assign`, { method: "PATCH", body: { memberId }, loginMessage }),
};

/** The same maths as the server (shown live while editing; the server's numbers are what's saved). */
export function previewTotals(items: QuoteLine[], discount = 0, taxRate = 0) {
  const c = (v: number) => Math.round(v * 100) / 100;
  const subtotal = c(items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0));
  const off = Math.min(c(discount || 0), subtotal);
  const tax = c((subtotal - off) * ((taxRate || 0) / 100));
  return { subtotal, discount: off, tax, total: c(subtotal - off + tax) };
}
