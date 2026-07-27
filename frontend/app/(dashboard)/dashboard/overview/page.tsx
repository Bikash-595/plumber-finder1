/* eslint-disable react/no-unescaped-entities */
"use client";

import { FaArrowUp, FaArrowDown, FaUsers, FaCalendarAlt } from "react-icons/fa";

export default function OverviewPage() {
  const stats = [
    {
      title: "Total Bookings",
      value: "12",
      change: "+2.5%",
      positive: true,
      icon: FaCalendarAlt,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Jobs",
      value: "3",
      change: "+1 this week",
      positive: true,
      icon: FaUsers,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Spent",
      value: "$1,250",
      change: "-5.2%",
      positive: false,
      icon: FaArrowDown,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Saved Plumbers",
      value: "8",
      change: "+1 new",
      positive: true,
      icon: FaUsers,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's your account summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg ${stat.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {stat.positive ? (
                  <FaArrowUp className="h-3 w-3 text-green-600" />
                ) : (
                  <FaArrowDown className="h-3 w-3 text-gray-600" />
                )}
                <span className={stat.positive ? "text-green-600 text-sm font-medium" : "text-gray-600 text-sm font-medium"}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <div className="mt-6 space-y-4">
            {[
              { action: "Booked appointment with Elite Plumbing", date: "Today" },
              { action: "Saved Premier New York Plumbing", date: "Yesterday" },
              { action: "Received quote from Modern Services", date: "2 days ago" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#FFD60A]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="mt-6 space-y-3">
            {[
              { label: "Find Plumbers", href: "/find" },
              { label: "View Saved Deals", href: "/dashboard/saved" },
              { label: "My Bookings", href: "/dashboard/bookings" },
              { label: "Account Settings", href: "/dashboard/settings" },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#FFD60A] hover:bg-[#FFD60A]/5 transition"
              >
                {link.label}
                <span className="text-gray-400">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
