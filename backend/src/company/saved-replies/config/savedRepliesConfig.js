// Reusable message templates ("On my way", "Here's your quote", "We're fully booked …").
export const savedRepliesConfig = {
  label: "Saved reply",
  labelPlural: "saved replies",
  maxItems: 50,
  fields: {
    title: { type: "string", required: true, max: 60 },
    body: { type: "text", required: true, max: 1000 },
    category: { type: "enum", values: ["message", "decline", "follow-up", "other"], default: "message" },
  },
};
