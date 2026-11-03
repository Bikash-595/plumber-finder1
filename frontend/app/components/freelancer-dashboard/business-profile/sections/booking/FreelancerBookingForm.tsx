"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import TimeSlotsEditor from "@/components/company-dashboard/business-profile/booking/TimeSlotsEditor";
import { bookingConfig as config } from "./config";

/** Booking Settings: the visit times customers can choose, plus instant booking, approval, emergencies and cancellation policy. */
export default function FreelancerBookingForm() {
  return (
    <div className="space-y-6">
      <TimeSlotsEditor apiEndpoint="/freelancers/booking" />
      <SectionForm {...config} />
    </div>
  );
}
