// Saved payment methods. Only display details are stored — brand, last 4 digits, and expiry.
// Full card numbers and CVCs are never accepted (they are not in this list, so they are ignored).
export const paymentMethodsConfig = {
  label: "Payment method",
  labelPlural: "payment methods",
  maxItems: 10,
  fields: {
    brand: { type: "enum", values: ["visa", "mastercard", "amex", "discover", "other"], required: true },
    last4: { type: "string", required: true, max: 4, pattern: /^\d{4}$/, patternMessage: "must be the last 4 digits" },
    expMonth: { type: "number", integer: true, required: true, min: 1, max: 12 },
    expYear: { type: "number", integer: true, required: true, min: 2000, max: 2100 },
    holderName: { type: "string", max: 120 },
    label: { type: "string", max: 60 },
    isDefault: { type: "boolean", default: false },
  },
  // Expired cards cannot be saved.
  validate: ({ expMonth, expYear }) => {
    if (!expMonth || !expYear) return null;
    const now = new Date();
    return expYear < now.getUTCFullYear() || (expYear === now.getUTCFullYear() && expMonth < now.getUTCMonth() + 1) ? { expYear: "this card has expired" } : null;
  },
};
