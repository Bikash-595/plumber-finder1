"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOwnListing } from "./useOwnListing";

/** Shows the company where its public page lives (/company/<slug>), or how to create it. */
export default function PublicPageLink() {
  // Re-read on navigation so a newly saved Company Profile shows its link.
  const pathname = usePathname();
  return <PublicPageLinkInner key={pathname} />;
}

function PublicPageLinkInner() {
  const listing = useOwnListing();
  if (listing === undefined) return null;
  if (!listing) {
    return <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600">You don&apos;t have a public page yet. <Link href="/company-dashboard/business-profile/header-profile" className="font-bold text-[#0b1f3b] underline">Save your Company Profile</Link> to create it.</p>;
  }
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="min-w-0 text-gray-700">Your public page: <span className="break-all font-semibold text-[#0b1f3b]">/company/{listing.slug}</span>{!listing.isPublished && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">Hidden by an admin</span>}</p>
      <Link href={`/company/${listing.slug}`} target="_blank" className="shrink-0 rounded-lg bg-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17345a]">View public page</Link>
    </div>
  );
}
