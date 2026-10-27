import { Router } from "express";
import { CompanySpecialOffer } from "../../company/special-offers/models/CompanySpecialOffer.js";
import { CompanyServiceOffering } from "../../company/services/models/CompanyServiceOffering.js";
import { FreelancerSpecialOffer } from "../../freelancer/special-offers/models/FreelancerSpecialOffer.js";
import { FreelancerServiceOffering } from "../../freelancer/services/models/FreelancerServiceOffering.js";
import { currentOffers } from "../profileSections/publicFilters.js";
import { discountLabel, publicCoupons } from "../profileSections/specialOffersSection.js";
import { resolveProviderAccount } from "./bookingWorkflow.js";

// The price of a booking with a coupon code: the service's price from the plumber's Services section,
// the code checked against the plumber's current special offers (dates, pause, "applies to", minimum spend),
// and the discount taken off the total. Used to preview the price in the booking form and again, on the
// server, when the booking is created — so the saved total can't be changed by the browser.

const models = {
  company: { Service: CompanyServiceOffering, Offer: CompanySpecialOffer, owner: "company" },
  freelancer: { Service: FreelancerServiceOffering, Offer: FreelancerSpecialOffer, owner: "freelancer" },
};
const cents = (value) => Math.round(value * 100) / 100;
const same = (a = "", b = "") => a.trim().toLowerCase() === b.trim().toLowerCase();
// "All services" / "Any service" (or nothing) means the code works for every service.
const appliesToAll = (text) => !text || /^(all|any|every)\b/i.test(text.trim());

/** The service's price: { base (a number, or null when it's "free quote"), label, hourly }. */
async function servicePrice(Service, ownerField, account, service) {
  const offerings = await Service.find({ [ownerField]: account }).select("name price priceType priceAmount").lean();
  const match = offerings.find((item) => same(item.name, service));
  if (!match) return { base: null, label: null, hourly: false };
  const numeric = ["fixed", "from", "hourly"].includes(match.priceType) && match.priceAmount > 0 ? match.priceAmount : null;
  return { base: numeric, label: match.price ?? null, hourly: match.priceType === "hourly", from: match.priceType === "from" };
}

/**
 * Quote for one service at one plumber, with an optional coupon code.
 * Returns { price: { base, label, discount, total, hourly, from }, coupon, error? } — `error` explains a code that can't be used.
 * Sample plumbers (no account) have no saved prices or offers: their code is passed through unchecked.
 */
export async function quoteBooking({ providerType, providerId, service, couponCode }) {
  const code = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
  const account = await resolveProviderAccount(providerType, providerId);
  if (!account) return { price: { base: null, label: null, discount: 0, total: null }, coupon: code ? { code, unchecked: true } : null };
  const { Service, Offer, owner } = models[providerType];
  const price = await servicePrice(Service, owner, account, service);
  const quote = { price: { ...price, discount: 0, total: price.base }, coupon: null };
  if (!code) return quote;

  const offers = await Offer.find({ [owner]: account, ...currentOffers() }).select("title endDate coupons discount promoCode").lean();
  const found = offers.flatMap((offer) => publicCoupons(offer).map((coupon) => ({ ...coupon, offerTitle: offer.title, endDate: offer.endDate }))).find((coupon) => same(coupon.code, code));
  if (!found) return { ...quote, error: `${code} isn't a valid code for this plumber, or the offer has ended.` };
  if (!appliesToAll(found.appliesTo) && service && !same(found.appliesTo, service)) return { ...quote, error: `${found.code} only works for ${found.appliesTo}.` };
  if (found.minSpend && price.base !== null && price.base < found.minSpend) return { ...quote, error: `${found.code} needs a minimum spend of $${found.minSpend}.` };

  // Older single-code offers say e.g. "15% off" in words: read the percentage from it.
  let type = found.discountType ?? "percent";
  let value = found.discountValue;
  if (type === "other") {
    const percent = (found.label ?? "").match(/(\d+(?:\.\d+)?)\s*%/);
    const amount = (found.label ?? "").match(/\$\s*(\d+(?:\.\d+)?)/);
    if (percent) { type = "percent"; value = Number(percent[1]); } else if (amount) { type = "amount"; value = Number(amount[1]); }
  }
  const base = price.base;
  const discount = base === null ? 0 : type === "percent" ? cents((base * Math.min(value ?? 0, 100)) / 100) : type === "amount" ? cents(Math.min(value ?? 0, base)) : 0;
  return {
    price: { ...price, discount, total: base === null ? null : cents(base - discount) },
    coupon: {
      code: found.code, discountType: type, discountValue: value ?? null, label: discountLabel({ discountType: type, discountValue: value, label: found.label }),
      appliesTo: found.appliesTo, minSpend: found.minSpend, terms: found.terms, offerTitle: found.offerTitle, endDate: found.endDate,
      // With no set price (e.g. "Free quote"), a percentage is taken off the final price.
      appliesToFinalPrice: base === null && (type === "percent" || type === "amount"),
    },
  };
}

/** Mounted at /api/booking-quote. POST { providerType, providerId, service, couponCode? } — anyone (shown before booking). */
export const bookingQuoteRouter = Router();
bookingQuoteRouter.post("/", async (req, res, next) => {
  try {
    const { providerType, providerId, service, couponCode } = req.body ?? {};
    if (!["company", "freelancer"].includes(providerType) || typeof providerId !== "string" || !providerId) return res.status(400).json({ message: "Choose a plumber." });
    if (typeof couponCode === "string" && couponCode.length > 40) return res.status(400).json({ message: "That code is too long." });
    const quote = await quoteBooking({ providerType, providerId, service: typeof service === "string" ? service : "", couponCode });
    res.status(quote.error ? 422 : 200).json({ ...(quote.error ? { message: quote.error } : {}), data: quote });
  } catch (error) { next(error); }
});
