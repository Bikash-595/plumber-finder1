// Promotions customers can claim. Publicly, only active offers within their date range are shown.
export const specialOffersConfig = {
  label: "Special offer",
  labelPlural: "special offers",
  maxItems: 50,
  fields: {
    title: { type: "string", required: true, max: 120 },
    description: { type: "text", max: 1000 },
    discount: { type: "string", max: 60 },
    promoCode: { type: "string", max: 40, uppercase: true },
    startDate: { type: "date" },
    endDate: { type: "date" },
    image: { type: "image" },
    active: { type: "boolean", default: true },
  },
  validate: ({ startDate, endDate }) => (
    startDate && endDate && endDate < startDate ? { endDate: "must be on or after the start date" } : null
  ),
};
