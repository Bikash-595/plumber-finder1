import Link from "next/link";
import { formatMoney, type DashboardSummary } from "@/components/utils/userApi";
import Panel from "../ui/Panel";

/** Money and lists at a glance: amount due, total paid, cart and compare. */
export default function AccountSnapshot({ summary }: { summary?: DashboardSummary }) {
  const rows = [
    { label: "Amount due", value: summary ? formatMoney(summary.amountDue) : "–", href: "/dashboard/invoices", strong: Boolean(summary?.amountDue) },
    { label: "Total paid", value: summary ? formatMoney(summary.totalSpent) : "–", href: "/dashboard/wallet" },
    { label: "Items in cart", value: summary?.counts.cart ?? "–", href: "/checkout" },
    { label: "Comparing", value: summary ? `${summary.counts.compare} / 3` : "–", href: "/dashboard/compare" },
  ];
  return (
    <Panel title="Account" bodyClassName="">
      <ul className="divide-y divide-gray-100">
        {rows.map((row) => (
          <li key={row.label}><Link href={row.href} className="flex items-center justify-between px-5 py-3 text-sm transition hover:bg-gray-50 sm:px-6">
            <span className="text-gray-600">{row.label}</span>
            <span className={`font-bold tabular-nums ${row.strong ? "text-amber-700" : "text-gray-900"}`}>{row.value}</span>
          </Link></li>
        ))}
      </ul>
      <div className="p-5 pt-3 sm:px-6">
        <Link href={summary?.amountDue ? "/dashboard/invoices" : "/checkout"} className="block rounded-full bg-[#FFD60A] py-2.5 text-center text-sm font-bold text-[#0b1f3b] hover:brightness-95">{summary?.amountDue ? "View unpaid invoices" : "Go to cart"}</Link>
      </div>
    </Panel>
  );
}
