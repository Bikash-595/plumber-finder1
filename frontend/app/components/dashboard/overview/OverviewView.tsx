"use client";

import { FaCalendarCheck, FaChartBar, FaCheckCircle, FaPiggyBank, FaWallet } from "react-icons/fa";
import { formatMoney, userApi } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import Panel from "../ui/Panel";
import { Skeleton } from "../ui/Skeleton";
import StatCard from "../ui/StatCard";
import MonthlyBarChart from "./MonthlyBarChart";
import StatusBreakdown from "./StatusBreakdown";
import TopProviders from "./TopProviders";

const monthName = (key: string) => new Date(`${key}-01T00:00:00Z`).toLocaleDateString(undefined, { month: "short", timeZone: "UTC" });

/** /dashboard/overview — the customer's history at a glance: totals, monthly trends, statuses, favourite plumbers. */
export default function OverviewView() {
  const { signedIn, data, error, loading } = useUserData(userApi.insights);
  if (!signedIn) return <SignInPrompt what="your account overview" />;

  return (
    <div className="space-y-6">
      <PageHeader icon={FaChartBar} title="Overview" description={`Your plumbing activity over the last ${data?.months ?? 6} months.`} />
      <Notice>{error}</Notice>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total bookings" icon={FaCalendarCheck} tone="info" loading={loading} value={data?.totalBookings ?? 0} hint="All time" href="/dashboard/bookings" />
        <StatCard label="Completion rate" icon={FaCheckCircle} tone="success" loading={loading} value={`${data?.completionRate ?? 0}%`} hint={`${data?.bookingsByStatus.completed ?? 0} jobs completed`} />
        <StatCard label="Paid in period" icon={FaWallet} tone="violet" loading={loading} value={formatMoney(data?.spentInPeriod ?? 0)} hint={`Last ${data?.months ?? 6} months`} href="/dashboard/invoices" />
        <StatCard label="Saved with deals" icon={FaPiggyBank} tone="brand" loading={loading} value={formatMoney(data?.savings ?? 0)} hint="Coupons and promo codes" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Bookings per month" description="Requests you sent, by month">
          {data ? <MonthlyBarChart title="Bookings per month" empty="No bookings in this period." points={data.timeline.map((month) => ({ label: monthName(month.month), value: month.bookings, display: `${month.bookings} booking${month.bookings === 1 ? "" : "s"}` }))} /> : <Skeleton className="h-52" />}
        </Panel>
        <Panel title="Money paid per month" description="Paid invoices, by month">
          {data ? <MonthlyBarChart title="Money paid per month" barClass="bg-[#b39200]" empty="No paid invoices in this period." points={data.timeline.map((month) => ({ label: monthName(month.month), value: month.spent, display: formatMoney(month.spent) }))} /> : <Skeleton className="h-52" />}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Bookings by status" description={data ? `${data.totalBookings} in total` : undefined}>
          {data ? <StatusBreakdown counts={data.bookingsByStatus} total={data.totalBookings} /> : <Skeleton className="h-32" />}
        </Panel>
        <Panel title="Your most-booked plumbers" description={data ? `${data.reviewsWritten} review${data.reviewsWritten === 1 ? "" : "s"} written` : undefined}>
          {data ? <TopProviders providers={data.topProviders} /> : <Skeleton className="h-32" />}
        </Panel>
      </div>
    </div>
  );
}
