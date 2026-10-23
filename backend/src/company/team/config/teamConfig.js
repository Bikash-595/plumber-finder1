// People shown on the company's public profile.
export const teamConfig = {
  label: "Team member",
  labelPlural: "team members",
  maxItems: 100,
  fields: {
    name: { type: "string", required: true, max: 120 },
    role: { type: "string", max: 120 },
    bio: { type: "text", max: 2000 },
    photo: { type: "image" },
    specialties: { type: "list", maxItems: 20, max: 60 },
    experienceYears: { type: "number", integer: true, min: 0, max: 80 },
    certificates: { type: "list", maxItems: 20, max: 120 },
    licenseNumber: { type: "string", max: 120 },
    availability: { type: "string", max: 120 },
    joinedYear: { type: "number", integer: true, min: 1900, max: () => new Date().getFullYear() },
  },
};
