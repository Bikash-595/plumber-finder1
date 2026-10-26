import { coverImagesField } from "../../../shared/profileSections/coverImages.js";

// The identity block at the top of a freelancer's public profile. Saving it creates or updates
// the public listing; `published` controls whether the freelancer appears in the directory.
export const headerProfileConfig = {
  label: "Profile",
  fields: {
    photo: { type: "image", max: 1_250_000 },
    coverImage: { type: "image", max: 1_250_000 },
    // Cover photos shown as a slideshow; coverImage follows the first one.
    coverImages: coverImagesField,
    displayName: { type: "string", required: true, max: 120 },
    headline: { type: "string", max: 120 },
    // Short bio at the top of the profile and on cards (the Overview bio is the longer "About" text).
    bio: { type: "text", max: 600 },
    yearsExperience: { type: "number", integer: true, min: 0, max: 80 },
    licenseNumber: { type: "string", max: 120 },
    insurance: { type: "string", max: 500 },
    hourlyRate: { type: "number", min: 0, max: 10000 },
    phone: { type: "string", max: 40 },
    city: { type: "string", max: 100 },
    state: { type: "string", max: 100 },
    isAvailable: { type: "boolean", default: true },
    published: { type: "boolean", default: true },
  },
};
