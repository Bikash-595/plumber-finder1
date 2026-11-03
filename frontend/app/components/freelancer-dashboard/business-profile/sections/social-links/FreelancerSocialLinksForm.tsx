"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import { socialExamples, socialFields } from "@/components/company-dashboard/business-profile/forms/BusinessProfileForms";

/** Social links: icons on your public profile (/api/freelancers/social-links). */
export default function FreelancerSocialLinksForm() {
  return <SectionForm section="freelancer-social-links" apiEndpoint="/freelancers/social-links" title="Social Links" description="Add your social media pages. They appear as icons on your public profile." defaults={socialExamples} fields={socialFields} />;
}
