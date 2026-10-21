"use client";

import { useState } from "react";
import { FaCreditCard, FaWallet, FaPlus, FaTrash } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatDate, formatMoney, userApi, type PaymentMethod } from "@/components/utils/userApi";

const brandLabel: Record<PaymentMethod["brand"], string> = { visa: "Visa", mastercard: "Mastercard", amex: "American Express", discover: "Discover", other: "Card" };
const blankCard = { brand: "visa" as PaymentMethod["brand"], last4: "", expMonth: "", expYear: "", holderName: "" };

export default function WalletPage() {
  const methods = useUserData(userApi.paymentMethods);
  const invoices = useUserData(userApi.invoices);
  const [adding, setAdding] = useState(false);
  const [card, setCard] = useState(blankCard);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!methods.signedIn) return <SignInPrompt what="your wallet" />;

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try { await action(); await methods.reload(); return true; } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong."); return false; } finally { setBusy(false); }
  };
  const addCard = async (event: React.FormEvent) => {
    event.preventDefault();
    const ok = await run(() => userApi.addPaymentMethod({ brand: card.brand, last4: card.last4, expMonth: Number(card.expMonth), expYear: Number(card.expYear), holderName: card.holderName || undefined }));
    if (ok) { setCard(blankCard); setAdding(false); }
  };

  const allInvoices = invoices.data ?? [];
  const amountDue = allInvoices.filter((invoice) => invoice.status === "pending").reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPaid = allInvoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.total, 0);
  const input = "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FFD60A] focus:outline-none";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet & Payments</h1>
        <p className="mt-2 text-gray-600">Manage your payment methods and see your payment history.</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl bg-gradient-to-r from-[#FFD60A] to-amber-400 p-8 text-gray-900 shadow-lg">
        <div className="flex items-center justify-between gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium opacity-90">Amount due</p>
              <p className="mt-2 text-4xl font-bold">{formatMoney(amountDue)}</p>
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Total paid</p>
              <p className="mt-2 text-4xl font-bold">{formatMoney(totalPaid)}</p>
            </div>
          </div>
          <FaWallet className="hidden h-12 w-12 opacity-50 sm:block" />
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}

      {/* Payment Methods */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
          {!adding && (
            <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#FFD60A] px-4 py-2 font-medium text-gray-900 transition hover:bg-[#FFD60A]/90">
              <FaPlus className="h-4 w-4" /> Add Method
            </button>
          )}
        </div>

        {adding && (
          <form onSubmit={addCard} className="mb-4 grid gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2">
            <select aria-label="Card brand" value={card.brand} onChange={(e) => setCard({ ...card, brand: e.target.value as PaymentMethod["brand"] })} className={input}>
              {Object.entries(brandLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <input aria-label="Last 4 digits" required inputMode="numeric" pattern="\d{4}" maxLength={4} placeholder="Last 4 digits" value={card.last4} onChange={(e) => setCard({ ...card, last4: e.target.value.replace(/\D/g, "") })} className={input} />
            <input aria-label="Expiry month" required type="number" min={1} max={12} placeholder="Expiry month (MM)" value={card.expMonth} onChange={(e) => setCard({ ...card, expMonth: e.target.value })} className={input} />
            <input aria-label="Expiry year" required type="number" min={new Date().getFullYear()} max={2100} placeholder="Expiry year (YYYY)" value={card.expYear} onChange={(e) => setCard({ ...card, expYear: e.target.value })} className={input} />
            <input aria-label="Name on card" placeholder="Name on card (optional)" value={card.holderName} onChange={(e) => setCard({ ...card, holderName: e.target.value })} className={`${input} sm:col-span-2`} />
            <p className="text-xs text-gray-500 sm:col-span-2">We only store the brand, last 4 digits, and expiry — never your full card number.</p>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" disabled={busy} className="rounded-lg bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Save card</button>
              <button type="button" onClick={() => { setAdding(false); setCard(blankCard); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {methods.loading && <p className="text-sm text-gray-500">Loading payment methods…</p>}
          {!methods.loading && !methods.data?.length && !adding && <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">No saved payment methods.</p>}
          {methods.data?.map((method) => (
            <div key={method._id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-3"><FaCreditCard className="h-6 w-6 text-gray-600" /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-gray-900">{brandLabel[method.brand]}</p>
                      {method.isDefault && <span className="inline-block rounded-full bg-[#FFD60A]/20 px-2 py-1 text-xs font-semibold text-[#8a7300]">Default</span>}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">•••• {method.last4}{method.holderName ? ` · ${method.holderName}` : ""}</p>
                    <p className="text-xs text-gray-500">Expires {String(method.expMonth).padStart(2, "0")}/{method.expYear}</p>
                    {!method.isDefault && (
                      <button type="button" disabled={busy} onClick={() => run(() => userApi.setDefaultPaymentMethod(method._id))} className="mt-2 text-xs font-semibold text-[#0b1f3b] underline">Make default</button>
                    )}
                  </div>
                </div>
                <button type="button" aria-label={`Remove card ending ${method.last4}`} disabled={busy} onClick={() => { if (window.confirm(`Remove the card ending ${method.last4}?`)) run(() => userApi.removePaymentMethod(method._id)); }} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Payment History</h2>
        {!allInvoices.length ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">{invoices.loading ? "Loading…" : "No payments yet. Invoices from checkout appear here."}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {["Description", "Amount", "Date", "Status"].map((heading) => <th key={heading} className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{heading}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allInvoices.map((invoice) => (
                  <tr key={invoice._id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Invoice {invoice.number}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${invoice.status === "refunded" ? "text-green-600" : "text-gray-900"}`}>{invoice.status === "refunded" ? "+" : ""}{formatMoney(invoice.total)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.createdAt)}</td>
                    <td className="px-6 py-4"><span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${invoice.status === "paid" ? "bg-green-50 text-green-700" : invoice.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{invoice.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
