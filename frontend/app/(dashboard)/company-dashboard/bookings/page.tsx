import { Suspense } from "react";
import ProviderBookings from "@/components/bookings/ProviderBookings";

/** Booking requests customers sent to this company: accept, decline, complete. */
export default function CompanyBookingsPage() {
  return <Suspense fallback={null}><ProviderBookings base="/companies" /></Suspense>;
}
