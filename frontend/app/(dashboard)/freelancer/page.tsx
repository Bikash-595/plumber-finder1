import Link from "next/link";
import { FaArrowRight, FaClock, FaDollarSign, FaStar } from "react-icons/fa";
import { freelancerNavSections } from "@/components/freelancer-dashboard/freelancerDashboardData";

const stats = [
  { label: "New leads", value: "18", detail: "3 high intent this week" },
  { label: "Active jobs", value: "12", detail: "5 scheduled for today" },
  { label: "Earnings", value: "$13.4k", detail: "+9% month over month" },
  { label: "Reviews", value: "4.9", detail: "82 total ratings" },
];

export default function FreelancerDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-[#0b1f3b] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FFD60A]">
              Freelancer Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Your Plumber Freelancer Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Manage leads, jobs, schedules, services, and client feedback from one clean workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/freelancer/leads"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#FFD60A] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:bg-white"
            >
              Open Leads
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/freelancer/profile"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#FFD60A] hover:text-[#FFD60A]"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0b1f3b]/10 text-[#0b1f3b]">
                {stat.label === "New leads" && <FaArrowRight className="h-5 w-5" />}
                {stat.label === "Active jobs" && <FaClock className="h-5 w-5" />}
                {stat.label === "Earnings" && <FaDollarSign className="h-5 w-5" />}
                {stat.label === "Reviews" && <FaStar className="h-5 w-5" />}
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-gray-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Freelancer Dashboard Pages</h2>
            <p className="text-sm text-gray-500">
              Navigate the freelancer workspace and manage your listing entries.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {freelancerNavSections.flatMap((section) => section.items).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-[3.25rem] items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#0b1f3b] hover:bg-white hover:text-[#0b1f3b]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0b1f3b] shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </span>
                <FaArrowRight className="h-3.5 w-3.5 text-gray-400 transition group-hover:text-[#0b1f3b]" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
