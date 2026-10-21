// Portfolio of completed work. Only projects marked `visible` appear on the public profile.
export const previousProjectsConfig = {
  label: "Project",
  labelPlural: "projects",
  maxItems: 100,
  fields: {
    title: { type: "string", required: true, max: 150 },
    client: { type: "string", max: 150 },
    location: { type: "string", max: 150 },
    service: { type: "string", required: true, max: 150 },
    completedDate: { type: "date" },
    duration: { type: "string", max: 60 },
    budget: { type: "string", max: 60 },
    description: { type: "text", required: true, max: 5000 },
    challenge: { type: "text", max: 3000 },
    solution: { type: "text", max: 3000 },
    results: { type: "text", max: 3000 },
    beforeImage: { type: "image" },
    afterImage: { type: "image" },
    testimonial: { type: "text", max: 2000 },
    rating: { type: "number", min: 0, max: 5 },
    visible: { type: "boolean", default: true },
  },
};
