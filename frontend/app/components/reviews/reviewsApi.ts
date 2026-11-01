"use client";

import { API_BASE_URL } from "@/components/utils/apiClient";
import { readStoredUser } from "@/components/utils/auth";

// The review system as the browser sees it. Three sources, never mixed into one score:
//   directory          — any signed-in customer (no booking needed)
//   verified_booking   — tied to the customer's completed PlumberFinder booking (the server decides)
//   google             — companies only, read from Google

export type ReviewSourceKey = "directory" | "verified_booking";
export type Reply = { body: string; createdAt: string; updatedAt?: string };
export type PFReview = {
  _id: string; source: ReviewSourceKey; verified: boolean; rating: number; title: string; body: string; serviceCategory?: string; photos: string[];
  createdAt: string; edited: boolean; editedAt?: string; author: { name: string }; reply: Reply | null; isMine: boolean;
  status?: "published" | "pending" | "hidden" | "rejected"; moderation?: { reason?: string } | null; bookingReference?: string | null;
};
export type SourceStats = { average: number; count: number; distribution: Record<1 | 2 | 3 | 4 | 5, number> };
export type ReviewStats = { platform: SourceStats; directory: SourceStats; verified: SourceStats };
/** Kept for screens that only show the platform rating. */
export type ReviewSummary = SourceStats;
export type EligibleBooking = { _id: string; reference: string; service: string; completedAt?: string };
export type Viewer = { signedIn: boolean; accountType: string | null; canReview: boolean; directoryReview: PFReview | null; verifiedReviews: PFReview[]; eligibleBookings: EligibleBooking[] };
export type ReviewList = { data: PFReview[]; page: number; limit: number; total: number; stats: ReviewStats; viewer: Viewer; googleEnabled: boolean; categories: string[] };

export type GoogleReview = { rating: number; text: string; publishTime?: string; relativeTime?: string; author: { name: string; uri?: string; photoUri?: string }; googleMapsUri?: string; ownerReply?: { text: string; updateTime?: string } | null };
export type GoogleSummary = {
  connected: boolean; available: boolean; reason?: "not_connected" | "no_place_id" | "api_not_configured" | "google_error"; error?: string;
  connectionStatus?: "link_only" | "connected"; businessName?: string | null; address?: string | null; origin?: "places" | "business_profile";
  profileUrl?: string | null; placeId?: string | null; readUrl?: string | null; writeUrl?: string | null; lastSyncedAt?: string | null;
  displayName?: string; rating?: number | null; count?: number; reviews?: GoogleReview[]; fetchedAt?: string;
  apiConfigured?: boolean; oauth?: { configured: boolean; connected: boolean; status: string; error: string | null; locationFound: boolean };
};
export type ReviewInput = { rating: number; title?: string; body: string; serviceCategory?: string; photos?: string[] };

/** Calls the API with the signed-in account's token when there is one (reading works signed out). */
export async function reviewsCall<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<{ data: T; message?: string } & Record<string, unknown>> {
  const token = readStoredUser()?.accessToken;
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method: init.method ?? "GET", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: init.body === undefined ? undefined : JSON.stringify(init.body) });
  } catch {
    throw new Error("Can't reach the server right now. Please try again.");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const [field, problem] = Object.entries(payload.errors ?? {})[0] ?? [];
    throw new Error(payload.message && !/^Please check/.test(payload.message) ? payload.message : field ? `${field} ${problem}` : payload.message || `Request failed (${response.status}).`);
  }
  return payload;
}

export const reviewsApi = {
  list: (type: string, id: string, query: URLSearchParams) => reviewsCall<PFReview[]>(`/reviews/${type}/${id}?${query}`) as unknown as Promise<ReviewList>,
  google: (type: string, id: string) => reviewsCall<GoogleSummary>(`/reviews/${type}/${id}/google`),
  report: (reviewId: string, reason: string) => reviewsCall(`/reviews/item/${reviewId}/report`, { method: "POST", body: { reason } }),
  // The customer's own reviews (/api/users/reviews).
  create: (body: ReviewInput & { providerType: string; providerId: string; providerName?: string; bookingId?: string }) => reviewsCall<PFReview>("/users/reviews", { method: "POST", body }),
  update: (reviewId: string, body: Partial<ReviewInput>) => reviewsCall<PFReview>(`/users/reviews/${reviewId}`, { method: "PATCH", body }),
  remove: (reviewId: string) => reviewsCall(`/users/reviews/${reviewId}`, { method: "DELETE" }),
};

export const REPORT_REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "fake", label: "Fake or not a real customer" },
  { value: "offensive", label: "Offensive or abusive" },
  { value: "not_relevant", label: "Not about this plumber" },
  { value: "personal_info", label: "Shares personal information" },
  { value: "other", label: "Something else" },
];

export const sourceLabels: Record<ReviewSourceKey | "google", string> = { directory: "Directory Review", verified_booking: "Verified Booking", google: "Google Review" };

export const formatReviewDate = (value?: string) => (value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");
