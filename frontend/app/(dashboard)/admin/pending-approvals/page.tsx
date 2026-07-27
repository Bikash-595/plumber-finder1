import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminPendingApprovalsPage() {
  return (
    <AdminPlaceholderPage
      title="Pending Approvals"
      description="Review pending users, companies, freelancers and bookings that need administrative approval."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">User approvals</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">21</p>
          <p className="mt-2 text-sm text-slate-600">Waiting review</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Company verifications</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">14</p>
          <p className="mt-2 text-sm text-slate-600">Documents pending</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Freelancer approvals</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">8</p>
          <p className="mt-2 text-sm text-slate-600">Pending verification</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
