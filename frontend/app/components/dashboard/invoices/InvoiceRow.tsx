"use client";

import { useState } from "react";
import { FaChevronDown, FaDownload, FaFileInvoiceDollar } from "react-icons/fa";
import { formatDate, formatMoney, type Invoice } from "@/components/utils/userApi";
import StatusPill from "../ui/StatusPill";
import { downloadInvoice } from "./downloadInvoice";
import { invoiceProviders, invoiceStatus } from "./invoiceStatus";

/** One invoice: number, plumbers, total and status, expanding to its line items and totals. */
export default function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false);
  const status = invoiceStatus[invoice.status];
  return (
    <li>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 sm:px-6">
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 sm:flex"><FaFileInvoiceDollar className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1 basis-48">
          <p className="font-mono text-sm font-semibold text-gray-900">{invoice.number}</p>
          <p className="truncate text-xs text-gray-500">{invoiceProviders(invoice) || "—"} · {formatDate(invoice.createdAt)}</p>
        </div>
        <StatusPill tone={status.tone}>{status.label}</StatusPill>
        <p className="w-24 text-right text-base font-bold tabular-nums text-gray-900">{formatMoney(invoice.total)}</p>
        <div className="flex gap-1">
          <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} aria-label={open ? "Hide invoice details" : "Show invoice details"} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"><FaChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} /></button>
          <button type="button" onClick={() => downloadInvoice(invoice)} aria-label={`Download ${invoice.number}`} title="Download" className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"><FaDownload className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 text-sm sm:px-6">
          <ul className="divide-y divide-gray-200/70">
            {invoice.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-4 py-2">
                <span className="min-w-0 text-gray-700"><span className="font-medium text-gray-900">{item.name}</span>{item.providerName ? ` · ${item.providerName}` : ""} × {item.quantity}</span>
                <span className="tabular-nums text-gray-900">{formatMoney(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="ml-auto mt-3 max-w-xs space-y-1 border-t border-gray-200 pt-3 tabular-nums">
            <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd>{formatMoney(invoice.subtotal)}</dd></div>
            {invoice.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount{invoice.promoCode ? ` (${invoice.promoCode})` : ""}</dt><dd>−{formatMoney(invoice.discount)}</dd></div>}
            <div className="flex justify-between text-gray-600"><dt>Tax</dt><dd>{formatMoney(invoice.tax)}</dd></div>
            <div className="flex justify-between font-bold text-gray-900"><dt>Total</dt><dd>{formatMoney(invoice.total)}</dd></div>
          </dl>
          {invoice.dueDate && invoice.status === "pending" && <p className="mt-2 text-right text-xs text-amber-700">Payment due {formatDate(invoice.dueDate)}</p>}
        </div>
      )}
    </li>
  );
}
