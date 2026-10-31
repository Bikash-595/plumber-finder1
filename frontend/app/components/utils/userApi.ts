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
export type BookingHistoryEntry = { status: Booking["status"]; by: "customer" | "provider" | "admin" | "system"; note?: string; at: string };
export type Booking = ProviderRef & { _id: string; reference?: string; couponCode?: string; couponLabel?: string; originalPrice?: number; discountAmount?: number; responseNote?: string; history?: BookingHistoryEntry[]; acceptedAt?: string; providerName: string; service: string; quantity: number; price?: number; scheduledDate?: string; timeSlot?: string; address?: string; phone?: string; details?: string; status: "pending" | "scheduled" | "completed" | "cancelled" | "declined"; source: "request" | "checkout"; createdAt: string };
export type Notification = { _id: string; type: "booking" | "order" | "offer" | "comment" | "system"; title: string; message?: string; link?: string; read: boolean; createdAt: string };
export type Invoice = { _id: string; number: string; items: { name: string; providerName?: string; quantity: number; price: number }[]; subtotal: number; discount: number; tax: number; total: number; promoCode?: string; status: "pending" | "paid" | "cancelled" | "refunded"; dueDate?: string; createdAt: string };
export type PaymentMethod = { _id: string; brand: "visa" | "mastercard" | "amex" | "discover" | "other"; last4: string; expMonth: number; expYear: number; holderName?: string; label?: string; isDefault: boolean };
export type UserSettings = { emailNotifications: boolean; smsNotifications: boolean; pushNotifications: boolean; marketingEmails: boolean; bookingReminders: boolean; publicProfile: boolean };
export type DashboardSummary = {
  counts: { cart: number; saved: number; compare: number; activeBookings: number; pendingBookings: number; scheduledBookings: number; completedBookings: number; totalBookings: number; unreadNotifications: number; pendingInvoices: number };
  totalSpent: number;
  amountDue: number;
  upcomingBookings: Booking[];
  recentNotifications: Notification[];
};
export type DashboardInsights = {
  months: number;
  bookingsByStatus: Record<Booking["status"], number>;
  totalBookings: number;
  completionRate: number;
  timeline: { month: string; bookings: number; spent: number }[];
  spentInPeriod: number;
  topProviders: (ProviderRef & { name: string; bookings: number; completed: number; lastBooked: string })[];
  savings: number;
  reviewsWritten: number;
};
export type ContactMethod = "phone" | "sms" | "email";
export type ContactTime = "anytime" | "morning" | "afternoon" | "evening";
export type Profile = {
  _id: string; name: string; email: string; emailVerified?: boolean; phone?: string | null; altPhone?: string | null; address?: string; avatarUrl?: string;
  zipCode?: string; city?: string; state?: string; createdAt?: string; googleId?: string; appleId?: string;
  preferredContact?: ContactMethod | null; contactTime?: ContactTime | null; language?: string | null;
  alternateContactName?: string | null; alternateContactPhone?: string | null;
};
export type ProfileUpdate = Partial<Pick<Profile, "phone" | "altPhone" | "address" | "avatarUrl" | "preferredContact" | "contactTime" | "language" | "alternateContactName" | "alternateContactPhone">> & { name: string };
export type PropertyType = "house" | "apartment" | "condo" | "townhouse" | "mobile_home" | "commercial" | "other";
export type Ownership = "owner" | "renter" | "landlord" | "property_manager";
export type Address = { _id: string; label: string; line1: string; line2?: string; city: string; state: string; zipCode: string; propertyType?: PropertyType | null; ownership?: Ownership | null; yearBuilt?: number | null; accessNotes?: string; isDefault: boolean };
export type AddressInput = Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean };
/** "12 Oak St, Apt 4, Austin, TX 78701" (same format as the server). */
export const formatAddress = (a: Pick<Address, "line1" | "line2" | "city" | "state" | "zipCode">) => [a.line1, a.line2, a.city, [a.state, a.zipCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
export type MyReview = { _id: string; rating: number; title: string; body: string; serviceCategory?: string; photos: string[]; verified?: boolean; createdAt: string; edited?: boolean; reply: { body: string; createdAt: string } | null; status: "published" | "pending" | "hidden" | "removed" | string; providerType: ProviderRef["providerType"]; providerId: string; providerName: string };

/** One page of a long list (newest first). Pass `nextCursor` back as `cursor` for the next page; null means no more. */
export type Page<T, Extra = object> = { data: T[]; nextCursor: string | null } & Partial<Extra>;
export type BookingPageExtra = { counts: Record<Booking["status"], number> };
export type InvoicePageExtra = { summary: { counts: Record<Invoice["status"], number>; totals: Record<Invoice["status"], number> } };
export type NotificationPageExtra = { unreadCount: number };
type PageQuery = Record<string, string | number | undefined | null>;
const query = (params: PageQuery = {}) => {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "").map(([key, value]) => [key, String(value)]));
  return search.size ? `?${search}` : "";
};
const page = async <T, Extra = object>(path: string, params?: PageQuery) => (await call<T[]>(`${path}${query(params)}`)) as unknown as Page<T, Extra>;

/** Display snapshot of a plumber card, used when saving, comparing, or adding to the cart. */
export function plumberToProvider(plumber: Plumber): ProviderSnapshot {
  const image = plumber.logo || plumber.media?.images?.[0];
  return {
    providerType: plumber.providerType ?? "company",
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
  insights: () => call<DashboardInsights>("/dashboard/insights?months=6"),

  profile: () => call<Profile>("/profile"),
  saveProfile: (values: ProfileUpdate) => mutate<Profile>("/profile", { method: "PUT", body: values }),

  addresses: () => call<Address[]>("/addresses"),
  addAddress: (body: AddressInput) => mutate<Address>("/addresses", { method: "POST", body }),
  updateAddress: (id: string, body: Partial<AddressInput>) => mutate<Address>(`/addresses/${id}`, { method: "PATCH", body }),
  removeAddress: (id: string) => mutate<unknown>(`/addresses/${id}`, { method: "DELETE" }),

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

  /** First page of bookings (newest first). Use bookingsPage for filters, search and more pages. */
  bookings: (status?: Booking["status"]) => call<Booking[]>(`/bookings${query({ status })}`),
  bookingsPage: (params: { status?: Booking["status"]; q?: string; providerType?: string; providerId?: string; cursor?: string | null; limit?: number } = {}) => page<Booking, BookingPageExtra>("/bookings", params),
  requestBooking: (body: ProviderRef & { providerName: string; service: string; scheduledDate?: string; timeSlot?: string; address?: string; phone?: string; details?: string; offer?: string; couponCode?: string }) => mutate<Booking>("/bookings", { method: "POST", body }),
  cancelBooking: (id: string, reason?: string) => mutate<Booking>(`/bookings/${id}/cancel`, { method: "PATCH", body: { reason } }),

  notifications: () => call<Notification[]>("/notifications"),
  notificationsPage: (params: { unread?: boolean; type?: Notification["type"]; cursor?: string | null; limit?: number } = {}) => page<Notification, NotificationPageExtra>("/notifications", { ...params, unread: params.unread ? "true" : undefined }),
  markNotificationRead: (id: string) => mutate<Notification>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => mutate<unknown>("/notifications/read-all", { method: "POST" }),
  deleteNotification: (id: string) => mutate<unknown>(`/notifications/${id}`, { method: "DELETE" }),

  invoices: () => call<Invoice[]>("/invoices"),
  invoicesPage: (params: { status?: Invoice["status"]; q?: string; cursor?: string | null; limit?: number } = {}) => page<Invoice, InvoicePageExtra>("/invoices", params),

  // The customer's own reviews (lives under /api/reviews, not /api/users).
  myReviews: async (params: { cursor?: string | null; limit?: number } = {}) => (await apiRequest<MyReview[]>(`/reviews/mine/all${query(params)}`, { loginMessage: LOGIN_MESSAGE })) as unknown as Page<MyReview>,

  paymentMethods: () => call<PaymentMethod[]>("/payment-methods"),
  addPaymentMethod: (body: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }) => mutate<PaymentMethod>("/payment-methods", { method: "POST", body }),
  setDefaultPaymentMethod: (id: string) => mutate<PaymentMethod>(`/payment-methods/${id}`, { method: "PATCH", body: { isDefault: true } }),
  removePaymentMethod: (id: string) => mutate<unknown>(`/payment-methods/${id}`, { method: "DELETE" }),
};

export const formatMoney = (value: number) => `$${value.toFixed(2)}`;
// Booking dates are stored as midnight UTC, so format in UTC to avoid showing the previous day.
export const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "");
