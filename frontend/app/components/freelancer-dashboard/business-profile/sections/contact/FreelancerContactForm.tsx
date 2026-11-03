"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import { contactConfig as config } from "./config";

/** Contact Information: phones, WhatsApp, an emergency line, email and website. The main phone is copied to your public listing. */
export default function FreelancerContactForm() {
  return <SectionForm {...config} />;
}
