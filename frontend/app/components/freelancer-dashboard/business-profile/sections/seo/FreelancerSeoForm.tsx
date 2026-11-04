"use client";

import SeoEditor from "@/components/company-dashboard/business-profile/seo/SeoEditor";

/** SEO & keywords: search title and description, keywords, and the profile sidebar card (/api/freelancers/seo). */
export default function FreelancerSeoForm() {
  return <SeoEditor apiEndpoint="/freelancers/seo" />;
}
