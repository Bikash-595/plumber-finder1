"use client";

import { Fragment, useState } from "react";
import { FaDownload, FaEye, FaFileInvoice } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatDate, formatMoney, userApi, type Invoice } from "@/components/utils/userApi";

const getStatusColor = (status: Invoice["status"]) => {
  switch (status) {
    case "paid": return "bg-green-50 text-green-700 border-green-200";
    case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
    case "refunded": return "bg-blue-50 text-blue-700 border-blue-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const providers = (invoice: Invoice) => [...new Set(invoice.items.map((item) => item.providerName).filter(Boolean))].join(", ");

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Saves a simple printable HTML copy of the invoice. */
function downloadInvoice(invoice: Invoice) {
  const rows = invoice.items.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.providerName ?? "")}</td><td>${item.quantity}</td><td>${formatMoney(item.price)}</td><td>${formatMoney(item.price * item.quantity)}</td></tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${invoice.number}</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;color:#111}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}.t{text-align:right}</style></head><body>
<h1>Plumber Finder — Invoice ${invoice.number}</h1><p>Date: ${formatDate(invoice.createdAt)} · Status: ${invoice.status}${invoice.dueDate ? ` · Due: ${formatDate(invoice.dueDate)}` : ""}</p>
<table><thead><tr><th>Service</th><th>Plumber</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
<p class="t">Subtotal: ${formatMoney(invoice.subtotal)}<br>${invoice.discount ? `Discount${invoice.promoCode ? ` (${escapeHtml(invoice.promoCode)})` : ""}: -${formatMoney(invoice.discount)}<br>` : ""}Tax: ${formatMoney(invoice.tax)}<br><strong>Total: ${formatMoney(invoice.total)}</strong></p></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `${invoice.number}.html` });
  link.click();
  URL.revokeObjectURL(url);
}

export default function InvoicesPage() {
  const { signedIn, data: invoices, error, loading } = useUserData(userApi.invoices);
  const [open, setOpen] = useState<string | null>(null);

  if (!signedIn) return <SignInPrompt what="your invoices" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="mt-2 text-gray-600">View and download your invoices. Invoices are created when you check out your cart.</p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}
      {loading && <p className="py-8 text-center text-gray-500">Loading invoices…</p>}
      {!loading && !invoices?.length && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <FaFileInvoice className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-600">No invoices yet.</p>
        </div>
      )}

      {!!invoices?.length && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {["Invoice", "Plumber", "Amount", "Date", "Status", "Action"].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <Fragment key={invoice._id}>
                  <tr className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.number}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{providers(invoice) || "—"}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatMoney(invoice.total)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button type="button" aria-expanded={open === invoice._id} onClick={() => setOpen(open === invoice._id ? null : invoice._id)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                          <FaEye className="h-4 w-4" /> {open === invoice._id ? "Hide" : "View"}
                        </button>
                        <button type="button" onClick={() => downloadInvoice(invoice)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                          <FaDownload className="h-4 w-4" /> Download
                        </button>
                      </div>
                    </td>
                  </tr>
                  {open === invoice._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4 text-sm text-gray-700">
                        <ul className="space-y-1">
                          {invoice.items.map((item, index) => (
                            <li key={index} className="flex justify-between gap-4"><span>{item.name} · {item.providerName} × {item.quantity}</span><span>{formatMoney(item.price * item.quantity)}</span></li>
                          ))}
                        </ul>
                        <div className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-right">
                          <p>Subtotal {formatMoney(invoice.subtotal)}</p>
                          {invoice.discount > 0 && <p className="text-green-700">Discount{invoice.promoCode ? ` (${invoice.promoCode})` : ""} -{formatMoney(invoice.discount)}</p>}
                          <p>Tax {formatMoney(invoice.tax)}</p>
                          <p className="font-bold text-gray-900">Total {formatMoney(invoice.total)}</p>
                          {invoice.dueDate && invoice.status === "pending" && <p className="text-xs text-gray-500">Payment due {formatDate(invoice.dueDate)}</p>}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
