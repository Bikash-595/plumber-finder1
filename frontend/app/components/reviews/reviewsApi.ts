"use client";

import { API_BASE_URL } from "@/components/utils/apiClient";
import { readStoredUser } from "@/components/utils/auth";

// PlumberFinder reviews and Google review summaries for a plumber (company or freelancer).

export type ReviewSource = "plumberfinder" | "google";
export type Reply = { body: string; createdAt: string; updatedAt?: string };
export type PFReview = {
  _id: string; source: "plumberfinder"; rating: number; title: string; body: string; serviceCategory?: string; photos: string[];
  verified: boolean; createdAt: string; edited: boolean; editedAt?: string; author: { name: string }; reply: Reply | null; isMine: boolean;
  status?: "published" | "pending" | "hidden"; bookingReference?: string;
};
export type ReviewSummary = { average: number; count: number; distribution: Record<1 | 2 | 3 | 4 | 5, number> };
export type ReviewList = { data: PFReview[]; page: number; limit: number; total: number; summary: ReviewSummary; mine: PFReview | null; canReview: boolean; categories: string[] };
export type GoogleReview = { rating: number; text: string; publishTime?: string; relativeTime?: string; author: { name: string; uri?: string; photoUri?: string }; googleMapsUri?: string };
export type GoogleSummary = {
  connected: boolean; available: boolean; reason?: "not_connected" | "no_place_id" | "api_not_configured" | "google_error"; error?: string;
  profileUrl?: string | null; placeId?: string | null; readUrl?: string | null; writeUrl?: string | null;
  displayName?: string; rating?: number | null; count?: number; reviews?: GoogleReview[]; fetchedAt?: string; apiConfigured?: boolean;
};

/** Calls the reviews API; the signed-in account's token is sent when there is one (reading works signed out). */
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

export const REPORT_REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "fake", label: "Fake or not a real customer" },
  { value: "offensive", label: "Offensive or abusive" },
  { value: "not_relevant", label: "Not about this plumber" },
  { value: "personal_info", label: "Shares personal information" },
  { value: "other", label: "Something else" },
];

export const formatReviewDate = (value?: string) => (value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");
