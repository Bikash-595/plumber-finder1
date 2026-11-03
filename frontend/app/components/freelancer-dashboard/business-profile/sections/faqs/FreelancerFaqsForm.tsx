"use client";

import CollectionForm from "@/components/company-dashboard/business-profile/CollectionForm";
import { faqsConfig as config } from "./config";

/** Frequently Asked Questions: questions and answers shown on your profile. */
export default function FreelancerFaqsForm() {
  return <CollectionForm {...config} />;
}
