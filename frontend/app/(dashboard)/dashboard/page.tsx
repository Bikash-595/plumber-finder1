/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readStoredUser, type AppUser } from "@/components/utils/auth";
import {
  FaHandshake,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaBuilding,
  FaHeart,
  FaBell,
} from "react-icons/fa";

export default function DashboardPage() {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const firstName = user?.name?.split(" ")[0] || "User";

  const stats = [
    {
      label: "Saved Deals",
      value: "8",
      icon: FaHeart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      change: "+2 new",
    },
    {
      label: "Quotes Requested",
      value: "5",
      icon: FaHandshake,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      change: "+1 pending",
    },
    {
      label: "Completed Jobs",
      value: "12",
      icon: FaCheckCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      change: "100% satisfaction",
    },
    {
      label: "Response Time",
      value: "< 1 hour",
      icon: FaClock,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      change: "avg. response",
    },
  ];

  const quickLinks = [
    { label: "Find Plumbers", href: "/find", icon: FaBuilding, color: "bg-blue-500" },
    { label: "Saved Deals", href: "/dashboard/saved", icon: FaHeart, color: "bg-red-500" },
    { label: "My Bookings", href: "/dashboard/bookings", icon: FaClock, color: "bg-purple-500" },
    { label: "Notifications", href: "/dashboard/notifications", icon: FaBell, color: "bg-amber-500" },
  ];

  const recentActivity = [
    { action: "Booked appointment", plumber: "Elite Los Angeles Plumbing", date: "Today", time: "10:00 AM" },
    { action: "Saved plumber", plumber: "Premier New York Services", date: "Yesterday", time: "2:30 PM" },
    { action: "Received quote", plumber: "Modern Chicago Plumbing", date: "2 days ago", time: "9:15 AM" },
    { action: "Service completed", plumber: "Quick Fix Plumbing", date: "1 week ago", time: "5:00 PM" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFD60A] to-amber-400 p-8 text-gray-900 shadow-lg">
        <h1 className="text-4xl font-bold">Welcome back, {firstName}! 👋</h1>
        <p className="mt-2 text-gray-700">overview.</p>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Your Activity</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-2 text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`rounded-lg ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                href={link.href}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className={`rounded-lg ${link.color} p-3 w-fit`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="mt-4 font-semibold text-gray-900">{link.label}</p>
                <p className="text-xs text-gray-600 group-hover:text-[#FFD60A] transition">
                  Explore <FaArrowRight className="inline h-3 w-3" />
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <Link href="/dashboard/notifications" className="text-sm text-[#FFD60A] hover:text-[#FFD60A]/80">
              View all →
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#FFD60A]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action} with <span className="font-bold">{activity.plumber}</span>
                  </p>
                  <div className="mt-1 flex gap-4 text-xs text-gray-500">
                    <span>{activity.date}</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Performance</h2>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Booking Rate</p>
                <p className="text-sm font-bold text-gray-900">85%</p>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-4/5 rounded-full bg-[#FFD60A]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                <p className="text-sm font-bold text-gray-900">4.8/5</p>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-11/12 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-sm font-bold text-gray-900">92%</p>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-11/12 rounded-full bg-blue-500" />
              </div>
            </div>

            <button className="mt-6 w-full rounded-lg bg-[#FFD60A] px-4 py-3 font-semibold text-gray-900 hover:bg-[#FFD60A]/90 transition">
              View Full Report
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Ready to find your next plumber?</h2>
          <p className="mt-2 text-gray-700">Browse our verified plumbers and get instant quotes for your plumbing needs.</p>
          <Link
            href="/find"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FFD60A] px-6 py-3 font-semibold text-gray-900 hover:bg-[#FFD60A]/90 transition"
          >
            Explore Plumbers
            <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
