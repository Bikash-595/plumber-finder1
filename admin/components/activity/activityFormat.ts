import { type ActivityEvent, type BookingStatus } from "@/lib/adminApi";

export { FRONTEND_URL } from "@/lib/siteUrls";

export const eventLabels: Record<ActivityEvent, string> = {
  profile_view: "Visited the profile", project_view: "Viewed a project", blog_read: "Read a blog post", compare_add: "Added to compare", save: "Saved the plumber",
  call_click: "Tapped Call", email_click: "Tapped Email", website_click: "Opened the website", share: "Shared the profile", booking: "Booked",
};

export const eventTone: Record<ActivityEvent, string> = {
  profile_view: "bg-sky-50 text-sky-700", project_view: "bg-indigo-50 text-indigo-700", blog_read: "bg-orange-50 text-orange-700", compare_add: "bg-violet-50 text-violet-700", save: "bg-pink-50 text-pink-700",
  call_click: "bg-emerald-50 text-emerald-700", email_click: "bg-emerald-50 text-emerald-700", website_click: "bg-emerald-50 text-emerald-700", share: "bg-gray-100 text-gray-700", booking: "bg-[#FFD60A]/30 text-[#0b1f3b]",
};

export const bookingLabels: Record<BookingStatus, string> = { pending: "Waiting", scheduled: "Accepted", in_progress: "In progress", awaiting_confirmation: "Awaiting confirmation", disputed: "Disputed", completed: "Completed", declined: "Declined", cancelled: "Cancelled" };

export const field = "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FFD60A]";

export const when = (value: string) => new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export const n = (value: number) => value.toLocaleString();
