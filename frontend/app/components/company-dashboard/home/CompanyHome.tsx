"use client";

import Link from "next/link";
import { FaCheckCircle, FaDollarSign, FaEye, FaHandPointer, FaInbox, FaReply, FaUsers } from "react-icons/fa";
import Notice from "@/components/dashboard/ui/Notice";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import { companyApi, formatMinutes, formatMoney, useCompanyData } from "../companyApi";
import KpiCard from "../ui/KpiCard";
import ActionCenter from "./ActionCenter";
import ActivityFeed from "./ActivityFeed";
import BookingList from "./BookingList";
import NextSteps from "./NextSteps";
import ReviewsSnapshot from "./ReviewsSnapshot";
import TrendPanel from "./TrendPanel";
import WelcomeHero from "./WelcomeHero";
import { dashBase } from "@/components/utils/providerSide";

/** /company-dashboard — one request fills the whole page. */
export default function CompanyHome() {
  const { data, error, loading } = useCompanyData("company-dashboard", companyApi.dashboard);
  if (loading) return <div className="space-y-6"><Skeleton className="h-56 rounded-3xl" /><div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div><Skeleton className="h-72 rounded-2xl" /></div>;
  if (!data) return <Notice>{error || "Could not load your dashboard."}</Notice>;
  const { kpis } = data;
  const days = data.period.days;

  return (
    <div className="space-y-6">
      <WelcomeHero data={data} />
      <Notice>{error}</Notice>
      <ActionCenter actions={data.actions} />

      <section aria-labelledby="perf-heading" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 id="perf-heading" className="text-lg font-bold text-gray-900">Last {days} days</h2>
          <Link href={`${dashBase()}/analytics`} className="text-sm font-semibold text-[#8a7300] hover:underline">Full analytics →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Profile views" icon={FaEye} tone="info" value={kpis.views.value.toLocaleString()} change={kpis.views.change} />
          <KpiCard label="Unique visitors" icon={FaUsers} tone="violet" value={kpis.visitors.value.toLocaleString()} change={kpis.visitors.change} />
          <KpiCard label="Booking requests" icon={FaInbox} tone="brand" value={kpis.requests.value.toLocaleString()} change={kpis.requests.change} />
          <KpiCard label="Revenue (completed)" icon={FaDollarSign} tone="success" value={formatMoney(kpis.revenue.value)} change={kpis.revenue.change} />
          <KpiCard label="Contact clicks" icon={FaHandPointer} tone="neutral" value={kpis.contacts.value.toLocaleString()} change={kpis.contacts.change} />
          <KpiCard label="Completed jobs" icon={FaCheckCircle} tone="success" value={kpis.completed.value.toLocaleString()} change={kpis.completed.change} />
          <KpiCard label="Acceptance rate" icon={FaCheckCircle} tone="info" value={kpis.acceptanceRate === null ? "—" : `${kpis.acceptanceRate}%`} hint="Requests you accepted" />
          <KpiCard label="Average reply time" icon={FaReply} tone="warning" value={formatMinutes(kpis.avgReplyMinutes)} hint="Faster replies win more jobs" />
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          <BookingList title="New booking requests" kind="requests" rows={data.pending} empty="No requests waiting. New ones appear here and in your notifications." />
          <BookingList title="Upcoming jobs" kind="upcoming" rows={data.upcoming} empty="No upcoming jobs on the calendar." />
          <TrendPanel trend={data.trend} />
        </div>
        <div className="min-w-0 space-y-6">
          <ReviewsSnapshot reviews={data.reviews} />
          <NextSteps items={data.strength.next} />
          <ActivityFeed items={data.notifications} />
        </div>
      </div>
    </div>
  );
}
