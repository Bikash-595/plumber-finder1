import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminReviewsPage() {
  return (
    <AdminPlaceholderPage
      title="Reviews"
      description="Moderate platform reviews, respond to reported content, and monitor reputation signals."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Positive reviews</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">10,840</p>
          <p className="mt-2 text-sm text-slate-600">Higher satisfaction</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Reported reviews</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">220</p>
          <p className="mt-2 text-sm text-slate-600">Require moderation</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Average rating</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">4.8</p>
          <p className="mt-2 text-sm text-slate-600">Out of 5</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
