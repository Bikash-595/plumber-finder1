"use client";

import ProviderReviewManager from "@/components/reviews/manage/ProviderReviewManager";

/** Freelancer dashboard → Reviews & Ratings: PlumberFinder directory and verified customer reviews (no Google). */
export default function FreelancerReviews() {
  return (
    <ProviderReviewManager base="/freelancers"
      intro="Reviews customers write about you on PlumberFinder: directory reviews, and Verified Booking reviews after jobs you complete. Reply publicly and report reviews that break the rules; ratings and review text can't be changed." />
  );
}
