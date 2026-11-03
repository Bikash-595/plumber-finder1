// Services a company or freelancer offers, shared by both. Names are synced to the public listing
// (search and /services pages); the rest is shown on the profile: category, price, duration, what's included.
// Each service also has its own public page: photos, a full overview, how it works, and FAQs.
import { blogFaqsField, blogFaqsSchema } from "./blogFaqs.js";

export const SERVICE_CATEGORIES = ["Repairs", "Installation", "Drains & Sewer", "Water Heaters", "Leak Detection", "Emergency", "Inspection & Maintenance", "Remodeling", "Commercial", "Other"];
// fixed: $89 · from: From $89 · hourly: $95/hr · quote: Free quote (no price) · free: Free.
export const PRICE_TYPES = ["fixed", "from", "hourly", "quote", "free"];
const needsAmount = ["fixed", "from", "hourly"];
const MAX_MEDIA_SIZE = 13_000_000;
const youtubeId = (url) => url.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/)?.[1] ?? null;

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
    // A one-line subheading under the name (cards and the service's page).
    tagline: { type: "string", max: 160 },
    // The service's own page.
    images: { type: "images", maxItems: 8 },
    videos: { type: "videos", maxItems: 4, maxUploads: 1 },
    overview: { type: "text", max: 5000 },
    process: { type: "list", maxItems: 8, max: 200 },
    problems: { type: "list", maxItems: 12, max: 160 },   // "Signs you need this": problems this service fixes
    highlights: { type: "list", maxItems: 8, max: 160 },  // why this service stands out
    prepare: { type: "list", maxItems: 8, max: 200 },     // "Before your visit" tips
    faqs: { ...blogFaqsField, maxItems: 10 },
  },
  validate: ({ priceType, priceAmount, images, videos }) => {
    if (needsAmount.includes(priceType) && !(priceAmount > 0)) return { priceAmount: "is required for this price type" };
    // Photos and an uploaded clip are stored in the service itself, which must stay well under MongoDB's 16 MB limit.
    const size = [...(images ?? []), ...(videos ?? [])].reduce((total, item) => total + item.length, 0);
    if (size > MAX_MEDIA_SIZE) return { images: "photos and videos are too large together — remove one or use smaller files (or add videos as YouTube links)" };
    return null;
  },
};

const money = (value) => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

/** "$89", "From $89", "$95/hr", "Free quote", "Free". */
export function priceLabel({ priceType, priceAmount }) {
  if (priceType === "quote") return "Free quote";
  if (priceType === "free") return "Free";
  if (!(priceAmount > 0)) return null;
  return priceType === "from" ? `From ${money(priceAmount)}` : priceType === "hourly" ? `${money(priceAmount)}/hr` : money(priceAmount);
}

/** Heavy fields left out of lists (dashboard list, public profile); a service's own page loads them. */
export const SERVICE_LIST_SELECT = "-images -videos -overview -process -problems -highlights -prepare -faqs";

/**
 * beforeWrite hook: keeps the shown `price` in step with the structured price, and the card photo
 * (`image`) in step with the first of the service's photos.
 */
export function syncPriceLabel(values) {
  if (values.priceType !== undefined) values.price = values.priceType ? priceLabel(values) : values.price ?? null;
  if (values.priceType && !needsAmount.includes(values.priceType)) values.priceAmount = null;
  if (values.images !== undefined) { values.image = values.images[0] ?? null; values.photoCount = values.images.length; }
  if (values.videos !== undefined) {
    values.videoCount = values.videos.length;
    // A still for cards when the service has a YouTube video (used when there's no photo).
    const id = values.videos.map(youtubeId).find(Boolean);
    values.videoPoster = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }
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
  images: { type: [String], default: undefined },
  videos: { type: [String], default: undefined },
  // Kept in step with images/videos so lists can show "3 photos · 1 video" without loading them.
  photoCount: { type: Number, default: 0 },
  videoCount: { type: Number, default: 0 },
  videoPoster: { type: String },
  tagline: { type: String, trim: true, maxlength: 160 },
  overview: { type: String, trim: true, maxlength: 5000 },
  process: { type: [String], default: undefined },
  problems: { type: [String], default: undefined },
  highlights: { type: [String], default: undefined },
  prepare: { type: [String], default: undefined },
  faqs: blogFaqsSchema,
  position: { type: Number, default: 0 },
};
