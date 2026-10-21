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
  },
};
