"use client";

import OpeningHoursForm from "@/components/company-dashboard/business-profile/OpeningHoursForm";

/** The freelancer's working week, saved to /api/freelancers/opening-hours and shown on the public profile. */
export default function FreelancerOpeningHoursForm() {
  return <OpeningHoursForm apiEndpoint="/freelancers/opening-hours" />;
}
