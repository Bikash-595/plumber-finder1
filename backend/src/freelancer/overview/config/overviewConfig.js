// "At a glance" details for a freelancer's public profile.
export const overviewConfig = {
  label: "Overview",
  fields: {
    bio: { type: "text", max: 3000 },
    specialties: { type: "list", maxItems: 20, max: 60 },
    certifications: { type: "string", max: 2000 },
    languages: { type: "list", maxItems: 10, max: 40 },
    responseTime: { type: "string", max: 120 },
    jobsCompleted: { type: "number", integer: true, min: 0, max: 1000000 },
    averageCost: { type: "number", min: 0, max: 1000000 },
    emergencyAvailable: { type: "boolean", default: false },
  },
};
