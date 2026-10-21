// "Company at a Glance" figures shown on the public profile.
export const companyOverviewConfig = {
  label: "Company overview",
  fields: {
    foundedYear: { type: "number", integer: true, min: 1800, max: () => new Date().getFullYear() },
    yearsInBusiness: { type: "number", integer: true, min: 0, max: 200 },
    teamSize: { type: "number", integer: true, min: 0, max: 100000 },
    licenseNumber: { type: "string", max: 120 },
    insurance: { type: "string", max: 300 },
    responseTime: { type: "string", max: 120 },
    serviceAreaCount: { type: "number", integer: true, min: 0, max: 10000 },
    averageCost: { type: "number", min: 0, max: 1000000 },
    projectsCompleted: { type: "number", integer: true, min: 0, max: 1000000 },
    certifications: { type: "string", max: 2000 },
  },
};
