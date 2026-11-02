"use client";

import { useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import { useCompanyData } from "../companyApi";
import JobDrawer from "../jobs/JobDrawer";
import { growthApi } from "../growthApi";
import { operationsApi, type ScheduleItem } from "../operationsApi";
import { addDays, iso, label, rangeFor, todayUtc } from "./dates";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

const legend = [["bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_2px,#fff_2px,#fff_5px)] border border-gray-300", "Day off"], ["bg-blue-400", "Scheduled"], ["bg-violet-400", "In progress"], ["bg-amber-400", "Waiting for customer"], ["bg-emerald-500", "Completed"], ["border-2 border-dashed border-amber-400", "Request (not accepted)"]];

/** /company-dashboard/schedule — your jobs on a week or month calendar. */
export default function CompanySchedule() {
  const [view, setView] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState(todayUtc);
  const [open, setOpen] = useState<string | null>(null);
  const { from, days } = rangeFor(view, anchor);
  const to = days.at(-1)!;
  const { data, error, loading, reload } = useCompanyData(`company-schedule-${iso(from)}-${iso(to)}`, () => operationsApi.schedule(iso(from), iso(to)).then((r) => r.data));
  const availability = useCompanyData("company-availability", growthApi.availability).data;
  const blocked = new Set<string>();
  for (const period of availability?.timeOff ?? []) for (let t = new Date(period.start.slice(0, 10)).getTime(); t <= new Date(period.end.slice(0, 10)).getTime(); t += 864e5) blocked.add(new Date(t).toISOString().slice(0, 10));
  const byDay = new Map<string, ScheduleItem[]>();
  for (const item of data?.items ?? []) { const key = item.scheduledDate.slice(0, 10); byDay.set(key, [...(byDay.get(key) ?? []), item]); }
  const step = (direction: number) => setAnchor(view === "week" ? addDays(anchor, 7 * direction) : new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + direction, 1)));
  const title = view === "week" ? `${label(from, { month: "short", day: "numeric" })} – ${label(to, { month: "short", day: "numeric", year: "numeric" })}` : label(anchor, { month: "long", year: "numeric" });
  const jobs = (data?.items ?? []).filter((item) => item.status !== "pending").length;
  const requests = (data?.items ?? []).length - jobs;

  return (
    <div className="space-y-5">
      <PageHeader icon={FaCalendarAlt} title="Schedule" description="Accepted jobs by visit date. Dashed entries are requests you haven't answered yet." />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white hover:bg-gray-50"><FaChevronLeft className="h-3 w-3" /></button>
          <button type="button" onClick={() => setAnchor(todayUtc())} className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold hover:bg-gray-50">Today</button>
          <button type="button" onClick={() => step(1)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white hover:bg-gray-50"><FaChevronRight className="h-3 w-3" /></button>
          <h2 className="ml-2 text-lg font-bold text-gray-900" aria-live="polite">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{jobs} job{jobs === 1 ? "" : "s"}{requests ? ` · ${requests} request${requests === 1 ? "" : "s"}` : ""}</p>
          <div className="flex rounded-full border border-gray-200 bg-white p-1 text-sm font-semibold" role="group" aria-label="Calendar view">
            {(["week", "month"] as const).map((v) => <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-full px-3 py-1 capitalize ${view === v ? "bg-[#0b1f3b] text-white" : "text-gray-600"}`}>{v}</button>)}
          </div>
        </div>
      </div>
      <Notice>{error}</Notice>
      {loading && !data ? <Skeleton className="h-80 rounded-2xl" /> : view === "week"
        ? <WeekView days={days} byDay={byDay} hours={data?.hours ?? null} blocked={blocked} onOpen={(item) => setOpen(item._id)} />
        : <MonthView days={days} month={anchor.getUTCMonth()} byDay={byDay} blocked={blocked} onOpen={(item) => setOpen(item._id)} onDay={(day) => { setAnchor(day); setView("week"); }} />}
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600" aria-label="Legend">{legend.map(([dot, text]) => <li key={text} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-full ${dot}`} />{text}</li>)}</ul>
      <JobDrawer jobId={open} onClose={() => setOpen(null)} onChanged={reload} />
    </div>
  );
}
