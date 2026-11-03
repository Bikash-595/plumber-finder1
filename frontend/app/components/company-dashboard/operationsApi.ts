"use client";

import { apiRequest } from "@/components/utils/apiClient";
import type { ProviderBooking } from "@/components/bookings/bookingsApi";
import { apiBase } from "@/components/utils/providerSide";

// Operations endpoints for the company dashboard: /api/companies/leads, /jobs, /schedule, /customers.
const loginMessage = "Please log in with your business account.";
const qs = (params: Record<string, string | number | null | undefined>) => {
  const search = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => [k, String(v)]));
  return search.size ? `?${search}` : "";
};

export type LeadStage = "new" | "won" | "lost";
export type Lead = { _id: string; reference?: string; customerName?: string; service: string; status: ProviderBooking["status"]; scheduledDate?: string; timeSlot?: string; price?: number; quantity?: number; details?: string; couponCode?: string; createdAt: string; responseNote?: string; stage: LeadStage; waitingMinutes: number | null };
export type LeadsPage = { data: Lead[]; nextCursor: string | null; stage: LeadStage; counts?: Record<LeadStage, number>; summary?: { days: number; requests: number; winRate: number | null; avgWaitingHours: number }; signals?: Record<string, number> };
export type JobStage = "scheduled" | "in_progress" | "awaiting_confirmation" | "completed" | "disputed" | "cancelled";
export type Job = ProviderBooking;
export type JobsPage = { data: Job[]; nextCursor: string | null; counts?: Record<JobStage, number> };
export type JobNote = { _id: string; body: string; createdAt: string };
export type ScheduleItem = { _id: string; reference?: string; customerName?: string; service: string; status: ProviderBooking["status"]; scheduledDate: string; timeSlot?: string; address?: string; price?: number; quantity?: number };
export type Schedule = { from: string; to: string; items: ScheduleItem[]; hours: { weekly: { day: string; isOpen: boolean; opensAt?: string; closesAt?: string }[]; emergency: string | null } | null };
export type CustomerRow = { id: string; name?: string; bookings: number; completed: number; active: number; spent: number; firstBooked: string; lastBooked: string; lastService: string; contactVisible: boolean; email: string | null; phone: string | null };
export type CustomersPage = { data: CustomerRow[]; page: number; limit: number; total: number; summary: { customers: number; repeat: number; spent: number; avgPerCustomer: number } };
export type CustomerDetail = { id: string; name?: string; bookings: ProviderBooking[]; reviews: { _id: string; rating: number; title?: string; body: string; source: string; createdAt: string; reply?: { body: string } }[] };

export const operationsApi = {
  leads: (params: { stage?: LeadStage; q?: string; cursor?: string | null }) => apiRequest<Lead[]>(`${apiBase()}/leads${qs(params)}`, { loginMessage }) as unknown as Promise<LeadsPage>,
  jobs: (params: { stage?: string; q?: string; assignee?: string; cursor?: string | null }) => apiRequest<Job[]>(`${apiBase()}/jobs${qs(params)}`, { loginMessage }) as unknown as Promise<JobsPage>,
  job: (id: string) => apiRequest<Job & { notes: JobNote[] }>(`${apiBase()}/jobs/${id}`, { loginMessage }),
  addNote: (id: string, body: string) => apiRequest<JobNote>(`${apiBase()}/jobs/${id}/notes`, { method: "POST", body: { body }, loginMessage }),
  removeNote: (id: string, noteId: string) => apiRequest(`${apiBase()}/jobs/${id}/notes/${noteId}`, { method: "DELETE", loginMessage }),
  schedule: (from: string, to: string) => apiRequest<Schedule>(`${apiBase()}/schedule${qs({ from, to })}`, { loginMessage }),
  customers: (params: { q?: string; sort?: string; page?: number }) => apiRequest<CustomerRow[]>(`${apiBase()}/customers${qs(params)}`, { loginMessage }) as unknown as Promise<CustomersPage>,
  customer: (id: string) => apiRequest<CustomerDetail>(`${apiBase()}/customers/${id}`, { loginMessage }),
};

export const visitDate = (value?: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) => (value ? new Date(value).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" }) : "Flexible date");
export const waiting = (minutes: number | null) => (minutes === null ? "" : minutes < 60 ? `${Math.max(1, minutes)} min` : minutes < 1440 ? `${Math.round(minutes / 60)} h` : `${Math.round(minutes / 1440)} d`);
