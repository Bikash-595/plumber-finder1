"use client";

import Link from "next/link";
import { FaArrowRight, FaBalanceScale, FaBell, FaBuilding, FaCalendarAlt, FaCheckCircle, FaClock, FaHeart, FaShoppingCart } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatDate, formatMoney, userApi } from "@/components/utils/userApi";

export default function DashboardPage() {
  const summary = useUserData(userApi.dashboard);
  const profile = useUserData(userApi.profile);

  if (!summary.signedIn) return <SignInPrompt what="your dashboard" />;

  const counts = summary.data?.counts;
  const firstName = profile.data?.name?.split(" ")[0] || "there";
  const value = (n?: number) => (n === undefined ? "–" : String(n));

  const stats = [
    { label: "Saved Plumbers", value: value(counts?.saved), icon: FaHeart, color: "text-red-500", bgColor: "bg-red-50", href: "/dashboard/saved", note: "View saved" },
    { label: "Active Bookings", value: value(counts?.activeBookings), icon: FaClock, color: "text-purple-500", bgColor: "bg-purple-50", href: "/dashboard/bookings", note: "Pending or scheduled" },
    { label: "Completed Jobs", value: value(counts?.completedBookings), icon: FaCheckCircle, color: "text-blue-500", bgColor: "bg-blue-50", href: "/dashboard/bookings", note: "All time" },
    { label: "Cart Items", value: value(counts?.cart), icon: FaShoppingCart, color: "text-emerald-500", bgColor: "bg-emerald-50", href: "/checkout", note: "Go to cart" },
  ];

  const quickLinks = [
    { label: "Find Plumbers", href: "/find", icon: FaBuilding, color: "bg-blue-500" },
    { label: "Compare Plumbers", href: "/dashboard/compare", icon: FaBalanceScale, color: "bg-[#0b1f3b]" },
    { label: "My Bookings", href: "/dashboard/bookings", icon: FaClock, color: "bg-purple-500" },
    { label: "Notifications", href: "/dashboard/notifications", icon: FaBell, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFD60A] to-amber-400 p-6 text-gray-900 shadow-lg sm:p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Welcome back, {firstName}! 👋</h1>
        <p className="mt-2 text-gray-800">
          {counts ? `You have ${counts.activeBookings} active booking${counts.activeBookings === 1 ? "" : "s"} and ${counts.unreadNotifications} unread notification${counts.unreadNotifications === 1 ? "" : "s"}.` : "Here’s what’s happening with your plumbing jobs."}
        </p>
      </div>

      {summary.error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{summary.error}</p>}

      {/* Stats Grid */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Your Activity</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-2 text-xs text-gray-500">{stat.note}</p>
                  </div>
                  <div className={`rounded-lg ${stat.bgColor} p-3`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.label} href={link.href} className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg">
                <div className={`w-fit rounded-lg ${link.color} p-3`}><Icon className="h-6 w-6 text-white" /></div>
                <p className="mt-4 font-semibold text-gray-900">{link.label}</p>
                <p className="text-xs text-gray-600 transition group-hover:text-[#8a7300]">Open <FaArrowRight className="inline h-3 w-3" /></p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <Link href="/dashboard/notifications" className="text-sm font-semibold text-[#8a7300] hover:underline">View all →</Link>
          </div>
          <div className="mt-6 space-y-4">
            {!summary.data?.recentNotifications.length && <p className="text-sm text-gray-500">{summary.loading ? "Loading…" : "No activity yet. Save a plumber or send a booking request to get started."}</p>}
            {summary.data?.recentNotifications.map((notification) => (
              <div key={notification._id} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0">
                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.read ? "bg-gray-300" : "bg-[#FFD60A]"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  {notification.message && <p className="mt-0.5 text-sm text-gray-600">{notification.message}</p>}
                  <p className="mt-1 text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming + account */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Bookings</h2>
            <div className="mt-4 space-y-3">
              {!summary.data?.upcomingBookings.length && <p className="text-sm text-gray-500">{summary.loading ? "Loading…" : "No upcoming bookings."}</p>}
              {summary.data?.upcomingBookings.map((booking) => (
                <Link key={booking._id} href="/dashboard/bookings" className="block rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{booking.service}</p>
                  <p className="text-xs text-gray-600">{booking.providerName}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><FaCalendarAlt className="h-3 w-3" />{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Date to be confirmed"} · <span className="capitalize">{booking.status}</span></p>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Account</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-600">Pending invoices</dt><dd className="font-semibold text-gray-900">{value(counts?.pendingInvoices)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Comparing</dt><dd className="font-semibold text-gray-900">{value(counts?.compare)} / 3</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Total paid</dt><dd className="font-semibold text-gray-900">{summary.data ? formatMoney(summary.data.totalSpent) : "–"}</dd></div>
            </dl>
            <Link href="/dashboard/invoices" className="mt-5 block w-full rounded-lg bg-[#FFD60A] px-4 py-3 text-center font-semibold text-gray-900 transition hover:bg-[#FFD60A]/90">View Invoices</Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6 sm:p-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Ready to find your next plumber?</h2>
          <p className="mt-2 text-gray-700">Browse verified plumbers, compare them side by side, and book in minutes.</p>
          <Link href="/find" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FFD60A] px-6 py-3 font-semibold text-gray-900 transition hover:bg-[#FFD60A]/90">
            Explore Plumbers <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
