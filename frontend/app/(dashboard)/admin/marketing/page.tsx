import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminMarketingPage() {
  return (
    <AdminPlaceholderPage
      title="Marketing"
      description="Configure promotions, campaigns, ads, featured listings, coupons and SEO for the marketplace."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Active campaigns</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
          <p className="mt-2 text-sm text-slate-600">Running promotions</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Featured listings</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">18</p>
          <p className="mt-2 text-sm text-slate-600">Premium promotion slots</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Coupons live</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">34</p>
          <p className="mt-2 text-sm text-slate-600">Discount offers</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
