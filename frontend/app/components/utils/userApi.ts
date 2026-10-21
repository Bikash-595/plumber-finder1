"use client";

// Typed calls to the customer backend (/api/users/*). Every change broadcasts USER_DATA_EVENT
// so the navbar badges and dashboard refresh without a page reload.
import type { Plumber } from "@/components/find/types";
import { apiRequest } from "./apiClient";
import { readStoredUser } from "./auth";

export const USER_DATA_EVENT = "plumberfinder:user-data-changed";
const LOGIN_MESSAGE = "Please log in with a customer account to continue.";

/** True when a customer (not a company/freelancer) is signed in. */
export function isCustomerSignedIn() {
  const user = readStoredUser();
  return Boolean(user?.accessToken) && (user?.accountType ?? "seeker") === "seeker";
}

const call = <T,>(path: string, init?: { method?: string; body?: unknown }) => apiRequest<T>(`/users${path}`, { ...init, loginMessage: LOGIN_MESSAGE });
async function mutate<T>(path: string, init: { method: string; body?: unknown }) {
  const result = await call<T>(path, init);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(USER_DATA_EVENT));
  return result;
}

// ---------- shapes ----------
export type ProviderRef = { providerType: "company" | "freelancer"; providerId: string };
export type ProviderSnapshot = ProviderRef & { name: string; image?: string; rating?: number; reviewCount?: number; location?: string; priceRange?: string; discount?: string };
export type ListItem = ProviderSnapshot & { _id: string; createdAt: string };
export type CartItem = ProviderRef & { _id: string; providerName: string; name: string; price: number; quantity: number; image?: string; itemType: "service" | "offer" };
export type CartSummary = { itemCount: number; subtotal: number; promoCode: string | null; discountPercent: number; discount: number; taxRate: number; tax: number; total: number };
export type Cart = { items: CartItem[]; summary: CartSummary };
export type Booking = ProviderRef & { _id: string; providerName: string; service: string; quantity: number; price?: number; scheduledDate?: string; timeSlot?: string; address?: string; phone?: string; details?: string; status: "pending" | "scheduled" | "completed" | "cancelled"; source: "request" | "checkout"; createdAt: string };
export type Notification = { _id: string; type: "booking" | "order" | "offer" | "system"; title: string; message?: string; link?: string; read: boolean; createdAt: string };
export type Invoice = { _id: string; number: string; items: { name: string; providerName?: string; quantity: number; price: number }[]; subtotal: number; discount: number; tax: number; total: number; promoCode?: string; status: "pending" | "paid" | "cancelled" | "refunded"; dueDate?: string; createdAt: string };
export type PaymentMethod = { _id: string; brand: "visa" | "mastercard" | "amex" | "discover" | "other"; last4: string; expMonth: number; expYear: number; holderName?: string; label?: string; isDefault: boolean };
export type UserSettings = { emailNotifications: boolean; smsNotifications: boolean; pushNotifications: boolean; marketingEmails: boolean; bookingReminders: boolean; publicProfile: boolean };
export type DashboardSummary = {
  counts: { cart: number; saved: number; compare: number; activeBookings: number; completedBookings: number; unreadNotifications: number; pendingInvoices: number };
  totalSpent: number;
  upcomingBookings: Booking[];
  recentNotifications: Notification[];
};
export type Profile = { _id: string; name: string; email: string; phone?: string; address?: string; avatarUrl?: string };

/** Display snapshot of a plumber card, used when saving, comparing, or adding to the cart. */
export function plumberToProvider(plumber: Plumber): ProviderSnapshot {
  const image = plumber.logo || plumber.media?.images?.[0];
  return {
    providerType: "company",
    providerId: plumber.id,
    name: plumber.companyName,
    // Only http(s) URLs and site paths are stored (uploaded data URLs are too large for a snapshot).
    ...(image && /^(https?:\/\/|\/(?!\/))/.test(image) ? { image } : {}),
    rating: plumber.rating,
    reviewCount: plumber.reviewCount,
    location: plumber.location || undefined,
    priceRange: plumber.priceRange || undefined,
    discount: plumber.discount || undefined,
  };
}

// ---------- endpoints ----------
export const userApi = {
  dashboard: () => call<DashboardSummary>("/dashboard"),

  profile: () => call<Profile>("/profile"),
  saveProfile: (values: { name: string; phone?: string; address?: string; avatarUrl?: string }) => mutate<Profile>("/profile", { method: "PUT", body: values }),

  settings: () => call<UserSettings>("/settings"),
  saveSettings: (values: Partial<UserSettings>) => mutate<UserSettings>("/settings", { method: "PUT", body: values }),

  security: () => call<{ hasPassword: boolean; googleLinked: boolean; appleLinked: boolean }>("/security"),
  changePassword: (body: { currentPassword?: string; newPassword: string }) => mutate<unknown>("/security/password", { method: "POST", body }),

  saved: () => call<ListItem[]>("/saved"),
  save: (provider: ProviderSnapshot) => mutate<ListItem>("/saved", { method: "POST", body: provider }),
  unsave: ({ providerType, providerId }: ProviderRef) => mutate<unknown>(`/saved/provider/${providerType}/${encodeURIComponent(providerId)}`, { method: "DELETE" }),

  compare: () => call<ListItem[]>("/compare"),
  addToCompare: (provider: ProviderSnapshot) => mutate<ListItem>("/compare", { method: "POST", body: provider }),
  removeFromCompare: ({ providerType, providerId }: ProviderRef) => mutate<unknown>(`/compare/provider/${providerType}/${encodeURIComponent(providerId)}`, { method: "DELETE" }),

  cart: () => call<Cart>("/cart"),
  addToCart: (item: ProviderRef & { providerName: string; name: string; price: number; quantity?: number; image?: string; itemType?: "service" | "offer" }) => mutate<Cart>("/cart/items", { method: "POST", body: item }),
  setCartQuantity: (id: string, quantity: number) => mutate<Cart>(`/cart/items/${id}`, { method: "PATCH", body: { quantity } }),
  removeFromCart: (id: string) => mutate<Cart>(`/cart/items/${id}`, { method: "DELETE" }),
  applyPromo: (code: string) => mutate<Cart>("/cart/promo", { method: "POST", body: { code } }),
  removePromo: () => mutate<Cart>("/cart/promo", { method: "DELETE" }),
  checkout: (body: { address: string; phone?: string; scheduledDate?: string; timeSlot?: string; details?: string }) => mutate<{ invoice: Invoice; bookings: Booking[] }>("/checkout", { method: "POST", body }),

  bookings: (status?: Booking["status"]) => call<Booking[]>(`/bookings${status ? `?status=${status}` : ""}`),
  requestBooking: (body: ProviderRef & { providerName: string; service: string; scheduledDate?: string; timeSlot?: string; address?: string; phone?: string; details?: string; offer?: string }) => mutate<Booking>("/bookings", { method: "POST", body }),
  cancelBooking: (id: string) => mutate<Booking>(`/bookings/${id}/cancel`, { method: "PATCH" }),

  notifications: () => call<Notification[]>("/notifications"),
  markNotificationRead: (id: string) => mutate<Notification>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => mutate<unknown>("/notifications/read-all", { method: "POST" }),
  deleteNotification: (id: string) => mutate<unknown>(`/notifications/${id}`, { method: "DELETE" }),

  invoices: () => call<Invoice[]>("/invoices"),

  paymentMethods: () => call<PaymentMethod[]>("/payment-methods"),
  addPaymentMethod: (body: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }) => mutate<PaymentMethod>("/payment-methods", { method: "POST", body }),
  setDefaultPaymentMethod: (id: string) => mutate<PaymentMethod>(`/payment-methods/${id}`, { method: "PATCH", body: { isDefault: true } }),
  removePaymentMethod: (id: string) => mutate<unknown>(`/payment-methods/${id}`, { method: "DELETE" }),
};

export const formatMoney = (value: number) => `$${value.toFixed(2)}`;
// Booking dates are stored as midnight UTC, so format in UTC to avoid showing the previous day.
export const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "");
