import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminCategoriesPage() {
  return (
    <AdminPlaceholderPage
      title="Service Categories"
      description="Maintain plumbing category listings, emergency services, SEO labels, and pricing packages."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Active categories</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">16</p>
          <p className="mt-2 text-sm text-slate-600">Currently listed</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Emergency services</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">5</p>
          <p className="mt-2 text-sm text-slate-600">High priority offerings</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Commercial services</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">4</p>
          <p className="mt-2 text-sm text-slate-600">Business categories</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
