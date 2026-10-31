"use client";

import { FaBell, FaCalendarCheck, FaCheckCircle, FaHeart } from "react-icons/fa";
import { userApi } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import Notice from "../ui/Notice";
import StatCard from "../ui/StatCard";
import { firstName } from "../ui/format";
import AccountSnapshot from "./AccountSnapshot";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import UpcomingBookings from "./UpcomingBookings";
import WelcomeBanner from "./WelcomeBanner";

/** /dashboard — one request (shared with the navbar and sidebar badges) fills the whole page. */
export default function DashboardHome() {
  const summary = useUserData(userApi.dashboard);
  const profile = useUserData(userApi.profile);
  if (!summary.signedIn) return <SignInPrompt what="your dashboard" />;

  const counts = summary.data?.counts;
  return (
    <div className="space-y-6">
      <WelcomeBanner name={firstName(profile.data?.name)} counts={counts} />
      <Notice>{summary.error}</Notice>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Active bookings" icon={FaCalendarCheck} tone="info" loading={summary.loading} value={counts?.activeBookings ?? 0} hint={`${counts?.pendingBookings ?? 0} waiting · ${counts?.scheduledBookings ?? 0} confirmed`} href="/dashboard/bookings" />
        <StatCard label="Completed jobs" icon={FaCheckCircle} tone="success" loading={summary.loading} value={counts?.completedBookings ?? 0} hint={`${counts?.totalBookings ?? 0} bookings in total`} href="/dashboard/overview" />
        <StatCard label="Saved plumbers" icon={FaHeart} tone="danger" loading={summary.loading} value={counts?.saved ?? 0} hint="Your shortlist" href="/dashboard/saved" />
        <StatCard label="Unread" icon={FaBell} tone="brand" loading={summary.loading} value={counts?.unreadNotifications ?? 0} hint="Notifications" href="/dashboard/notifications" />
      </div>

      <QuickActions />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <UpcomingBookings bookings={summary.data?.upcomingBookings} />
          <RecentActivity items={summary.data?.recentNotifications} />
        </div>
        <AccountSnapshot summary={summary.data} />
      </div>
    </div>
  );
}
