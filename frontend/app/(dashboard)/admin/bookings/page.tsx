import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminBookingsPage() {
  return (
    <AdminPlaceholderPage
      title="Bookings"
      description="Manage every booking from pending requests to completed services and cancellations."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Pending bookings</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">46</p>
          <p className="mt-2 text-sm text-slate-600">Awaiting confirmation</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Ongoing services</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">29</p>
          <p className="mt-2 text-sm text-slate-600">Currently active</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Cancelled bookings</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
          <p className="mt-2 text-sm text-slate-600">Recent cancellations</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
