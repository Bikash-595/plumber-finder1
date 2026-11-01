"use client";

import ProviderReviewManager from "@/components/reviews/manage/ProviderReviewManager";
import GoogleConnectionCard from "./GoogleConnectionCard";

/** Company dashboard → Reviews & Ratings: Google + PlumberFinder directory + verified customer reviews. */
export default function CompanyReviews() {
  return (
    <ProviderReviewManager base="/companies" aside={<GoogleConnectionCard />}
      intro="Your Google reviews and the reviews customers write on PlumberFinder — directory reviews and Verified Booking reviews after completed jobs. Reply publicly and report reviews that break the rules; ratings and review text can't be changed." />
  );
}
