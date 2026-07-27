"use client";

import { Plumber } from "@/components/find/types";
import { FaGift, FaCopy } from "react-icons/fa";
import { useState } from "react";

export default function DiscountCard({ plumber }: { plumber: Plumber }) {
  const [copied, setCopied] = useState(false);

  if (!plumber.discount) return null;

  const copyPromoCode = () => {
    if (plumber.promoCode) {
      navigator.clipboard.writeText(plumber.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-green-100 p-2 text-green-700">
          <FaGift className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">Special Offer</h3>
          <p className="mt-1 text-sm text-gray-700">{plumber.discount}</p>
          {plumber.promoCode && (
            <div className="mt-2 flex items-center gap-2">
              <code className="rounded-md bg-white px-2 py-1 text-sm font-mono text-green-700 border border-green-300">
                {plumber.promoCode}
              </code>
              <button
                onClick={copyPromoCode}
                className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition"
              >
                <FaCopy className="h-3 w-3" />
                {copied ? "Copied!" : "Copy code"}
              </button>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">*Valid for first-time customers only. Cannot be combined with other offers.</p>
        </div>
      </div>
    </div>
  );
}
