const snapshotImage = { type: "string", max: 2048, pattern: /^(https?:\/\/[^\s"<>]+|\/(?!\/)[^\s"<>]*)$/i, patternMessage: "must be an http(s) URL or a site path" };

// Customer cart. Totals, promo discounts, and tax are always calculated on the server.
export const cartConfig = {
  label: "Cart item",
  labelPlural: "cart items",
  maxItems: 50,
  maxQuantity: 20,
  taxRate: 0.08,
  // Promo code → percent off. Kept server-side so customers cannot invent discounts.
  promoCodes: { SAVE10: 10, WELCOME20: 20 },
  fields: {
    providerType: { type: "enum", values: ["company", "freelancer"], required: true },
    providerId: { type: "string", required: true, max: 64 },
    providerName: { type: "string", required: true, max: 150 },
    name: { type: "string", required: true, max: 150 },
    price: { type: "number", required: true, min: 0, max: 100000 },
    quantity: { type: "number", integer: true, min: 1, max: 20, default: 1 },
    itemType: { type: "enum", values: ["service", "offer"], default: "service" },
    image: snapshotImage,
  },
  quantityFields: { quantity: { type: "number", integer: true, required: true, min: 1, max: 20 } },
  promoFields: { code: { type: "string", required: true, max: 40, uppercase: true } },
};
