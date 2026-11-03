"use client";

import SpecialOffersEditor from "@/components/company-dashboard/business-profile/SpecialOffersEditor";

/** Special offers: discounts with coupon codes customers use when booking (/api/freelancers/special-offers). */
export default function FreelancerOffersForm() {
  return <SpecialOffersEditor apiEndpoint="/freelancers/special-offers" servicesEndpoint="/freelancers/services" />;
}
