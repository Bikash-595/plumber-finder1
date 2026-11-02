// Quotes (estimates) a company sends for a booking. Totals are always worked out on the server.
export const QUOTE_STATUSES = ["draft", "sent", "accepted", "declined", "withdrawn"];
export const quotesConfig = {
  maxItems: 30,
  quote: {
    label: "quote",
    fields: {
      bookingId: { type: "string", max: 24, pattern: /^[a-f0-9]{24}$/i, patternMessage: "is not a booking id" },
      title: { type: "string", max: 120 },
      items: { type: "objects", maxItems: 30, fields: {
        description: { type: "string", required: true, max: 200 },
        quantity: { type: "number", min: 0.01, max: 9999, required: true },
        unitPrice: { type: "number", min: 0, max: 1_000_000, required: true },
      } },
      discount: { type: "number", min: 0, max: 1_000_000 },
      taxRate: { type: "number", min: 0, max: 25 },
      notes: { type: "text", max: 2000 },
      validUntil: { type: "date" },
    },
  },
};
