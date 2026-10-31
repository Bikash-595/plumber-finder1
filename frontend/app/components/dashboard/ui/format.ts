// Small display helpers shared by the customer dashboard pages.
import { formatDate } from "@/components/utils/userApi";

export function timeAgo(value: string, now = Date.now()) {
  const minutes = Math.round((now - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(value);
}

/** "Today", "Yesterday", or a date — for grouping lists by day. */
export function dayLabel(value: string, now = new Date()) {
  const day = new Date(value);
  const startOf = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(day)) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return day.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
export const firstName = (name?: string) => name?.trim().split(/\s+/)[0] || "there";
