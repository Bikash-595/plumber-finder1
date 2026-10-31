import { Suspense } from "react";
import BookingsView from "@/components/dashboard/bookings/BookingsView";

export default function BookingsPage() {
  return <Suspense><BookingsView /></Suspense>;
}
