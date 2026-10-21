"use client";

import Link from "next/link";
import { FaBuilding, FaCalendarCheck, FaClipboardCheck, FaUser, FaUserTie } from "react-icons/fa";
import AdminSectionPage from "@/components/AdminSectionPage";
import { useAdminQuery } from "@/components/AdminData";
import { adminApi, formatMoney } from "@/lib/adminApi";

const cards = [
  { label: "Manage users", href: "/users" },
  { label: "Manage companies", href: "/companies" },
  { label: "Manage freelancers", href: "/freelancers" },
  { label: "Manage bookings", href: "/bookings" },
  { label: "Pending approvals", href: "/pending-approvals" },
  { label: "New registrations", href: "/new-registrations" },
  { label: "Payments", href: "/payments" },
  { label: "Settings", href: "/settings" },
];

export default function AdminOverviewPage() {
  const { data, error, loading } = useAdminQuery("overview", () => adminApi.overview().then((r) => r.data));
  const show = (value?: number) => (value === undefined ? (loading ? "…" : "–") : value.toLocaleString());
  const pending = (data?.pendingApprovals.companies ?? 0) + (data?.pendingApprovals.freelancers ?? 0);

  const metrics = [
    { label: "Customers", value: show(data?.totals.users), note: `+${data?.newThisWeek.users ?? 0} this week`, icon: FaUser, tone: "bg-blue-50 text-blue-600", href: "/users" },
    { label: "Companies", value: show(data?.totals.companies), note: `${data?.totals.publishedCompanies ?? 0} listed publicly`, icon: FaBuilding, tone: "bg-emerald-50 text-emerald-600", href: "/companies" },
    { label: "Freelancers", value: show(data?.totals.freelancers), note: `${data?.totals.publishedFreelancers ?? 0} listed publicly`, icon: FaUserTie, tone: "bg-amber-50 text-amber-600", href: "/freelancers" },
    { label: "Awaiting Approval", value: show(data ? pending : undefined), note: `${data?.pendingApprovals.companies ?? 0} companies · ${data?.pendingApprovals.freelancers ?? 0} freelancers`, icon: FaClipboardCheck, tone: "bg-indigo-50 text-indigo-600", href: "/pending-approvals" },
  ];
  const bookingStatuses = ["pending", "scheduled", "completed", "cancelled"];

  return (
    <AdminSectionPage
      title="Admin Overview"
      description="Live figures for users, companies, freelancers, bookings, and invoices across the platform."
      actions={<Link href="/settings" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0b1f3b] shadow-sm transition hover:bg-gray-100">Go to Settings</Link>}
    >
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link key={metric.label} href={metric.href} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{metric.note}</p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.tone}`}><Icon className="h-5 w-5" /></span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2"><FaCalendarCheck className="text-[#0b1f3b]" /><h2 className="text-lg font-bold text-gray-900">Bookings</h2></div>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bookingStatuses.map((status) => (
              <Link key={status} href={`/bookings?status=${status}`} className="rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{status}</dt>
                <dd className="mt-2 text-2xl font-bold text-slate-900">{show(data ? data.bookingsByStatus[status] ?? 0 : undefined)}</dd>
              </Link>
            ))}
          </dl>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Invoices</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {["pending", "paid"].map((status) => (
              <div key={status} className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{status}</dt>
                <dd className="mt-2 text-2xl font-bold text-slate-900">{data ? formatMoney(data.invoices[status]?.total ?? 0) : show(undefined)}</dd>
                <dd className="text-xs text-slate-500">{data?.invoices[status]?.count ?? 0} invoice(s)</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-gray-500">Invoices are created at customer checkout. Card payments are not connected yet.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Quick Admin Actions</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="group rounded-2xl border border-gray-200 bg-white p-5 text-sm font-semibold text-gray-700 transition hover:border-[#0b1f3b] hover:bg-[#0b1f3b] hover:text-white">
              {card.label}
              <span className="mt-3 inline-flex text-xs text-gray-500 group-hover:text-white">View details →</span>
            </Link>
          ))}
        </div>
      </section>
    </AdminSectionPage>
  );
}
