"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import { bookingConfig as config } from "./config";

/** Booking Settings: how customers can book you: instant booking, approval, emergencies, working days and cancellation policy. */
export default function FreelancerBookingForm() {
  return <SectionForm {...config} />;
}
