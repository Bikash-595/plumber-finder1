import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminSupportPage() {
  return (
    <AdminPlaceholderPage
      title="Support & Complaints"
      description="Track support tickets, escalations, fraud reports, and complaint resolution for all user roles."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Open tickets</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">18</p>
          <p className="mt-2 text-sm text-slate-600">Pending responses</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Priority cases</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">6</p>
          <p className="mt-2 text-sm text-slate-600">Escalated issues</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Fraud reports</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">3</p>
          <p className="mt-2 text-sm text-slate-600">Investigations active</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
