"use client";

import { apiRequest } from "@/components/utils/apiClient";
import { apiBase } from "@/components/utils/providerSide";

// The premium page's API (/api/companies/premium or /api/freelancers/premium, from the signed-in account).
// The browser only ever sends a plan id and an interval; prices and payment state come from the server.

export type PlanId = "premium" | "elite";
export type Interval = "month" | "year";
export type Plan = { id: PlanId; name: string; rank: number; features: string[]; prices: Record<Interval, number> };
export type Subscription = {
  id: string; plan: PlanId; planName: string; interval: Interval; status: "pending" | "active" | "past_due" | "canceled" | "expired";
  source: "stripe" | "manual"; active: boolean; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean; requestNote: string | null; canManageCard: boolean;
  history: { at: string; event: string; by: string; note?: string }[];
};
export type Payment = { _id: string; plan: PlanId; amount: number; currency: string; status: "paid" | "failed" | "refunded"; source: "stripe" | "manual"; periodStart?: string; periodEnd?: string; invoiceUrl?: string; createdAt: string };
export type PremiumPage = { mode: "stripe" | "manual"; currency: string; plans: Plan[]; subscription: Subscription | null; payments: Payment[] };

const loginMessage = "Please log in with your business account.";
const post = <T,>(path: string, body?: unknown) => apiRequest<T>(`${apiBase()}/premium${path}`, { method: "POST", body, loginMessage });

export const premiumApi = {
  page: () => apiRequest<PremiumPage>(`${apiBase()}/premium`, { loginMessage }).then((r) => r.data),
  /** Card payment: returns Stripe's Checkout page to go to. */
  checkout: (plan: PlanId, interval: Interval) => post<{ url: string }>("/checkout", { plan, interval }),
  /** Manual mode: ask the team to set premium up. */
  request: (plan: PlanId, interval: Interval, note?: string) => post<PremiumPage>("/request", { plan, interval, note }),
  cancel: () => post<PremiumPage>("/cancel"),
  resume: () => post<PremiumPage>("/resume"),
  portal: () => post<{ url: string }>("/portal"),
};

/** "$49" or "$49.50" from cents. */
export const money = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;

/** Only Stripe's own pages may be opened from a checkout/portal answer. */
export const isStripeUrl = (url: string) => /^https:\/\/([a-z0-9-]+\.)*stripe\.com\//i.test(url);
