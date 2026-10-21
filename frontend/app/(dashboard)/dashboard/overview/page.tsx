"use client";

import Link from "next/link";
import { FaCalendarAlt, FaCheckCircle, FaFileInvoiceDollar, FaHeart } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatDate, formatMoney, userApi } from "@/components/utils/userApi";

export default function OverviewPage() {
  const { signedIn, data: summary, error, loading } = useUserData(userApi.dashboard);
  if (!signedIn) return <SignInPrompt what="your account overview" />;

  const counts = summary?.counts;
  const stats = [
    { title: "Active Bookings", value: counts?.activeBookings, note: "Pending or scheduled", icon: FaCalendarAlt, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Completed Jobs", value: counts?.completedBookings, note: "All time", icon: FaCheckCircle, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { title: "Total Paid", value: summary ? formatMoney(summary.totalSpent) : undefined, note: `${counts?.pendingInvoices ?? 0} invoice(s) pending`, icon: FaFileInvoiceDollar, bgColor: "bg-purple-50", iconColor: "text-purple-600" },
    { title: "Saved Plumbers", value: counts?.saved, note: `${counts?.compare ?? 0} in compare`, icon: FaHeart, bgColor: "bg-amber-50", iconColor: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="mt-2 text-gray-600">Your account summary.</p>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value ?? (loading ? "…" : "–")}</p>
                </div>
                <div className={`rounded-lg ${stat.bgColor} p-3`}><Icon className={`h-6 w-6 ${stat.iconColor}`} /></div>
              </div>
              <p className="mt-4 text-sm text-gray-500">{stat.note}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <div className="mt-6 space-y-4">
            {!summary?.recentNotifications.length && <p className="text-sm text-gray-500">{loading ? "Loading…" : "No activity yet."}</p>}
            {summary?.recentNotifications.map((item) => (
              <div key={item._id} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#FFD60A]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="mt-6 space-y-3">
            {[
              { label: "Find Plumbers", href: "/find" },
              { label: `Your Cart (${counts?.cart ?? 0})`, href: "/checkout" },
              { label: "Compare Plumbers", href: "/dashboard/compare" },
              { label: "My Bookings", href: "/dashboard/bookings" },
              { label: "Account Settings", href: "/dashboard/settings" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/5">
                {link.label}
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
