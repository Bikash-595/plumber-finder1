"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import { verificationConfig as config } from "./config";

/** Documents & Verification: private links to your licence and insurance, for verification. Never shown on your profile. */
export default function FreelancerVerificationForm() {
  return <SectionForm {...config} />;
}
