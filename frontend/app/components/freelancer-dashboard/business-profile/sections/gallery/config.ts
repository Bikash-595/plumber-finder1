import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// Photos and videos of your work, shown in the gallery on your profile.
// Saved to /api/freelancers/gallery.
export const galleryConfig = {
  section: "freelancer-gallery",
  apiEndpoint: "/freelancers/gallery",
  title: "Work Gallery",
  description: "Add photos or videos of your work.",
  itemName: "Media item",
  fields: [
    { name: "type", label: "Media type" },
    { name: "media", label: "Image or Video", type: "media" },
    { name: "caption", label: "Caption", type: "textarea" },
  ] satisfies ProfileField[],
};
