import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

export default function AdminPaymentsPage() {
  return (
    <AdminPlaceholderPage
      title="Payments"
      description="Review transaction history, refunds, withdrawals, and payment gateway performance."
      actionLabel="Back to admin"
      actionHref="/admin"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total transactions</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">16,240</p>
          <p className="mt-2 text-sm text-slate-600">Completed payments</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Refund requests</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">9</p>
          <p className="mt-2 text-sm text-slate-600">Pending review</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Withdrawals</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">14</p>
          <p className="mt-2 text-sm text-slate-600">Awaiting payout</p>
        </div>
      </div>
    </AdminPlaceholderPage>
  );
}
