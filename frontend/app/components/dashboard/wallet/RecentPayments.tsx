"use client";

import Link from "next/link";
import { formatDate, formatMoney, userApi, type Invoice } from "@/components/utils/userApi";
import { usePagedList } from "../useUserData";
import Panel from "../ui/Panel";
import StatusPill from "../ui/StatusPill";
import { Skeleton } from "../ui/Skeleton";
import { invoiceStatus } from "../invoices/invoiceStatus";

/** The five latest invoices; the full history lives on the Invoices page. */
export default function RecentPayments() {
  const list = usePagedList<Invoice>("invoices-recent", () => userApi.invoicesPage({ limit: 5 }));
  return (
    <Panel title="Recent payments" action={<Link href="/dashboard/invoices" className="text-sm font-semibold text-[#8a7300] hover:underline">All invoices →</Link>} bodyClassName="">
      {list.loading ? <div className="space-y-2 p-5"><Skeleton className="h-10" /><Skeleton className="h-10" /></div> : list.items.length === 0 ? (
        <p className="p-6 text-center text-sm text-gray-500">No payments yet. Invoices from checkout appear here.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {list.items.map((invoice) => (
            <li key={invoice._id} className="flex items-center gap-4 px-5 py-3 sm:px-6">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-semibold text-gray-900">{invoice.number}</p>
                <p className="text-xs text-gray-500">{formatDate(invoice.createdAt)}</p>
              </div>
              <StatusPill tone={invoiceStatus[invoice.status].tone}>{invoiceStatus[invoice.status].label}</StatusPill>
              <p className={`w-24 text-right text-sm font-bold tabular-nums ${invoice.status === "refunded" ? "text-emerald-600" : "text-gray-900"}`}>{invoice.status === "refunded" ? "+" : ""}{formatMoney(invoice.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
