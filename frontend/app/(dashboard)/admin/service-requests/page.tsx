import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminServiceRequestsPage() {
  return (
    <AdminPlaceholderPage
      title="Service Requests"
      description="See the latest service requests and manage approval, assignment, and urgency levels."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Open requests</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">74</p>
          <p className="mt-2 text-sm text-slate-600">Awaiting assignment</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Urgent requests</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">19</p>
          <p className="mt-2 text-sm text-slate-600">High priority jobs</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Assigned jobs</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">58</p>
          <p className="mt-2 text-sm text-slate-600">Currently in progress</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
