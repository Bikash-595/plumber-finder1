import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminLiveStatisticsPage() {
  return (
    <AdminPlaceholderPage
      title="Live Statistics"
      description="Monitor active platform sessions, bookings, user engagement, and company response rates in real time."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Realtime bookings</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">+62</p>
          <p className="mt-2 text-sm text-slate-600">Now active</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Active users</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">128</p>
          <p className="mt-2 text-sm text-slate-600">Currently browsing</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Request health</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">94%</p>
          <p className="mt-2 text-sm text-slate-600">Fulfillment rate</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
