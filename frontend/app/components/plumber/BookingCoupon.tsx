"use client";

import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaTag, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "@/components/utils/apiClient";
import type { Plumber } from "@/components/find/types";

type Price = { base: number | null; label: string | null; discount: number; total: number | null; hourly?: boolean; from?: boolean };
type Coupon = { code: string; label?: string; discountType?: string; discountValue?: number | null; appliesTo?: string; minSpend?: number; appliesToFinalPrice?: boolean; unchecked?: boolean };
type Quote = { price: Price; coupon: Coupon | null };

const money = (value: number) => `$${value.toFixed(2).replace(/\.00$/, "")}`;
const isLive = (id: string) => /^[a-f0-9]{24}$/.test(id);

async function fetchQuote(plumber: Plumber, service: string, couponCode?: string): Promise<{ quote?: Quote; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/booking-quote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ providerType: plumber.providerType ?? "company", providerId: plumber.id, service, couponCode }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return { error: payload.message || "That code can't be used." };
    return { quote: payload.data };
  } catch {
    return { error: "Can't check the code right now. Please try again." };
  }
}

/** Sample plumbers: their one code ("NYPLUMB15") and its discount ("15% off first service") from the demo data. */
function demoQuote(plumber: Plumber, code: string): { quote?: Quote; error?: string } {
  if (!plumber.promoCode || plumber.promoCode.toUpperCase() !== code) return { error: `${code} isn't a valid code for ${plumber.companyName}.` };
  const percent = plumber.discount?.match(/(\d+(?:\.\d+)?)\s*%/);
  return { quote: { price: { base: null, label: null, discount: 0, total: null }, coupon: { code: plumber.promoCode, label: percent ? `${percent[1]}% off` : plumber.discount, appliesToFinalPrice: Boolean(percent) } } };
}

/**
 * Coupon code for the booking form: enter a code (or tap one of the plumber's), see the discount taken off
 * the service's price, and pass the applied code up. The server checks the code again when the booking is sent.
 */
export default function BookingCoupon({ plumber, service, onApplied }: { plumber: Plumber; service: string; onApplied: (code: string | null) => void }) {
  const [input, setInput] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const live = isLive(plumber.id);
  const available = live
    ? (plumber.offers ?? []).flatMap((offer) => offer.coupons.filter((coupon) => coupon.code).map((coupon) => ({ code: coupon.code, label: coupon.discount, appliesTo: coupon.appliesTo })))
    : plumber.promoCode ? [{ code: plumber.promoCode, label: plumber.discount ?? "", appliesTo: undefined }] : [];

  const setCode = useCallback((code: string | null) => { setApplied(code); onApplied(code); }, [onApplied]);

  const apply = useCallback(async (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!code) return;
    setBusy(true);
    setError("");
    const result = live ? await fetchQuote(plumber, service, code) : demoQuote(plumber, code);
    setBusy(false);
    if (result.error || !result.quote) { setError(result.error ?? "That code can't be used."); return; }
    setQuote(result.quote);
    setInput(code);
    setCode(code);
  }, [live, plumber, service, setCode]);

  // The service's price (and the applied code, which may not suit the new service) when the service changes.
  useEffect(() => {
    if (!live || !service) {
      if (applied) return;
      const timer = window.setTimeout(() => setQuote(null), 0);
      return () => window.clearTimeout(timer);
    }
    let current = true;
    fetchQuote(plumber, service, applied ?? undefined).then(async (result) => {
      if (!current) return;
      if (result.error && applied) {
        setError(result.error);
        setCode(null);
        const plain = await fetchQuote(plumber, service);
        if (current) setQuote(plain.quote ?? null);
      } else setQuote(result.quote ?? null);
    });
    return () => { current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-price when the service changes; `applied` changes go through apply()
  }, [service, live, plumber.id]);

  // "Use code" on the Special Offer card.
  useEffect(() => {
    const use = (event: Event) => { const code = (event as CustomEvent<string>).detail; setInput(code); apply(code); };
    window.addEventListener("plumberfinder:apply-coupon", use);
    return () => window.removeEventListener("plumberfinder:apply-coupon", use);
  }, [apply]);

  const remove = () => {
    setCode(null);
    setInput("");
    setError("");
    if (live && service) fetchQuote(plumber, service).then((result) => setQuote(result.quote ?? null));
    else setQuote(null);
  };

  const price = quote?.price;
  const coupon = applied ? quote?.coupon : null;
  const unit = price?.hourly ? "/hr" : "";

  return (
    <div className="space-y-2">
      <label htmlFor="booking-coupon" className="block text-sm font-medium text-gray-700">Discount or coupon code</label>
      {applied ? (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm">
          <span className="inline-flex min-w-0 items-center gap-2 font-semibold text-emerald-800"><FaCheckCircle className="h-4 w-4 shrink-0" aria-hidden /> <span className="truncate"><span className="font-mono">{applied}</span> applied{coupon?.label ? ` — ${coupon.label}` : ""}</span></span>
          <button type="button" onClick={remove} aria-label="Remove coupon" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-emerald-800 hover:bg-emerald-100"><FaTimes className="h-3 w-3" /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
            <input id="booking-coupon" value={input} onChange={(e) => { setInput(e.target.value.toUpperCase().replace(/\s+/g, "")); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(input); } }} maxLength={40} placeholder="e.g. SAVE15" autoComplete="off"
              className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-3 font-mono uppercase text-gray-900 placeholder:font-sans placeholder:normal-case placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]" />
          </div>
          <button type="button" onClick={() => apply(input)} disabled={!input.trim() || busy} className="shrink-0 rounded-full bg-[#0b1f3b] px-4 text-sm font-bold text-white transition hover:bg-[#17345a] disabled:opacity-40">{busy ? "…" : "Apply"}</button>
        </div>
      )}
      {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}
      {!applied && available.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-gray-500">Available:</span>
          {available.slice(0, 4).map((item) => (
            <button key={item.code} type="button" onClick={() => { setInput(item.code); apply(item.code); }} title={item.appliesTo ? `${item.label} on ${item.appliesTo}` : item.label} className="rounded-full border border-dashed border-green-400 bg-green-50 px-2 py-0.5 font-mono font-bold text-green-800 hover:bg-green-100">{item.code}</button>
          ))}
        </div>
      )}

      {/* Price breakdown */}
      {(price?.base != null || coupon) && (
        <dl className="space-y-1 rounded-2xl bg-gray-50 p-3 text-sm" aria-live="polite">
          {price?.base != null ? (
            <>
              <div className="flex justify-between gap-2"><dt className="text-gray-600">Service price{price.from ? " (from)" : ""}</dt><dd className="font-semibold text-gray-900">{money(price.base)}{unit}</dd></div>
              {coupon && price.discount > 0 && <div className="flex justify-between gap-2 text-emerald-700"><dt>Coupon {coupon.code} ({coupon.label})</dt><dd className="font-semibold">−{money(price.discount)}{unit}</dd></div>}
              {coupon && price.discount === 0 && coupon.label && <div className="flex justify-between gap-2 text-emerald-700"><dt>Coupon {coupon.code}</dt><dd className="font-semibold">{coupon.label}</dd></div>}
              <div className="flex justify-between gap-2 border-t border-gray-200 pt-1.5"><dt className="font-bold text-gray-900">Total{price.from ? " (from)" : ""}</dt><dd className="text-lg font-extrabold text-gray-900">{money(price.total ?? price.base)}{unit}</dd></div>
              {coupon && price.discount > 0 && <p className="text-xs font-semibold text-emerald-700">You save {money(price.discount)}{unit}.</p>}
            </>
          ) : coupon && (
            <p className="text-gray-700">{coupon.appliesToFinalPrice ? <><span className="font-semibold text-emerald-700">{coupon.label}</span> will be taken off the final price {plumber.companyName} gives you.</> : <>Coupon <span className="font-mono font-semibold">{coupon.code}</span>: {coupon.label}</>}</p>
          )}
        </dl>
      )}
    </div>
  );
}
