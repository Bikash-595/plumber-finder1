"use client";

import { API_BASE_URL, clearStoredAdmin, readStoredAdmin } from "./adminAuth";

export type Paginated<T> = { data: T[]; page: number; limit: number; total: number };

export class AdminApiError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}

/** Calls /api/admin/* (or /api/auth/admins/*) with the admin token. A rejected token signs the admin out. */
export async function adminRequest<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = readStoredAdmin()?.accessToken;
  if (!token) throw new AdminApiError("Please sign in.", 401);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: init.method ?? "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new AdminApiError("Cannot reach the backend.");
  }
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401 || response.status === 403) {
    clearStoredAdmin(); // expired, revoked, or not an admin token
    throw new AdminApiError(payload.message || "Your admin session has ended. Please sign in again.", response.status);
  }
  if (!response.ok) {
    const [field, problem] = Object.entries((payload.errors ?? {}) as Record<string, string>)[0] ?? [];
    throw new AdminApiError(field ? `${field} ${problem}` : payload.message || `Request failed (${response.status}).`, response.status);
  }
  return payload as T;
}

// ---------- shapes ----------
export type Overview = {
  totals: { users: number; companies: number; freelancers: number; publishedCompanies: number; publishedFreelancers: number };
  newThisWeek: { users: number; companies: number; freelancers: number };
  pendingApprovals: { companies: number; freelancers: number };
  companiesByStatus: Record<string, number>;
  freelancersByStatus: Record<string, number>;
  bookingsByStatus: Record<string, number>;
  invoices: Record<string, { count: number; total: number }>;
};
export type AdminCustomer = { _id: string; name: string; email: string; phone?: string; createdAt: string; signInMethods: string[]; bookingCount: number };
export type CompanyStatus = "pending" | "approved" | "suspended";
export type AdminCompany = { _id: string; companyName: string; email: string; phone?: string; status: CompanyStatus; createdAt: string; listing: { _id: string; isPublished: boolean; city?: string; state?: string; services?: string[] } | null };
export type FreelancerStatus = "pending" | "verified" | "rejected";
export type AdminFreelancer = { _id: string; name: string; email: string; phone?: string; verificationStatus: FreelancerStatus; createdAt: string; listing: { _id: string; displayName: string; headline?: string; city?: string; state?: string; isPublished: boolean } | null };
export type BookingStatus = "pending" | "scheduled" | "completed" | "cancelled";
export type AdminBooking = { _id: string; providerName: string; service: string; status: BookingStatus; scheduledDate?: string; timeSlot?: string; address?: string; createdAt: string; source: string; user: { _id: string; name: string; email: string } | null };
export type Registration = { _id: string; accountType: "user" | "company" | "freelancer"; name: string; email: string; status?: string; createdAt: string };

const query = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => [k, String(v)]));
  return search.toString() ? `?${search}` : "";
};

export const adminApi = {
  me: () => adminRequest<{ account: { name: string; email: string } }>("/auth/admins/me"),
  overview: () => adminRequest<{ data: Overview }>("/admin/overview"),
  users: (params: { search?: string; page?: number }) => adminRequest<Paginated<AdminCustomer>>(`/admin/users${query(params)}`),
  companies: (params: { search?: string; status?: string; page?: number }) => adminRequest<Paginated<AdminCompany>>(`/admin/companies${query(params)}`),
  setCompanyStatus: (id: string, status: CompanyStatus) => adminRequest<{ data: AdminCompany }>(`/admin/companies/${id}/status`, { method: "PATCH", body: { status } }),
  freelancers: (params: { search?: string; status?: string; page?: number }) => adminRequest<Paginated<AdminFreelancer>>(`/admin/freelancers${query(params)}`),
  setFreelancerStatus: (id: string, verificationStatus: FreelancerStatus) => adminRequest<{ data: AdminFreelancer }>(`/admin/freelancers/${id}/verification`, { method: "PATCH", body: { verificationStatus } }),
  bookings: (params: { search?: string; status?: string; page?: number }) => adminRequest<Paginated<AdminBooking>>(`/admin/bookings${query(params)}`),
  setBookingStatus: (id: string, status: Exclude<BookingStatus, "pending">) => adminRequest<{ data: AdminBooking }>(`/admin/bookings/${id}/status`, { method: "PATCH", body: { status } }),
  registrations: (days = 30) => adminRequest<{ data: Registration[]; days: number }>(`/admin/registrations?days=${days}`),
};

export const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "—");
export const formatMoney = (value = 0) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
