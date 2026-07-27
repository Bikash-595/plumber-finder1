import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminRevenueAnalyticsPage() {
  return (
    <AdminPlaceholderPage
      title="Revenue Analytics"
      description="Review revenue sources, subscription performance, commission flows, and payout trends."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Monthly revenue</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">$312K</p>
          <p className="mt-2 text-sm text-slate-600">Total platform income</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Subscription revenue</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">$129K</p>
          <p className="mt-2 text-sm text-slate-600">Recurring plan earnings</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Refund rate</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">1.7%</p>
          <p className="mt-2 text-sm text-slate-600">Payments refunded</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
