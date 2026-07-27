import Link from "next/link";
import { ReactNode } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaStar,
  FaUsers,
} from "react-icons/fa";

export type CompanyMetric = {
  label: string;
  value: string;
  detail: string;
};

export type CompanyTask = {
  title: string;
  status: string;
  detail: string;
};

export type CompanySectionContent = {
  title: string;
  description: string;
  stats: CompanyMetric[];
  tasks: CompanyTask[];
};

export type CompanyTable = {
  title: string;
  description: string;
  headers: string[];
  rows: string[][];
};

interface CompanySectionPageProps {
  content: CompanySectionContent;
  children: ReactNode;
  showOperations?: boolean;
}

const summaryCards = [
  { label: "Revenue", value: "$84.2k", detail: "+14% month over month", icon: FaDollarSign, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Active Jobs", value: "19", detail: "7 in progress today", icon: FaCalendarAlt, tone: "bg-blue-50 text-blue-600" },
  { label: "Customers", value: "1,248", detail: "82 new this month", icon: FaUsers, tone: "bg-purple-50 text-purple-600" },
  { label: "Rating", value: "4.9", detail: "386 verified reviews", icon: FaStar, tone: "bg-amber-50 text-amber-600" },
];

const pipeline = [
  { label: "New", value: "28", color: "bg-blue-500" },
  { label: "Qualified", value: "19", color: "bg-emerald-500" },
  { label: "Quoted", value: "17", color: "bg-amber-500" },
  { label: "Booked", value: "11", color: "bg-[#0b1f3b]" },
];

const workQueue = [
  { customer: "Maria Coleman", job: "Water heater replacement", time: "9:30 AM", status: "Assigned" },
  { customer: "Harbor Cafe", job: "Grease line inspection", time: "11:00 AM", status: "Needs quote" },
  { customer: "Riverside HOA", job: "Backflow testing", time: "2:15 PM", status: "Confirmed" },
  { customer: "Daniel Morris", job: "Emergency leak repair", time: "4:00 PM", status: "High priority" },
];

export function CompanySectionTable({ table }: { table: CompanyTable }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{table.title}</h2>
          <p className="text-sm text-gray-500">{table.description}</p>
        </div>
        <button className="inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-[#0b1f3b] transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">
          Export
          <FaArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-100">
        <div className="hidden bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500 md:grid md:grid-cols-4">
          {table.headers.map((header) => (
            <div key={header} className="px-4 py-3">
              {header}
            </div>
          ))}
        </div>
        {table.rows.map((row) => (
          <div
            key={row.join("-")}
            className="grid gap-3 border-t border-gray-100 p-4 text-sm md:grid-cols-4 md:items-center"
          >
            {row.map((cell, index) => (
              <div key={`${cell}-${index}`} className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 md:hidden">
                  {table.headers[index]}
                </p>
                <p className={index === 0 ? "font-bold text-gray-900" : "font-semibold text-gray-600"}>
                  {cell}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CompanySectionPage({
  content,
  children,
  showOperations = true,
}: CompanySectionPageProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-[#0b1f3b] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FFD60A]">
              Plumber Company Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              {content.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/company-dashboard/leads"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#FFD60A] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:bg-white"
            >
              Review Leads
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/company-dashboard/schedule"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#FFD60A] hover:text-[#FFD60A]"
            >
              Open Schedule
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold text-gray-500">{stat.detail}</p>
            </article>
          );
        })}
      </section>

      {children}

      {showOperations && (
        <>
          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Priority Work</h2>
                  <p className="text-sm text-gray-500">Operational tasks that need attention.</p>
                </div>
                <Link
                  href="/company-dashboard/jobs"
                  className="text-sm font-bold text-[#0b1f3b] transition hover:text-[#B9A000]"
                >
                  View all jobs
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {content.tasks.map((task) => (
                  <div
                    key={task.title}
                    className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{task.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{task.detail}</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0b1f3b] shadow-sm">
                      <FaClock className="h-3.5 w-3.5 text-[#FFD60A]" />
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Section Metrics</h2>
              <div className="mt-6 space-y-4">
                {content.stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <FaCheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-gray-500">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Lead Pipeline</h2>
              <div className="mt-6 space-y-4">
                {pipeline.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-600">{item.label}</span>
                      <span className="font-bold text-gray-900">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${Math.min(Number(item.value) * 3, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Today&apos;s Work Queue</h2>
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-100">
                {workQueue.map((item) => (
                  <div
                    key={`${item.customer}-${item.time}`}
                    className="grid gap-2 border-b border-gray-100 p-4 last:border-b-0 sm:grid-cols-[1fr_auto]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">{item.customer}</p>
                      <p className="mt-1 text-xs text-gray-500">{item.job}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-gray-900">{item.time}</p>
                      <p className="mt-1 text-xs font-semibold text-[#0b1f3b]">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
