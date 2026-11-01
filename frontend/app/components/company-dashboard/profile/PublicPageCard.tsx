"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCheck, FaCopy, FaExternalLinkAlt, FaEyeSlash, FaGlobe } from "react-icons/fa";
import UserAvatar from "@/components/UserAvatar";
import type { ListingSummary } from "../companyApi";

/** The public listing: logo, name, live/hidden status, and the link to share. */
export default function PublicPageCard({ listing }: { listing: ListingSummary | null }) {
  const [copied, setCopied] = useState(false);
  if (!listing) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <FaGlobe className="mx-auto h-6 w-6 text-gray-400" />
        <p className="mt-2 font-semibold text-gray-900">No public listing yet</p>
        <p className="text-sm text-gray-500">Fill in your company profile to appear in the PlumberFinder directory.</p>
        <Link href="/company-dashboard/business-profile/header-profile" className="mt-4 inline-block rounded-full bg-[#FFD60A] px-5 py-2 text-sm font-bold text-[#0b1f3b]">Start your profile</Link>
      </section>
    );
  }
  const path = `/company/${listing.slug}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}${path}`); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      {listing.logo
        // eslint-disable-next-line @next/next/no-img-element -- logos are uploads (data URLs) or any allowed host
        ? <img src={listing.logo} alt="" className="h-16 w-16 shrink-0 rounded-2xl border border-gray-100 object-cover" />
        : <UserAvatar name={listing.name} size={64} className="!rounded-2xl" />}
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-lg font-bold text-gray-900">{listing.name}
          {listing.published ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</span> : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600"><FaEyeSlash className="h-3 w-3" />Hidden</span>}
        </p>
        <p className="truncate font-mono text-sm text-gray-500">plumberfinder{path}</p>
        {(listing.city || listing.state) && <p className="text-xs text-gray-500">{[listing.city, listing.state].filter(Boolean).join(", ")}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">{copied ? <FaCheck className="h-3 w-3 text-emerald-600" /> : <FaCopy className="h-3 w-3" />}{copied ? "Copied" : "Copy link"}</button>
        <a href={path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17345a]">View <FaExternalLinkAlt className="h-3 w-3" /></a>
      </div>
    </section>
  );
}
