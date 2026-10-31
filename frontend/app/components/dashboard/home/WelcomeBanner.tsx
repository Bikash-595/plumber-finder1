import Link from "next/link";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import type { DashboardSummary } from "@/components/utils/userApi";
import { plural } from "../ui/format";

/** Greeting with what needs attention right now, and the two most common next steps. */
export default function WelcomeBanner({ name, counts }: { name: string; counts?: DashboardSummary["counts"] }) {
  const attention = counts && [
    counts.pendingBookings > 0 && `${plural(counts.pendingBookings, "booking")} waiting for a reply`,
    counts.scheduledBookings > 0 && `${plural(counts.scheduledBookings, "confirmed visit")}`,
    counts.unreadNotifications > 0 && `${plural(counts.unreadNotifications, "unread notification")}`,
    counts.pendingInvoices > 0 && `${plural(counts.pendingInvoices, "invoice")} to pay`,
  ].filter(Boolean).join(" · ");
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0b1f3b] p-6 text-white shadow-lg sm:p-8">
      <span aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FFD60A]/15" />
      <span aria-hidden className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#FFD60A]">Customer dashboard</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome back, {name}!</h1>
          <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">{counts ? attention || "You're all caught up. Need a plumber? We'll help you find a verified pro." : "Loading your latest activity…"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/find" className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b] hover:brightness-95"><FaSearch className="h-3 w-3" /> Find a plumber</Link>
          <Link href="/dashboard/bookings" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">My bookings <FaArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
    </section>
  );
}
