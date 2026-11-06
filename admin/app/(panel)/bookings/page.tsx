"use client";

import { Suspense } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import BookingsManager from "@/components/bookings/BookingsManager";

export default function AdminBookingsPage() {
  return (
    <AdminSectionPage title="Bookings" description="Every customer booking request and checkout order on the platform.">
      <Suspense fallback={null}><BookingsManager /></Suspense>
    </AdminSectionPage>
  );
}
