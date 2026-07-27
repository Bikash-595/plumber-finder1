import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminReportsPage() {
  return (
    <AdminPlaceholderPage
      title="Reports & Complaints"
      description="Manage flagged content, user complaints, dispute cases, and safety reports for the platform."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Open complaints</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">18</p>
          <p className="mt-2 text-sm text-slate-600">Needs review</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Escalated cases</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">4</p>
          <p className="mt-2 text-sm text-slate-600">High priority</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Fraud reports</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">3</p>
          <p className="mt-2 text-sm text-slate-600">Investigations</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
