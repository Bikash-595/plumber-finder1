"use client";

import { useState } from "react";
import { FaChartLine, FaCheckCircle, FaDollarSign, FaDownload, FaEye, FaHandPointer, FaInbox, FaPercent, FaReceipt, FaReply, FaUsers } from "react-icons/fa";
import MonthlyBarChart from "@/components/dashboard/overview/MonthlyBarChart";
import FilterTabs from "@/components/dashboard/ui/FilterTabs";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Panel from "@/components/dashboard/ui/Panel";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import { companyApi, formatMinutes, formatMoney, useCompanyData, type Rate } from "../companyApi";
import KpiCard from "../ui/KpiCard";
import { exportTimelineCsv } from "./exportCsv";
import FunnelChart from "./FunnelChart";
import LabeledBars from "./LabeledBars";

const ranges = [{ value: "7", label: "7 days" }, { value: "30", label: "30 days" }, { value: "90", label: "90 days" }, { value: "365", label: "12 months" }] as const;
const actionLabels: Record<string, string> = { profile_view: "Profile views", call_click: "Phone number taps", email_click: "Email clicks", website_click: "Website clicks", share: "Profile shares", save: "Saved by customers", compare_add: "Added to compare", project_view: "Project views", blog_read: "Blog reads" };
const statusLabels: Record<string, string> = { pending: "Waiting for reply", scheduled: "Confirmed", in_progress: "In progress", awaiting_confirmation: "Waiting for customer", completed: "Completed", disputed: "Disputed", cancelled: "Cancelled", declined: "Declined" };
/** Percentage-point change for rates (e.g. 12% → 15% is +3). */
const rateChange = (rate: Rate) => (rate.value === null || rate.previous === null ? null : Math.round(rate.value - rate.previous));

/** /company-dashboard/analytics — traffic, bookings, revenue and reviews for a period, against the period before. */
export default function CompanyAnalytics() {
  const [days, setDays] = useState<(typeof ranges)[number]["value"]>("30");
  const { data, error, loading } = useCompanyData(`company-analytics-${days}`, () => companyApi.analytics(Number(days)));
  const fmtKey = (key: string) => (data?.granularity === "month" ? new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }) : new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }));
  // Daily bars get crowded past two weeks: only every few days gets an axis label.
  const tick = (key: string, index: number, total: number) => (total > 14 && index % Math.ceil(total / 10) !== 0 ? "" : fmtKey(key));

  return (
    <div className="space-y-6">
      <PageHeader icon={FaChartLine} title="Analytics" description="How customers find you and book you. Every number comes from real visits, bookings and reviews."
        actions={data && <button type="button" onClick={() => exportTimelineCsv(data)} className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><FaDownload className="h-3 w-3" /> Export CSV</button>} />
      <FilterTabs label="Period" value={days} onChange={setDays} options={ranges.map((range) => ({ value: range.value, label: range.label }))} />
      <Notice>{error}</Notice>
      {data && !data.hasListing && <Notice tone="info">Publish your company listing to start collecting profile views.</Notice>}

      {loading || !data ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{Array.from({ length: 10 }, (_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div> : (
        <>
          <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <KpiCard label="Profile views" icon={FaEye} tone="info" value={data.kpis.views.value.toLocaleString()} change={data.kpis.views.change} />
            <KpiCard label="Unique visitors" icon={FaUsers} tone="violet" value={data.kpis.visitors.value.toLocaleString()} change={data.kpis.visitors.change} />
            <KpiCard label="Contact clicks" icon={FaHandPointer} tone="neutral" value={data.kpis.contacts.value.toLocaleString()} change={data.kpis.contacts.change} />
            <KpiCard label="Booking requests" icon={FaInbox} tone="brand" value={data.kpis.requests.value.toLocaleString()} change={data.kpis.requests.change} />
            <KpiCard label="Completed jobs" icon={FaCheckCircle} tone="success" value={data.kpis.completed.value.toLocaleString()} change={data.kpis.completed.change} />
            <KpiCard label="Revenue" icon={FaDollarSign} tone="success" value={formatMoney(data.kpis.revenue.value)} change={data.kpis.revenue.change} />
            <KpiCard label="Average job value" icon={FaReceipt} tone="info" value={formatMoney(data.kpis.avgJobValue.value)} change={data.kpis.avgJobValue.change} />
            <KpiCard label="Visitor → request" icon={FaPercent} tone="violet" value={data.kpis.conversionRate.value === null ? "—" : `${data.kpis.conversionRate.value}%`} hint={rateChange(data.kpis.conversionRate) === null ? "Of unique visitors" : `${rateChange(data.kpis.conversionRate)! >= 0 ? "+" : ""}${rateChange(data.kpis.conversionRate)} pts vs previous period`} />
            <KpiCard label="Acceptance rate" icon={FaCheckCircle} tone="success" value={data.kpis.acceptanceRate.value === null ? "—" : `${data.kpis.acceptanceRate.value}%`} hint={rateChange(data.kpis.acceptanceRate) === null ? "Requests you accepted" : `${rateChange(data.kpis.acceptanceRate)! >= 0 ? "+" : ""}${rateChange(data.kpis.acceptanceRate)} pts vs previous period`} />
            <KpiCard label="Average reply time" icon={FaReply} tone="warning" value={formatMinutes(data.kpis.avgReplyMinutes.value)} hint={data.kpis.avgReplyMinutes.previous !== null ? `Was ${formatMinutes(data.kpis.avgReplyMinutes.previous)}` : "Faster replies win more jobs"} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Profile views" description={`Per ${data.granularity}`}>
              <MonthlyBarChart title="Profile views" empty="No profile views in this period." points={data.timeline.map((row, i) => ({ label: fmtKey(row.key), tick: tick(row.key, i, data.timeline.length), value: row.views, display: `${row.views} views` }))} />
            </Panel>
            <Panel title="Booking requests" description={`Per ${data.granularity}`}>
              <MonthlyBarChart title="Booking requests" barClass="bg-[#b39200]" empty="No booking requests in this period." points={data.timeline.map((row, i) => ({ label: fmtKey(row.key), tick: tick(row.key, i, data.timeline.length), value: row.bookings, display: `${row.bookings} requests` }))} />
            </Panel>
            <Panel title="Revenue from completed jobs" description={`Per ${data.granularity}, by completion date`}>
              <MonthlyBarChart title="Revenue" barClass="bg-emerald-600" empty="No completed paid jobs in this period." points={data.timeline.map((row, i) => ({ label: fmtKey(row.key), tick: tick(row.key, i, data.timeline.length), value: row.revenue, display: `${formatMoney(row.revenue)}` }))} />
            </Panel>
            <Panel title="From visit to completed job" description="Where customers drop off">
              <FunnelChart steps={data.funnel} />
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="What visitors did">
              <LabeledBars empty="No visitor activity yet." rows={data.actions.filter((a) => a.count > 0).sort((a, b) => b.count - a.count).map((a) => ({ label: actionLabels[a.event] ?? a.event, value: a.count }))} />
            </Panel>
            <Panel title="Busiest days for requests">
              <LabeledBars empty="No booking requests yet." rows={data.weekdays.map((d) => ({ label: d.label, value: d.count }))} />
            </Panel>
            <Panel title="Reviews in this period">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs text-gray-500">New reviews</dt><dd className="text-xl font-bold tabular-nums text-gray-900">{data.reviews.count}</dd></div>
                <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs text-gray-500">Average rating</dt><dd className="text-xl font-bold tabular-nums text-gray-900">{data.reviews.average ?? "—"}{data.reviews.average ? "★" : ""}</dd></div>
                <div className="rounded-xl bg-emerald-50 p-3"><dt className="text-xs text-emerald-800">Verified customers</dt><dd className="text-xl font-bold tabular-nums text-emerald-900">{data.reviews.verified}</dd></div>
                <div className="rounded-xl bg-[#FFD60A]/15 p-3"><dt className="text-xs text-gray-700">Directory</dt><dd className="text-xl font-bold tabular-nums text-gray-900">{data.reviews.directory}</dd></div>
              </dl>
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Panel title="Top services" description="Requested in this period" bodyClassName="">
              {data.topServices.length === 0 ? <p className="px-5 py-6 text-center text-sm text-gray-500">No bookings yet.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead><tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500"><th scope="col" className="px-5 py-2.5 font-semibold">Service</th><th scope="col" className="px-3 py-2.5 text-right font-semibold">Requests</th><th scope="col" className="px-3 py-2.5 text-right font-semibold">Completed</th><th scope="col" className="px-5 py-2.5 text-right font-semibold">Revenue</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">{data.topServices.map((row) => <tr key={row.service}><td className="px-5 py-2.5 font-medium text-gray-900">{row.service}</td><td className="px-3 py-2.5 text-right tabular-nums">{row.bookings}</td><td className="px-3 py-2.5 text-right tabular-nums">{row.completed}</td><td className="px-5 py-2.5 text-right font-semibold tabular-nums">{formatMoney(row.revenue)}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </Panel>
            <Panel title="Booking outcomes" description="Requests received in this period, by status now">
              <LabeledBars empty="No bookings yet." rows={Object.entries(data.statuses).sort((a, b) => b[1] - a[1]).map(([status, count]) => ({ label: statusLabels[status] ?? status, value: count }))} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
