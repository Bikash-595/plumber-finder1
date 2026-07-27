import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholderPage
      title="Platform Settings"
      description="Control platform defaults, appearance, policies, and global account settings."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Localization</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
          <p className="mt-2 text-sm text-slate-600">Languages enabled</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Site mode</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">Live</p>
          <p className="mt-2 text-sm text-slate-600">Production environment</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Feature flags</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">8</p>
          <p className="mt-2 text-sm text-slate-600">Active toggles</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
