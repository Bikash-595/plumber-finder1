import Panel from "@/components/dashboard/ui/Panel";
import MonthlyBarChart from "@/components/dashboard/overview/MonthlyBarChart";
import type { CompanyDashboard } from "../companyApi";

const label = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
/** Axis text for every third day (and today), so short labels never crowd. */
const tick = (day: string, index: number, total: number) => ((total - 1 - index) % 3 === 0 ? label(day) : "");

/** The last 14 days: profile views and booking requests, as two separate charts (different scales). */
export default function TrendPanel({ trend }: { trend: CompanyDashboard["trend"] }) {
  return (
    <Panel title="Last 14 days" description="Each bar is one day; today is on the right.">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Profile views</p>
          <MonthlyBarChart title="Profile views per day" empty="No profile views in the last 14 days." points={trend.map((d, i) => ({ label: label(d.day), tick: tick(d.day, i, trend.length), value: d.views, display: `${d.views} view${d.views === 1 ? "" : "s"}` }))} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Booking requests</p>
          <MonthlyBarChart title="Booking requests per day" barClass="bg-[#b39200]" empty="No booking requests in the last 14 days." points={trend.map((d, i) => ({ label: label(d.day), tick: tick(d.day, i, trend.length), value: d.bookings, display: `${d.bookings} request${d.bookings === 1 ? "" : "s"}` }))} />
        </div>
      </div>
    </Panel>
  );
}
