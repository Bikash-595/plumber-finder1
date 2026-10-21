// Services a freelancer offers. Names are synced to the public listing so service pages can find the freelancer.
export const servicesConfig = {
  label: "Service",
  labelPlural: "services",
  maxItems: 100,
  fields: {
    name: { type: "string", required: true, max: 150 },
    description: { type: "text", max: 2000 },
    price: { type: "string", max: 60 },
    duration: { type: "string", max: 60 },
    emergency: { type: "boolean", default: false },
    featured: { type: "boolean", default: false },
    image: { type: "image" },
  },
};
