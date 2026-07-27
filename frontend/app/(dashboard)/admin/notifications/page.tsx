import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminNotificationsPage() {
  return (
    <AdminPlaceholderPage
      title="Notifications"
      description="Set up alerts, email campaigns, in-app notifications, and system announcements."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Automated alerts</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">27</p>
          <p className="mt-2 text-sm text-slate-600">Live automations</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Announcements</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">5</p>
          <p className="mt-2 text-sm text-slate-600">Messages scheduled</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Push notifications</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
          <p className="mt-2 text-sm text-slate-600">Campaign channels</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
