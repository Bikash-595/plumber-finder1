"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "@/components/utils/apiClient";
import { readStoredUser, storeUser } from "@/components/utils/auth";
import { fetchShared, readCache, writeCache } from "@/components/dashboard/dataCache";

// The company dashboard's own endpoints: /api/companies/dashboard, /analytics, /settings.

export type Kpi = { value: number; previous: number; change: number };
export type Rate = { value: number | null; previous: number | null };
export type StrengthItem = { key: string; group: string; label: string; weight: number; done: boolean; progress?: string; tip: string; href: string };
export type Strength = { percent: number; level: string; items: StrengthItem[]; next: string[]; extras: { blogs: number; services: number; photos: number; reviews: number } };
export type ListingSummary = { id: string; slug: string; name: string; published: boolean; logo: string | null; city?: string; state?: string };
export type BookingRow = { _id: string; reference?: string; customerName?: string; service: string; status: string; scheduledDate?: string; timeSlot?: string; price?: number; quantity?: number; createdAt: string };
export type NoticeRow = { _id: string; type: "booking" | "review" | "comment" | "system"; title: string; message?: string; link?: string; read: boolean; createdAt: string };

export type CompanyDashboard = {
  account: { companyName?: string; status?: "pending" | "approved" | "suspended"; emailVerified: boolean };
  listing: ListingSummary | null;
  strength: { percent: number; level: string; next: StrengthItem[] };
  period: { days: number };
  kpis: { views: Kpi; visitors: Kpi; contacts: Kpi; requests: Kpi; completed: Kpi; revenue: Kpi; acceptanceRate: number | null; avgReplyMinutes: number | null };
  actions: { pendingRequests: number; awaitingConfirmation: number; disputed: number; inProgress: number; scheduled: number; unansweredReviews: number; unreadNotifications: number };
  pending: BookingRow[];
  upcoming: BookingRow[];
  reviews: { platform: { average: number; count: number }; verified: number; directory: number; google: { rating: number; count: number } | null };
  trend: { day: string; views: number; bookings: number }[];
  notifications: NoticeRow[];
};

export type CompanyAnalytics = {
  days: number; from: string; to: string; granularity: "day" | "month"; hasListing: boolean;
  kpis: { views: Kpi; visitors: Kpi; contacts: Kpi; requests: Kpi; completed: Kpi; revenue: Kpi; avgJobValue: Kpi; conversionRate: Rate; acceptanceRate: Rate; avgReplyMinutes: Rate };
  timeline: { key: string; views: number; bookings: number; completed: number; revenue: number }[];
  funnel: { key: string; label: string; value: number }[];
  actions: { event: string; count: number }[];
  topServices: { service: string; bookings: number; completed: number; revenue: number }[];
  weekdays: { label: string; count: number }[];
  statuses: Record<string, number>;
  reviews: { count: number; average: number | null; verified: number; directory: number };
};

export type CompanySettings = {
  account: { companyName: string; email: string; phone: string; emailVerified: boolean; status: string; createdAt: string };
  preferences: { emailNewBooking: boolean; emailBookingUpdates: boolean; emailNewReview: boolean };
  security: { hasPassword: boolean; googleLinked: boolean; appleLinked: boolean; passwordChangedAt: string | null; recentLogins: { _id: string; method?: string; ip?: string; userAgent?: string; createdAt: string }[] };
};

const loginMessage = "Please log in with your company account.";
const get = <T,>(path: string) => () => apiRequest<T>(path, { loginMessage }).then(({ data }) => data);

/** A new token after a password change or "sign out everywhere": this browser stays signed in. */
function keepSession(token: string) {
  const user = readStoredUser();
  if (user) storeUser({ ...user, accessToken: token });
}

export const companyApi = {
  dashboard: get<CompanyDashboard>("/companies/dashboard"),
  strength: get<Strength & { listing: ListingSummary | null }>("/companies/dashboard/strength"),
  analytics: (days: number) => get<CompanyAnalytics>(`/companies/analytics?days=${days}`)(),
  settings: get<CompanySettings>("/companies/settings"),
  savePreferences: (body: Partial<CompanySettings["preferences"]>) => apiRequest<CompanySettings["preferences"]>("/companies/settings/preferences", { method: "PUT", body, loginMessage }),
  saveAccount: (body: { phone: string }) => apiRequest<CompanySettings["account"]>("/companies/settings/account", { method: "PUT", body, loginMessage }),
  changePassword: async (body: { currentPassword?: string; newPassword: string }) => {
    const result = await apiRequest<{ token: string }>("/companies/settings/password", { method: "POST", body, loginMessage });
    keepSession(result.data.token);
    return result;
  },
  signOutEverywhere: async () => {
    const result = await apiRequest<{ token: string }>("/companies/settings/sign-out-everywhere", { method: "POST", loginMessage });
    keepSession(result.data.token);
    return result;
  },
};

/**
 * Loads company data with the shared cache: instant when you come back to a page, refreshed in the background,
 * and one request shared by every component asking at the same time. `key` names the data.
 */
export function useCompanyData<T>(key: string, load: () => Promise<T>) {
  const [state, setState] = useState<{ key: string; data?: T; error: string }>(() => ({ key, data: readCache<T>(key), error: "" }));
  const run = useEffectEvent(() => load());
  const apply = useEffectEvent((data: T) => setState({ key, data, error: "" }));
  const fail = useEffectEvent((caught: unknown) => setState((current) => ({ ...current, key, error: caught instanceof Error ? caught.message : "Something went wrong." })));

  useEffect(() => {
    let cancelled = false;
    fetchShared(key, run).then((data) => { if (!cancelled) apply(data); }).catch((caught) => { if (!cancelled) fail(caught); });
    return () => { cancelled = true; };
  }, [key]);

  const reload = useCallback(() => load().then((data) => { writeCache(key, data); setState({ key, data, error: "" }); }).catch((caught) => setState((current) => ({ ...current, error: caught instanceof Error ? caught.message : "Something went wrong." }))), [key, load]);
  const data = state.key === key ? state.data : readCache<T>(key);
  return { data, error: state.key === key ? state.error : "", loading: data === undefined && !(state.key === key && state.error), reload, setData: (value: T) => { writeCache(key, value); setState({ key, data: value, error: "" }); } };
}

export const formatMoney = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value >= 1000 ? 0 : 2 });
export const formatMinutes = (minutes: number | null) => (minutes === null ? "—" : minutes < 60 ? `${minutes} min` : minutes < 1440 ? `${Math.round(minutes / 60)} h` : `${Math.round(minutes / 1440)} d`);
