"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCheckCircle, FaCopy, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";

export default function SpecialOfferCard({ plumber }: { plumber: Plumber }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!plumber.promoCode) return;
    await navigator.clipboard?.writeText(plumber.promoCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">Limited-time special offer</p>
        <h2 className="mt-1 text-2xl font-extrabold">{plumber.discount}</h2>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{plumber.companyName}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><FaMapMarkerAlt className="text-emerald-600" /> {plumber.location}</p>
          </div>
          {plumber.isVerified && <FaCheckCircle aria-label="Verified" className="mt-1 text-lg text-emerald-600" />}
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{plumber.description}</p>
        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-700">
          <FaStar className="text-amber-400" /> {plumber.rating.toFixed(1)} <span className="font-normal text-slate-400">({plumber.reviewCount} reviews)</span>
        </div>

        {plumber.promoCode && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-3 py-2.5">
            <span className="text-sm font-bold tracking-wide text-emerald-800">{plumber.promoCode}</span>
            <button type="button" onClick={copyCode} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950">
              <FaCopy /> {copied ? "Copied" : "Copy code"}
            </button>
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <Link href={`/book-plumber?plumber=${plumber.id}&offer=${plumber.promoCode ?? ""}`} className="flex-1 rounded-full bg-[#FFD60A] px-4 py-2.5 text-center text-sm font-bold text-slate-900 transition hover:brightness-105">
            Claim & book
          </Link>
          <Link href={`/plumber/${plumber.id}`} className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
