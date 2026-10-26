import { coverImagesField } from "../../../shared/profileSections/coverImages.js";

// The identity block at the top of the public profile. Name, logo, and cover are synced to the listing.
export const headerProfileConfig = {
  label: "Header profile",
  fields: {
    logo: { type: "image", max: 1_250_000 },
    coverImage: { type: "image", max: 1_250_000 },
    // Cover photos shown as a slideshow; coverImage follows the first one.
    coverImages: coverImagesField,
    companyName: { type: "string", required: true, max: 150 },
    // Shown under the name at the top of the profile; the bio is also the description on cards.
    tagline: { type: "string", max: 150 },
    bio: { type: "text", max: 600 },
    ownerName: { type: "string", max: 120 },
    companyType: { type: "string", max: 100 },
    yearsInBusiness: { type: "number", integer: true, min: 0, max: 200 },
    licenseNumber: { type: "string", max: 120 },
    insurance: { type: "string", max: 500 },
    certifications: { type: "string", max: 2000 },
  },
};
