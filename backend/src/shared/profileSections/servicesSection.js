// Services a company or freelancer offers, shared by both. Names are synced to the public listing
// (search and /services pages); the rest is shown on the profile: category, price, duration, what's included.

export const SERVICE_CATEGORIES = ["Repairs", "Installation", "Drains & Sewer", "Water Heaters", "Leak Detection", "Emergency", "Inspection & Maintenance", "Remodeling", "Commercial", "Other"];
// fixed: $89 · from: From $89 · hourly: $95/hr · quote: Free quote (no price) · free: Free.
export const PRICE_TYPES = ["fixed", "from", "hourly", "quote", "free"];
const needsAmount = ["fixed", "from", "hourly"];

export const servicesConfig = {
  label: "Service",
  labelPlural: "services",
  maxItems: 100,
  fields: {
    name: { type: "string", required: true, max: 150 },
    category: { type: "enum", values: SERVICE_CATEGORIES },
    description: { type: "text", max: 2000 },
    priceType: { type: "enum", values: PRICE_TYPES },
    priceAmount: { type: "number", min: 0, max: 100000 },
    // Shown price. Set from priceType/priceAmount when those are given; free text for older services.
    price: { type: "string", max: 60 },
    duration: { type: "string", max: 60 },
    includes: { type: "list", maxItems: 12, max: 120 },
    warranty: { type: "string", max: 120 },
    emergency: { type: "boolean", default: false },
    featured: { type: "boolean", default: false },
    image: { type: "image" },
  },
  validate: ({ priceType, priceAmount }) => (
    needsAmount.includes(priceType) && !(priceAmount > 0) ? { priceAmount: "is required for this price type" } : null
  ),
};

const money = (value) => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

/** "$89", "From $89", "$95/hr", "Free quote", "Free". */
export function priceLabel({ priceType, priceAmount }) {
  if (priceType === "quote") return "Free quote";
  if (priceType === "free") return "Free";
  if (!(priceAmount > 0)) return null;
  return priceType === "from" ? `From ${money(priceAmount)}` : priceType === "hourly" ? `${money(priceAmount)}/hr` : money(priceAmount);
}

/** beforeWrite hook: keeps the shown `price` in step with the structured price. */
export function syncPriceLabel(values) {
  if (values.priceType !== undefined) values.price = values.priceType ? priceLabel(values) : values.price ?? null;
  if (values.priceType && !needsAmount.includes(values.priceType)) values.priceAmount = null;
}

/** Mongoose fields for a company/freelancer service (the owner field is added by each model). */
export const serviceSchemaFields = {
  name: { type: String, required: true, trim: true, maxlength: 150 },
  category: { type: String, enum: SERVICE_CATEGORIES },
  description: { type: String, trim: true, maxlength: 2000 },
  priceType: { type: String, enum: PRICE_TYPES },
  priceAmount: { type: Number, min: 0 },
  price: { type: String, trim: true, maxlength: 60 },
  duration: { type: String, trim: true, maxlength: 60 },
  includes: { type: [String], default: undefined },
  warranty: { type: String, trim: true, maxlength: 120 },
  emergency: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  image: { type: String },
  position: { type: Number, default: 0 },
};
