"use client";

import AdminSectionPage from "@/components/AdminSectionPage";
import ReviewsManager from "@/components/reviews/ReviewsManager";

export default function AdminReviewsPage() {
  return (
    <AdminSectionPage title="Reviews" description="Moderate PlumberFinder reviews (directory and verified bookings): approve held reviews, hide or reject ones that break the rules, and see each review's full history.">
      <ReviewsManager />
    </AdminSectionPage>
  );
}
