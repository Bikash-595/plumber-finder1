"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import { mapsConfig as config } from "./config";

/** Google Maps: where you're based, your map pin and how far you travel. */
export default function FreelancerMapsForm() {
  return <SectionForm {...config} />;
}
