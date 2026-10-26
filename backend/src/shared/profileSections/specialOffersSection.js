// Special offers, shared by companies and freelancers. An offer (title, dates, image) carries one or
// more coupon codes, each with its own discount — e.g. "Spring savings": SAVE10 = 10% off any job,
// DRAIN25 = $25 off drain cleaning. Publicly, only active offers within their dates are shown.

export const DISCOUNT_TYPES = ["percent", "amount", "free", "other"];
const CODE = /^[A-Z0-9][A-Z0-9_-]{2,39}$/i;

export const couponFields = {
  code: { type: "string", required: true, max: 40, uppercase: true, pattern: CODE, patternMessage: "must be 3–40 letters, numbers, - or _" },
  // percent: discountValue % off · amount: $discountValue off · free: something free (label) · other: label only.
  discountType: { type: "enum", values: DISCOUNT_TYPES },
  discountValue: { type: "number", min: 0, max: 100000 },
  label: { type: "string", max: 120 },
  appliesTo: { type: "string", max: 150 },
  minSpend: { type: "number", min: 0, max: 1000000 },
  terms: { type: "string", max: 300 },
};

export const specialOffersConfig = {
  label: "Special offer",
  labelPlural: "special offers",
  maxItems: 50,
  fields: {
    title: { type: "string", required: true, max: 120 },
    description: { type: "text", max: 1000 },
    coupons: { type: "objects", maxItems: 20, fields: couponFields },
    // Older single-code offers; still read (shown as one coupon) and cleared when the offer is re-saved.
    discount: { type: "string", max: 60 },
    promoCode: { type: "string", max: 40, uppercase: true },
    startDate: { type: "date" },
    endDate: { type: "date" },
    image: { type: "image" },
    active: { type: "boolean", default: true },
  },
  validate: ({ startDate, endDate, coupons }) => {
    if (startDate && endDate && endDate < startDate) return { endDate: "must be on or after the start date" };
    const seen = new Set();
    for (const [index, coupon] of (coupons ?? []).entries()) {
      const name = `coupon ${index + 1} (${coupon.code})`;
      const type = coupon.discountType ?? "percent";
      if (seen.has(coupon.code)) return { coupons: `${name} is listed twice — each code must be different` };
      seen.add(coupon.code);
      if ((type === "percent" || type === "amount") && !(coupon.discountValue > 0)) return { coupons: `${name} needs a discount greater than 0` };
      if (type === "percent" && coupon.discountValue > 100) return { coupons: `${name} can't be more than 100% off` };
      if ((type === "free" || type === "other") && !coupon.label) return { coupons: `${name} needs a description of the offer, e.g. "Free inspection"` };
    }
    return null;
  },
};

const couponSchema = {
  code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
  discountType: { type: String, enum: DISCOUNT_TYPES, default: "percent" },
  discountValue: Number,
  label: { type: String, trim: true, maxlength: 120 },
  appliesTo: { type: String, trim: true, maxlength: 150 },
  minSpend: Number,
  terms: { type: String, trim: true, maxlength: 300 },
};

/** Mongoose fields for a company/freelancer offer (the owner field is added by each model). */
export const specialOfferSchemaFields = {
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000 },
  coupons: { type: [couponSchema], default: [] },
  discount: { type: String, trim: true, maxlength: 60 },
  promoCode: { type: String, trim: true, uppercase: true, maxlength: 40 },
  startDate: { type: Date },
  endDate: { type: Date },
  image: { type: String },
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
};

const money = (value) => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

/** "20% off", "$50 off", "Free inspection". */
export function discountLabel(coupon) {
  const type = coupon.discountType ?? "percent";
  if (type === "percent" && coupon.discountValue > 0) return `${coupon.discountValue}% off`;
  if (type === "amount" && coupon.discountValue > 0) return `${money(coupon.discountValue)} off`;
  return coupon.label || (type === "free" ? "Free" : "Special offer");
}

/** An offer's coupons for the public site, each with its discount label; old single-code offers become one coupon. */
export function publicCoupons(offer) {
  const coupons = (offer.coupons ?? []).map(({ _id, ...coupon }) => ({ ...coupon, discount: discountLabel(coupon) }));
  if (coupons.length || (!offer.promoCode && !offer.discount)) return coupons;
  return [{ code: offer.promoCode ?? "", discountType: "other", label: offer.discount || offer.title, discount: offer.discount || offer.title }];
}

/** An offer as shown on the public profile (the old single-code fields are folded into `coupons`). */
export function publicOffer(offer) {
  const { discount: _discount, promoCode: _promoCode, ...rest } = offer;
  return { ...rest, coupons: publicCoupons(offer) };
}

/** Short card version: the headline ("Up to 25% off"), the first code, and how many codes are on offer in total. */
export function cardOffer(offers) {
  if (!offers.length) return undefined;
  const first = offers[0];
  const coupons = offers.flatMap(publicCoupons);
  const best = (type) => coupons.filter((c) => c.discountType === type && c.discountValue > 0).sort((a, b) => b.discountValue - a.discountValue)[0];
  const top = best("percent") ?? best("amount");
  const headline = top ? `${coupons.length > 1 ? "Up to " : ""}${discountLabel(top)}` : coupons[0]?.discount || first.title;
  return { title: first.title, discount: headline, promoCode: coupons.find((c) => c.code)?.code, couponCount: coupons.filter((c) => c.code).length, offerCount: offers.length };
}
