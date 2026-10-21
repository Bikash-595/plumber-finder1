// The identity block at the top of a freelancer's public profile. Saving it creates or updates
// the public listing; `published` controls whether the freelancer appears in the directory.
export const headerProfileConfig = {
  label: "Profile",
  fields: {
    photo: { type: "image", max: 1_250_000 },
    coverImage: { type: "image", max: 1_250_000 },
    displayName: { type: "string", required: true, max: 120 },
    headline: { type: "string", max: 120 },
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
