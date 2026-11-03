"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import { overviewConfig as config } from "./config";

/** Overview: experience, specialties, languages and response time (the facts under your name on your profile). */
export default function FreelancerOverviewForm() {
  return <SectionForm {...config} />;
}
