"use client";

import { useSearchParams } from "next/navigation";
import BookingsViewContent from "@/components/dashboard/bookings/bookings-view/BookingsViewContent";

/** /dashboard/bookings — every booking, filtered by status and searchable, loaded one page at a time. */
export default function BookingsView() {
  // Remount when the navbar search sends a new ?q=, so the list starts from that search.
  const initialSearch = useSearchParams().get("q") ?? "";
  return <BookingsViewContent key={initialSearch} initialSearch={initialSearch} />;
}
