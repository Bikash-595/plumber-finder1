"use client";

import { FaStar } from "react-icons/fa";
import { userApi, type MyReview } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { usePagedList } from "../useUserData";
import EmptyState from "../ui/EmptyState";
import LoadMore from "../ui/LoadMore";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import { SkeletonRows } from "../ui/Skeleton";
import MyReviewCard from "./MyReviewCard";

/** /dashboard/reviews — every review the customer has written, newest first, one page at a time. */
export default function MyReviewsView() {
  const list = usePagedList<MyReview>("my-reviews", (cursor) => userApi.myReviews({ cursor }));
  if (!list.signedIn) return <SignInPrompt what="your reviews" />;

  return (
    <div className="space-y-6">
      <PageHeader icon={FaStar} title="My Reviews" description="Reviews you've written, their status, and replies from plumbers." />
      <Notice>{list.error}</Notice>
      {list.loading ? <SkeletonRows rows={2} className="h-48" /> : list.items.length === 0 ? (
        <EmptyState icon={FaStar} title="No reviews yet" text="After a job, leave a review on the plumber's profile to help other customers." action={{ label: "See your bookings", href: "/dashboard/bookings" }} />
      ) : (
        <div className="space-y-4">
          {list.items.map((review) => <MyReviewCard key={review._id} review={review} />)}
          <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} shown={list.items.length} noun="reviews" />
        </div>
      )}
    </div>
  );
}
