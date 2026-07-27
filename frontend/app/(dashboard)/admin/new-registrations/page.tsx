import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminNewRegistrationsPage() {
  return (
    <AdminPlaceholderPage
      title="New Registrations"
      description="Review the newest accounts created by users, companies, and freelancers across the marketplace."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">New users</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">112</p>
          <p className="mt-2 text-sm text-slate-600">Accounts created this week</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">New companies</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">24</p>
          <p className="mt-2 text-sm text-slate-600">Businesses onboarded</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">New freelancers</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">46</p>
          <p className="mt-2 text-sm text-slate-600">Pros joined</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
