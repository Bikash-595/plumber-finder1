"use client";

import { useState } from "react";
import { FaCheck, FaCopy, FaGift } from "react-icons/fa";
import type { Plumber, PlumberOffer } from "@/components/find/types";

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/**
 * Special offers on the profile: every current offer with each of its coupon codes and the discount
 * that code gives (copy button per code). Demo plumbers have a single discount and code.
 */
export default function DiscountCard({ plumber }: { plumber: Plumber }) {
  const [copied, setCopied] = useState<string | null>(null);
  const offers: PlumberOffer[] = plumber.offers?.length
    ? plumber.offers
    : plumber.discount ? [{ id: "demo", title: "Special Offer", description: "*Valid for first-time customers only. Cannot be combined with other offers.", coupons: [{ code: plumber.promoCode ?? "", discount: plumber.discount }] }] : [];
  if (!offers.length) return null;

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((current) => (current === code ? null : current)), 2000);
    } catch {
      // Clipboard blocked: the code is still visible to type in.
    }
  };

  return (
    <section className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm sm:p-5" aria-labelledby="offers-heading">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-green-100 p-2 text-green-700"><FaGift className="h-5 w-5" aria-hidden /></div>
        <h3 id="offers-heading" className="font-bold text-gray-900">{offers.length > 1 ? `Special Offers (${offers.length})` : "Special Offer"}</h3>
      </div>
      <div className="mt-3 space-y-4">
        {offers.map((offer) => (
          <div key={offer.id} className="space-y-2">
            {(offers.length > 1 || offer.id !== "demo") && <p className="text-sm font-semibold text-gray-900">{offer.title}</p>}
            {offer.description && offer.id !== "demo" && <p className="text-xs text-gray-600">{offer.description}</p>}
            <ul className="space-y-2">
              {offer.coupons.map((coupon, index) => (
                <li key={`${coupon.code}-${index}`} className="rounded-xl border border-green-200 bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-green-700">{coupon.discount}{coupon.appliesTo && <span className="font-medium text-gray-600"> on {coupon.appliesTo}</span>}</p>
                    {coupon.code ? (
                      <div className="flex items-center gap-2">
                        <code className="rounded-md border border-dashed border-green-400 bg-green-50 px-2 py-0.5 font-mono text-sm font-bold tracking-wide text-green-800">{coupon.code}</code>
                        <button type="button" onClick={() => copy(coupon.code)} aria-label={`Copy code ${coupon.code}`} className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-900">
                          {copied === coupon.code ? <><FaCheck className="h-3 w-3" aria-hidden /> Copied</> : <><FaCopy className="h-3 w-3" aria-hidden /> Copy</>}
                        </button>
                      </div>
                    ) : <span className="text-xs text-gray-500">No code needed</span>}
                  </div>
                  {(coupon.minSpend || coupon.terms) && <p className="mt-1 text-xs text-gray-500">{[coupon.minSpend ? `Min. spend $${coupon.minSpend}` : "", coupon.terms].filter(Boolean).join(" · ")}</p>}
                </li>
              ))}
            </ul>
            {offer.endDate && <p className="text-xs text-gray-500">Valid until {formatDate(offer.endDate)}</p>}
            {offer.id === "demo" && offer.description && <p className="text-xs text-gray-500">{offer.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
