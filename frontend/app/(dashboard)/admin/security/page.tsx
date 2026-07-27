import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminSecurityPage() {
  return (
    <AdminPlaceholderPage
      title="Security Settings"
      description="Review platform security policies, access control, fraud prevention, and audit logs."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Active protections</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">7</p>
          <p className="mt-2 text-sm text-slate-600">Enabled security rules</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Suspicious logins</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">14</p>
          <p className="mt-2 text-sm text-slate-600">Flagged sessions</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Audit log entries</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">1,206</p>
          <p className="mt-2 text-sm text-slate-600">Recent security events</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
