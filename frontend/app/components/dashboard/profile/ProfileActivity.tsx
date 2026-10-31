"use client";

import Link from "next/link";
import { userApi } from "@/components/utils/userApi";
import { useUserData } from "../useUserData";

/** A few numbers about the account, from the dashboard summary that is already cached. */
export default function ProfileActivity() {
  const counts = useUserData(userApi.dashboard).data?.counts;
  const stats = [
    { label: "Bookings", value: counts?.totalBookings, href: "/dashboard/bookings" },
    { label: "Completed", value: counts?.completedBookings, href: "/dashboard/bookings" },
    { label: "Saved", value: counts?.saved, href: "/dashboard/saved" },
  ];
  return (
    <section className="grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href} className="px-2 py-4 text-center transition hover:bg-gray-50">
          <span className="block text-xl font-bold tabular-nums text-gray-900">{stat.value ?? "–"}</span>
          <span className="text-xs text-gray-500">{stat.label}</span>
        </Link>
      ))}
    </section>
  );
}
