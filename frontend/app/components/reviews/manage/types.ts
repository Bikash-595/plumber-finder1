import type { PFReview, ReviewStats } from "../reviewsApi";

export type ProviderBase = "/companies" | "/freelancers";
export type InboxReview = PFReview & { status: "published" | "pending" | "hidden" | "rejected"; moderation?: { reason?: string; by?: string }; reportCount: number; reportReasons: string[] };
export type InboxSummary = ReviewStats & { byStatus: Record<string, number>; unanswered: number; newThisWeek: number; reported: number };
export type Inbox = { data: InboxReview[]; total: number; page: number; limit: number; summary: InboxSummary; listingId: string | null };
export const inboxField = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
