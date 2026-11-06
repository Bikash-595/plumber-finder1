"use client";

import { Suspense } from "react";
import BookPlumberPageContent from "@/components/booking/book-plumber-page/BookPlumberPageContent";
import BookingPageFallback from "@/components/booking/book-plumber-page/BookingPageFallback";

export default function BookPlumberPage() {
  return (
    <Suspense fallback={<BookingPageFallback />}>
      <BookPlumberPageContent />
    </Suspense>
  );
}
