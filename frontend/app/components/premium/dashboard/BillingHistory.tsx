import { FaExternalLinkAlt, FaReceipt } from "react-icons/fa";
import { money, type Payment } from "../premiumApi";

const date = (value?: string) => (value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—");
const planName = { premium: "Premium", elite: "Premium Plus" };

/** Every premium payment: date, plan, period, amount, status, and the Stripe invoice when there is one. */
export default function BillingHistory({ payments }: { payments: Payment[] }) {
  return (
    <section aria-labelledby="billing-heading" className="rounded-2xl border border-gray-200 bg-white">
      <h2 id="billing-heading" className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 text-lg font-extrabold text-gray-900"><FaReceipt className="h-4 w-4 text-[#b39200]" aria-hidden /> Billing history</h2>
      {payments.length === 0 ? <p className="px-5 py-6 text-sm text-gray-500">No payments yet.</p> : (
        <ul className="divide-y divide-gray-100">
          {payments.map((payment) => (
            <li key={payment._id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
              <span className="w-28 shrink-0 font-semibold text-gray-900">{date(payment.createdAt)}</span>
              <span className="min-w-0 flex-1 text-gray-600">{planName[payment.plan] ?? payment.plan} · {date(payment.periodStart)} – {date(payment.periodEnd)}{payment.source === "manual" ? " · paid offline" : ""}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${payment.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{payment.status === "paid" ? "Paid" : payment.status === "failed" ? "Failed" : "Refunded"}</span>
              <span className="w-20 text-right font-bold tabular-nums text-gray-900">{money(payment.amount)}</span>
              {payment.invoiceUrl && <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#0b1f3b] underline">Invoice <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
