"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileHeader from "@/components/plumber/ProfileHeader";
import ProfileStats from "@/components/plumber/ProfileStats";
import ProfileAbout from "@/components/plumber/ProfileAbout";
import ProfileServices from "@/components/plumber/ProfileServices";
import ProfileHours from "@/components/plumber/ProfileHours";
import ProfileTeam from "@/components/plumber/ProfileTeam";
import MediaGallery from "@/components/plumber/MediaGallery";
import ProfilePreviousProjects from "@/components/plumber/ProfilePreviousProjects";
import ProfileFaq from "@/components/plumber/ProfileFaq";
import ProfileReviews from "@/components/plumber/ProfileReviews";
import ProfileMap from "@/components/plumber/ProfileMap";
import ProfileBlogSection from "@/components/plumber/ProfileBlogSection";
import DiscountCard from "@/components/plumber/DiscountCard";
import BookingWidget from "@/components/plumber/BookingWidget";
import { fetchLiveProfile } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { useOwnListing } from "@/components/company-dashboard/business-profile/useOwnListing";

/** The company's own public profile, rendered with the same components customers see. */
export default function Page() {
  const listing = useOwnListing();
  const [plumber, setPlumber] = useState<Plumber | null | undefined>(undefined);

  useEffect(() => {
    if (!listing) return;
    fetchLiveProfile(listing.slug).then(setPlumber);
  }, [listing]);

  if (listing === undefined || (listing && plumber === undefined)) return <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Loading your profile preview…</p>;
  if (!listing || !plumber) {
    return <p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-600">{listing && !listing.isPublished ? "Your listing is hidden by an admin, so there is nothing to preview." : <>Your profile has no public page yet. <Link href="/company-dashboard/business-profile/header-profile" className="font-bold text-[#0b1f3b] underline">Save your Company Profile</Link> to create one.</>}</p>;
  }
  return <section>
    <div className="mb-5 rounded-xl border border-[#FFD60A]/40 bg-[#FFD60A]/10 p-4 text-sm text-[#0b1f3b]">This is exactly what customers see at <Link href={`/company/${listing.slug}`} target="_blank" className="font-bold underline">/company/{listing.slug}</Link>.</div>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="min-w-0 space-y-6 lg:col-span-2"><ProfileHeader plumber={plumber} /><ProfileStats plumber={plumber} /><ProfileAbout plumber={plumber} /><ProfileServices plumber={plumber} /><ProfileHours plumber={plumber} /><ProfileTeam plumber={plumber} />{plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && <MediaGallery images={plumber.media.images} videos={plumber.media.videos} />}{plumber.projects.length > 0 && <ProfilePreviousProjects plumber={plumber} />}<ProfileFaq plumber={plumber} /><ProfileReviews plumber={plumber} /><ProfileMap plumber={plumber} /><ProfileBlogSection plumber={plumber} /></div>
      <aside className="min-w-0 space-y-6"><DiscountCard plumber={plumber} /><BookingWidget plumber={plumber} /></aside>
    </div>
  </section>;
}
