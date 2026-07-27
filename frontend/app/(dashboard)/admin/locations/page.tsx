import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminLocationsPage() {
  return (
    <AdminPlaceholderPage
      title="Locations"
      description="Manage coverage areas, countries, states, cities, ZIP zones, and map-based service radii."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Countries covered</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">5</p>
          <p className="mt-2 text-sm text-slate-600">Regional support</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Service cities</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">120</p>
          <p className="mt-2 text-sm text-slate-600">City coverage</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Service areas</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">74</p>
          <p className="mt-2 text-sm text-slate-600">Geofenced zones</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
