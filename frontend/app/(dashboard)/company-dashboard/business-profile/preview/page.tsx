"use client";

import ProfileHeader from "@/components/plumber/ProfileHeader";
import ProfileStats from "@/components/plumber/ProfileStats";
import ProfileServices from "@/components/plumber/ProfileServices";
import MediaGallery from "@/components/plumber/MediaGallery";
import ProfilePreviousProjects from "@/components/plumber/ProfilePreviousProjects";
import ProfileFaq from "@/components/plumber/ProfileFaq";
import ProfileReviews from "@/components/plumber/ProfileReviews";
import ProfileMap from "@/components/plumber/ProfileMap";
import ProfileBlogSection from "@/components/plumber/ProfileBlogSection";
import DiscountCard from "@/components/plumber/DiscountCard";
import BookingWidget from "@/components/plumber/BookingWidget";
import { plumbers } from "@/data/plumbers";

export default function Page() {
  const plumber = plumbers.find((item) => item.id === "8") ?? plumbers[0];
  if (!plumber) return <p className="text-sm text-gray-500">Company profile data is unavailable.</p>;
  return <section><div className="mb-5 rounded-xl border border-[#FFD60A]/40 bg-[#FFD60A]/10 p-4 text-sm text-[#0b1f3b]">Customer-facing preview using the same real company profile components and Dallas Rapid Plumbers data.</div><div className="grid gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-2"><ProfileHeader plumber={plumber} /><ProfileStats plumber={plumber} /><ProfileServices plumber={plumber} /><MediaGallery images={plumber.media?.images ?? []} videos={plumber.media?.videos ?? []} /><ProfilePreviousProjects plumber={plumber} /><ProfileFaq plumber={plumber} /><ProfileReviews /><ProfileMap plumber={plumber} /><ProfileBlogSection plumber={plumber} /></div><aside className="space-y-6"><BookingWidget plumber={plumber} /><DiscountCard plumber={plumber} /></aside></div></section>;
}
