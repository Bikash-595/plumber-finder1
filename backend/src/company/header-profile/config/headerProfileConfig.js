// The identity block at the top of the public profile. Name, logo, and cover are synced to the listing.
export const headerProfileConfig = {
  label: "Header profile",
  fields: {
    logo: { type: "image", max: 1_250_000 },
    coverImage: { type: "image", max: 1_250_000 },
    companyName: { type: "string", required: true, max: 150 },
    ownerName: { type: "string", max: 120 },
    companyType: { type: "string", max: 100 },
    yearsInBusiness: { type: "number", integer: true, min: 0, max: 200 },
    licenseNumber: { type: "string", max: 120 },
    insurance: { type: "string", max: 500 },
    certifications: { type: "string", max: 2000 },
  },
};
