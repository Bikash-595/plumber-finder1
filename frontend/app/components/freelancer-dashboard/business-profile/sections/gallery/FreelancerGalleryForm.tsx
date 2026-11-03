"use client";

import CollectionForm from "@/components/company-dashboard/business-profile/CollectionForm";
import { galleryConfig as config } from "./config";

/** Work Gallery: photos and videos of your work, shown in the gallery on your profile. */
export default function FreelancerGalleryForm() {
  return <CollectionForm {...config} />;
}
