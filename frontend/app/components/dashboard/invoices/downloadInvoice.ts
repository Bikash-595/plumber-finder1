import { formatDate, formatMoney, type Invoice } from "@/components/utils/userApi";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Saves a printable HTML copy of the invoice (opens cleanly in any browser and prints to PDF). */
export function downloadInvoice(invoice: Invoice) {
  const rows = invoice.items.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.providerName ?? "")}</td><td>${item.quantity}</td><td>${formatMoney(item.price)}</td><td class="t">${formatMoney(item.price * item.quantity)}</td></tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${invoice.number}</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;color:#111;padding:0 16px}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}.t{text-align:right}.muted{color:#666}</style></head><body>
<h1>Plumber Finder — Invoice ${invoice.number}</h1><p class="muted">Date: ${formatDate(invoice.createdAt)} · Status: ${invoice.status}${invoice.dueDate ? ` · Due: ${formatDate(invoice.dueDate)}` : ""}</p>
<table><thead><tr><th>Service</th><th>Plumber</th><th>Qty</th><th>Price</th><th class="t">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<p class="t">Subtotal: ${formatMoney(invoice.subtotal)}<br>${invoice.discount ? `Discount${invoice.promoCode ? ` (${escapeHtml(invoice.promoCode)})` : ""}: -${formatMoney(invoice.discount)}<br>` : ""}Tax: ${formatMoney(invoice.tax)}<br><strong>Total: ${formatMoney(invoice.total)}</strong></p></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `${invoice.number}.html` });
  link.click();
  URL.revokeObjectURL(url);
}
