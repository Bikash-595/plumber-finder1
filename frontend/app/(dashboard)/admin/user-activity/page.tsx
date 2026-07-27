import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminUserActivityPage() {
  return (
    <AdminPlaceholderPage
      title="User Activity"
      description="Track sign-in events, booking interactions, saved providers, and referral activity across users."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Daily active users</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">1,720</p>
          <p className="mt-2 text-sm text-slate-600">Logged in today</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Booking interactions</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">3,450</p>
          <p className="mt-2 text-sm text-slate-600">Requests started</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Referrals</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">242</p>
          <p className="mt-2 text-sm text-slate-600">New referred users</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
