import { Suspense } from "react";
import ProviderBookings from "@/components/bookings/ProviderBookings";

/** Booking requests customers sent to this freelancer: accept, decline, complete. */
export default function FreelancerBookingsPage() {
  return <Suspense fallback={null}><ProviderBookings base="/freelancers" /></Suspense>;
}
