"use client";

import type { Plumber } from "@/components/find/types";
import ReviewSection from "@/components/reviews/ReviewSection";

/** The Reviews section of a plumber's profile (see components/reviews/ReviewSection). */
export default function ProfileReviews({ plumber }: { plumber: Plumber }) {
  return <ReviewSection plumber={plumber} />;
}
