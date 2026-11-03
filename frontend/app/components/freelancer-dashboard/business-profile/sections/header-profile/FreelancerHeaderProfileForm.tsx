"use client";

import SectionForm from "@/components/company-dashboard/business-profile/SectionForm";
import FreelancerDeleteListing from "./FreelancerDeleteListing";
import { headerProfileConfig as config } from "./config";

/** Your Profile: the top of the public profile, and removing the listing. */
export default function FreelancerHeaderProfileForm() {
  return (
    <>
      <SectionForm {...config} />
      <FreelancerDeleteListing />
    </>
  );
}
