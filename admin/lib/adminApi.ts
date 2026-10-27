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
// pending = waiting for the plumber; scheduled = confirmed; declined = the plumber (or an admin) said no.
export type BookingStatus = "pending" | "scheduled" | "completed" | "cancelled" | "declined";
export type BookingHistoryEntry = { status: BookingStatus; by: "customer" | "provider" | "admin" | "system"; note?: string; at: string };
export type AdminBooking = {
  _id: string; reference?: string; customerName?: string; customerEmail?: string; providerType: "company" | "freelancer"; providerId: string; providerAccount?: string | null;
  providerName: string; service: string; quantity?: number; price?: number; status: BookingStatus; scheduledDate?: string; timeSlot?: string; address?: string; phone?: string; details?: string;
  responseNote?: string; history?: BookingHistoryEntry[]; couponCode?: string; couponLabel?: string; originalPrice?: number; discountAmount?: number; createdAt: string; source: string; user: { _id: string; name: string; email: string; phone?: string } | null;
};
export type AdminBookingDetail = AdminBooking & { provider: { hasAccount: boolean; phone?: string; email?: string; url: string } };
export type BlogFaq = { question: string; answer: string };
export type PlatformBlog = { _id: string; title: string; slug: string; category?: string; excerpt: string; content?: string; coverImage?: string; author?: string; publishDate?: string; tags?: string[]; faqs?: BlogFaq[]; status: "draft" | "published"; updatedAt: string };
export type BlogComment = { _id: string; root: string | null; body: string; deleted: boolean; edited: boolean; createdAt: string; likes: number; dislikes: number; replyTo: { name: string } | null; author: { name: string; type: string; isPostAuthor: boolean }; replies?: BlogComment[] };
export type BlogStatRow = { _id: string; title: string; views: number; readers: number; signedInReaders: number; likes: number; dislikes: number; comments: number };
export type BlogStats = { data: BlogStatRow[]; totals: { views: number; readers: number; likes: number; comments: number }; site: { views: number; readers: number; byType: Record<"platform" | "company" | "freelancer" | "demo", { views: number; readers: number; postsRead: number }> } };
export type ActivityEvent = "profile_view" | "project_view" | "blog_read" | "compare_add" | "save" | "call_click" | "email_click" | "website_click" | "share" | "booking";
export type ProviderActivityRow = {
  providerType: "company" | "freelancer"; providerId: string; name: string; location?: string; url: string; sample?: boolean;
  profileViews: number; visitors: number; projectViews: number; blogReads: number; compareAdds: number; saves: number; contactClicks: number; shares: number;
  bookings: number; customers: number; repeatCustomers: number; pendingBookings: number; acceptedBookings: number; declinedBookings: number; cancelledBookings: number; lastActivity: string | null;
};
export type ActivityItem = { _id: string; event: ActivityEvent; createdAt: string; providerType: "company" | "freelancer"; providerId: string; providerName?: string; target?: { id?: string; title?: string }; actor: { type: string; name: string; email?: string | null; guestId?: string } };
export type ProviderActivityDetail = ProviderActivityRow & {
  daily: { date: string; profileViews: number; bookings: number }[];
  customerList: { userId: string; name: string; email?: string; bookings: number; firstBooking: string; lastBooking: string; services: string[]; accepted: number; declined: number }[];
  bookingList: { _id: string; reference?: string; customerName?: string; customerEmail?: string; service: string; status: BookingStatus; scheduledDate?: string; timeSlot?: string; createdAt: string; responseNote?: string }[];
  activity: ActivityItem[];
};
export type AdminNotice = { _id: string; type: "booking" | "system"; title: string; message?: string; link?: string; read: boolean; createdAt: string };
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
  bookings: (params: { search?: string; status?: string; page?: number }) => adminRequest<Paginated<AdminBooking> & { counts: Record<BookingStatus, number> }>(`/admin/bookings${query(params)}`),
  booking: (id: string) => adminRequest<{ data: AdminBookingDetail }>(`/admin/bookings/${id}`),
  // note is shown to the customer and the plumber (required to decline or cancel); confirming can set the visit date/time.
  setBookingStatus: (id: string, status: Exclude<BookingStatus, "pending">, extra: { note?: string; scheduledDate?: string; timeSlot?: string } = {}) => adminRequest<{ data: AdminBooking; message: string }>(`/admin/bookings/${id}/status`, { method: "PATCH", body: { status, ...extra } }),
  // Plumber Finder's own blog posts (with FAQs), and the comments on them.
  blogs: (params: { search?: string; status?: string; page?: number }) => adminRequest<Paginated<PlatformBlog>>(`/admin/blogs${query(params)}`),
  blog: (id: string) => adminRequest<{ data: PlatformBlog }>(`/admin/blogs/${id}`),
  saveBlog: (id: string | null, body: Partial<PlatformBlog>) => adminRequest<{ data: PlatformBlog; message: string }>(id ? `/admin/blogs/${id}` : "/admin/blogs", { method: id ? "PUT" : "POST", body }),
  // Views (each read) and readers (different people) for Plumber Finder's posts and every blog on the site.
  blogStats: () => adminRequest<BlogStats>("/blogs/stats/mine"),
  deleteBlog: (id: string) => adminRequest<{ message: string }>(`/admin/blogs/${id}`, { method: "DELETE" }),
  blogComments: (postId: string, page = 1) => adminRequest<{ data: BlogComment[]; total: number }>(`/blogs/posts/platform/${postId}/comments?sort=newest&page=${page}`),
  replyToComment: (postId: string, parentId: string, body: string) => adminRequest<{ data: BlogComment }>(`/blogs/posts/platform/${postId}/comments`, { method: "POST", body: { body, parentId } }),
  deleteComment: (id: string) => adminRequest<{ message: string }>(`/blogs/comments/${id}`, { method: "DELETE" }),
  // Who visited, read, compared, saved, contacted, and booked each plumber.
  activityProviders: (params: { type?: string; search?: string; sort?: string; page?: number }) => adminRequest<Paginated<ProviderActivityRow> & { totals: Record<string, number> }>(`/admin/activity/providers${query(params)}`),
  activityProvider: (type: string, id: string) => adminRequest<{ data: ProviderActivityDetail }>(`/admin/activity/providers/${type}/${id}`),
  recentActivity: (params: { event?: string; page?: number }) => adminRequest<Paginated<ActivityItem>>(`/admin/activity/recent${query(params)}`),
  notifications: () => adminRequest<{ data: AdminNotice[]; unread: number }>("/admin/notifications"),
  unreadNotifications: () => adminRequest<{ data: { unread: number } }>("/admin/notifications/unread-count"),
  markNotificationRead: (id: string) => adminRequest<{ data: AdminNotice }>(`/admin/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => adminRequest<{ message: string }>("/admin/notifications/read-all", { method: "PATCH" }),
  removeNotification: (id: string) => adminRequest<{ message: string }>(`/admin/notifications/${id}`, { method: "DELETE" }),
  registrations: (days = 30) => adminRequest<{ data: Registration[]; days: number }>(`/admin/registrations?days=${days}`),
};

export const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "—");
export const formatMoney = (value = 0) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
