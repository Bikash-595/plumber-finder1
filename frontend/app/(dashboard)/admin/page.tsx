import AdminSectionPage from "@/components/admin-dashboard/AdminSectionPage";
import Link from "next/link";
import { FaBuilding, FaChartLine, FaUser, FaUserTie } from "react-icons/fa";

const metrics = [
  { label: "Total Users", value: "7,420", icon: FaUser, tone: "bg-blue-50 text-blue-600" },
  { label: "Companies", value: "1,280", icon: FaBuilding, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Freelancers", value: "3,710", icon: FaUserTie, tone: "bg-amber-50 text-amber-600" },
  { label: "Active Reports", value: "24", icon: FaChartLine, tone: "bg-indigo-50 text-indigo-600" },
];

const cards = [
  { label: "Manage users", href: "/admin/users" },
  { label: "Manage companies", href: "/admin/companies" },
  { label: "Manage freelancers", href: "/admin/freelancers" },
  { label: "Manage bookings", href: "/admin/bookings" },
  { label: "Manage payments", href: "/admin/payments" },
  { label: "Manage reviews", href: "/admin/reviews" },
  { label: "Service categories", href: "/admin/categories" },
  { label: "Support center", href: "/admin/support" },
];

export default function AdminOverviewPage() {
  return (
    <AdminSectionPage
      title="Admin Overview"
      description="Control users, companies, freelancers and platform settings from one centralized dashboard."
      actions={
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0b1f3b] shadow-sm transition hover:bg-gray-100"
        >
          Go to Settings
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Quick Admin Actions</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-gray-200 bg-white p-5 text-sm font-semibold text-gray-700 transition hover:border-[#0b1f3b] hover:bg-[#0b1f3b] hover:text-white"
            >
              {card.label}
              <span className="mt-3 inline-flex text-xs text-gray-500 group-hover:text-white">
                View details →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AdminSectionPage>
  );
}
