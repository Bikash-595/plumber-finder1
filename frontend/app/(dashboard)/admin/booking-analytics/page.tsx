import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminBookingAnalyticsPage() {
  return (
    <AdminPlaceholderPage
      title="Booking Analytics"
      description="Analyze booking performance, cancellation trends, emergency demand, and completion velocity."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">New bookings</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">1,280</p>
          <p className="mt-2 text-sm text-slate-600">Created this month</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Completion rate</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">87%</p>
          <p className="mt-2 text-sm text-slate-600">Successful jobs</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Emergency bookings</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">178</p>
          <p className="mt-2 text-sm text-slate-600">High-priority jobs</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
