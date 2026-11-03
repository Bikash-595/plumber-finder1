"use client";

import ServicesEditor from "@/components/company-dashboard/business-profile/ServicesEditor";

/** Services & pricing: price, photos, videos, what's included and each service's own page (/api/freelancers/services). */
export default function FreelancerServicesForm() {
  return <ServicesEditor apiEndpoint="/freelancers/services" />;
}
