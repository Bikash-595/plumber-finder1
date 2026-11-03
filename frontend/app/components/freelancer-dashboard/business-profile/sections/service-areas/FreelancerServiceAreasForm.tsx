"use client";

import ServiceAreasEditor from "@/components/company-dashboard/business-profile/ServiceAreasForm";

/** Service areas: the places you cover and which services you offer in each (/api/freelancers/service-areas). */
export default function FreelancerServiceAreasForm() {
  return <ServiceAreasEditor apiEndpoint="/freelancers/service-areas" servicesEndpoint="/freelancers/services" />;
}
