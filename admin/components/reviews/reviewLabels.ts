import { type ReviewStatus } from "@/lib/adminApi";

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const tabs = [{ value: "pending", label: "Held for review" }, { value: "reported", label: "Reported" }, { value: "published", label: "Live" }, { value: "hidden", label: "Hidden" }, { value: "rejected", label: "Rejected" }, { value: "all", label: "All" }];

export const statusLabels: Record<ReviewStatus, string> = { published: "Live", pending: "Held", hidden: "Hidden", rejected: "Rejected" };

export const badge: Record<ReviewStatus, string> = { published: "completed", pending: "pending", hidden: "cancelled", rejected: "declined" };

export const reasonLabels: Record<string, string> = { spam: "Spam", fake: "Fake", offensive: "Offensive", not_relevant: "Not relevant", personal_info: "Personal info", other: "Other" };

export const actionLabels: Record<string, string> = { created: "Written", edited: "Edited by the customer", deleted: "Deleted by the customer", held: "Held for moderation", published: "Published", hidden: "Hidden", rejected: "Rejected", reply: "Plumber replied", reply_deleted: "Plumber deleted their reply", reported: "Reported" };

export const field = "rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A]";

export const when = (value?: string) => (value ? new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—");
