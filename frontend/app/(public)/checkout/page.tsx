// app/checkout/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt, FaShoppingCart, FaCcVisa, FaCcMastercard, FaPaypal, FaLock, FaCheckCircle } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatMoney, userApi, type Cart, type Invoice } from "@/components/utils/userApi";
import SavedAddressPicker from "@/components/dashboard/profile/SavedAddressPicker";

export default function CartPage() {
  const { signedIn, data: cart, setData: setCart, error, setError, loading } = useUserData(userApi.cart);
  const [promoCode, setPromoCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [details, setDetails] = useState({ address: "", phone: "", scheduledDate: "", timeSlot: "", details: "" });
  const [placed, setPlaced] = useState<Invoice | null>(null);

  // Every cart call returns the whole cart with server-calculated totals.
  const run = async (action: () => Promise<{ data: Cart }>) => {
    setBusy(true);
    setError("");
    try {
      setCart((await action()).data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const checkout = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await userApi.checkout({ ...details, scheduledDate: details.scheduledDate || undefined });
      setPlaced(data.invoice);
      setCart({ items: [], summary: { ...cart!.summary, itemCount: 0, subtotal: 0, discount: 0, tax: 0, total: 0, promoCode: null, discountPercent: 0 } });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!signedIn) {
    return <main className="min-h-screen bg-gray-50 px-4 py-12"><SignInPrompt what="your cart" /></main>;
  }

  if (placed) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <FaCheckCircle className="mx-auto h-12 w-12 text-emerald-500" aria-hidden />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Order placed</h1>
          <p className="mt-2 text-gray-600">Invoice <span className="font-semibold text-gray-900">{placed.number}</span> for {formatMoney(placed.total)} was created and your booking requests were sent to the plumbers.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/bookings" className="rounded-full bg-[#0b1f3b] px-5 py-2.5 text-sm font-semibold text-white">View bookings</Link>
            <Link href="/dashboard/invoices" className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800">View invoice</Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading || !cart) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-500">{error || "Loading cart..."}</div>
      </main>
    );
  }

  const { items, summary } = cart;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}

        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <FaShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-gray-500">Your cart is empty.</p>
            <Link
              href="/find"
              className="mt-4 inline-block rounded-full bg-[#FFD60A] px-6 py-2 text-sm font-semibold text-[#0b1f3b] transition hover:brightness-105"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image src={item.image || "/Plumber.png"} alt="" fill className="object-cover" sizes="80px" unoptimized={!item.image?.startsWith("/")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900">{item.name}</h3>
                    <p className="truncate text-sm text-gray-500">{item.providerName} · {formatMoney(item.price)} each</p>
                    <div className="mt-1 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={busy || item.quantity <= 1}
                        onClick={() => run(() => userApi.setCartQuantity(item._id, item.quantity - 1))}
                        className="rounded-full border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={busy || item.quantity >= 20}
                        onClick={() => run(() => userApi.setCartQuantity(item._id, item.quantity + 1))}
                        className="rounded-full border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatMoney(item.price * item.quantity)}</div>
                    <button type="button" aria-label={`Remove ${item.name}`} disabled={busy} onClick={() => run(() => userApi.removeFromCart(item._id))} className="mt-1 text-red-500 hover:text-red-700">
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>
              <div className="space-y-2 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({summary.itemCount} {summary.itemCount === 1 ? "item" : "items"})</span>
                  <span>{formatMoney(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({summary.promoCode}, {summary.discountPercent}%)</span>
                    <span>-{formatMoney(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({Math.round(summary.taxRate * 100)}%)</span>
                  <span>{formatMoney(summary.tax)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{formatMoney(summary.total)}</span>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <label htmlFor="promo" className="block text-sm font-medium text-gray-700">Promo Code</label>
                {summary.promoCode ? (
                  <p className="mt-1 flex items-center justify-between rounded-full bg-green-50 px-4 py-2 text-sm text-green-700">
                    {summary.promoCode} applied
                    <button type="button" disabled={busy} onClick={() => run(userApi.removePromo)} className="text-xs font-semibold underline">Remove</button>
                  </p>
                ) : (
                  <form className="mt-1 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (promoCode.trim()) run(() => userApi.applyPromo(promoCode.trim())); }}>
                    <input
                      id="promo"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                    />
                    <button type="submit" disabled={busy} className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300">Apply</button>
                  </form>
                )}
              </div>

              {checkoutOpen ? (
                <form onSubmit={checkout} className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                  <h3 className="font-semibold text-gray-900">Service details</h3>
                  <input required value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} placeholder="Service address *" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#FFD60A] focus:outline-none" />
                  <input value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} placeholder="Phone" type="tel" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#FFD60A] focus:outline-none" />
                  <SavedAddressPicker currentAddress={details.address} currentPhone={details.phone} onPhone={(phone) => setDetails((current) => ({ ...current, phone }))}
                    onAddress={(address, saved) => setDetails((current) => ({ ...current, address, details: current.details.trim() || !saved.accessNotes ? current.details : `Access notes: ${saved.accessNotes}` }))} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={details.scheduledDate} onChange={(e) => setDetails({ ...details, scheduledDate: e.target.value })} type="date" aria-label="Preferred date" className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#FFD60A] focus:outline-none" />
                    <select value={details.timeSlot} onChange={(e) => setDetails({ ...details, timeSlot: e.target.value })} aria-label="Preferred time" className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#FFD60A] focus:outline-none">
                      <option value="">Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option>
                    </select>
                  </div>
                  <textarea value={details.details} onChange={(e) => setDetails({ ...details, details: e.target.value })} rows={2} placeholder="Notes for the plumber" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#FFD60A] focus:outline-none" />
                  <button type="submit" disabled={busy} className="w-full rounded-full bg-[#FFD60A] py-3 font-semibold text-[#0b1f3b] shadow-md transition hover:brightness-105 disabled:opacity-60">
                    {busy ? "Placing order…" : `Place order · ${formatMoney(summary.total)}`}
                  </button>
                  <p className="text-center text-xs text-gray-500">No card is charged now — you will receive an invoice.</p>
                </form>
              ) : (
                <>
                  {/* Payment Methods */}
                  <div className="mt-6 flex justify-center gap-4 text-gray-400">
                    <FaCcVisa className="h-8 w-8" />
                    <FaCcMastercard className="h-8 w-8" />
                    <FaPaypal className="h-8 w-8" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(true)}
                    className="mt-6 w-full rounded-full bg-[#FFD60A] py-3 font-semibold text-[#0b1f3b] shadow-md transition hover:brightness-105"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
                <FaLock className="h-3 w-3" />
                Secure checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
