import crypto from "node:crypto";

// Stripe, called over its REST API (no SDK). Configured with STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET;
// without them, premium works in manual mode (an admin activates plans after payment is received).
// Card details never touch this server: customers pay on Stripe's own Checkout page.

const API = "https://api.stripe.com/v1";
export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);

/** Stripe's form encoding, with nested keys: { a: { b: 1 } } → "a[b]=1". */
function encode(params, prefix = "") {
  return Object.entries(params).flatMap(([key, value]) => {
    if (value === undefined || value === null) return [];
    const name = prefix ? `${prefix}[${key}]` : key;
    if (typeof value === "object") return [encode(value, name)].filter(Boolean);
    return [`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`];
  }).join("&");
}

async function stripe(method, path, params) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded", "Stripe-Version": "2024-06-20" },
    body: params ? encode(params) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.json();
  if (!response.ok) throw Object.assign(new Error(body?.error?.message ?? "Stripe request failed."), { status: 502 });
  return body;
}

/** A Checkout page for a monthly or yearly subscription; the price is set here, never by the browser. */
export function createCheckoutSession({ providerType, accountId, email, customerId, plan, planName, interval, amount, currency, successUrl, cancelUrl }) {
  const metadata = { providerType, account: String(accountId), plan, interval };
  return stripe("POST", "/checkout/sessions", {
    mode: "subscription",
    client_reference_id: `${providerType}:${accountId}`,
    ...(customerId ? { customer: customerId } : { customer_email: email }),
    line_items: { 0: { quantity: 1, price_data: { currency, unit_amount: amount, recurring: { interval }, product_data: { name: `Plumber Finder ${planName}` } } } },
    metadata,
    subscription_data: { metadata },
    allow_promotion_codes: "true",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export const getSubscription = (id) => stripe("GET", `/subscriptions/${encodeURIComponent(id)}`);
export const setCancelAtPeriodEnd = (id, cancel) => stripe("POST", `/subscriptions/${encodeURIComponent(id)}`, { cancel_at_period_end: cancel ? "true" : "false" });
export const createPortalSession = (customerId, returnUrl) => stripe("POST", "/billing_portal/sessions", { customer: customerId, return_url: returnUrl });

/**
 * Checks a webhook's Stripe-Signature header against the raw body (HMAC-SHA256 with the signing secret) and
 * rejects old deliveries (replays). Returns the parsed event, or throws.
 */
export function verifyWebhook(rawBody, header, secret = process.env.STRIPE_WEBHOOK_SECRET, toleranceSeconds = 300) {
  const parts = Object.fromEntries(String(header ?? "").split(",").map((pair) => pair.split("=")).filter(([k, v]) => k && v).map(([k, v]) => [k.trim(), v.trim()]));
  const signatures = String(header ?? "").split(",").filter((pair) => pair.trim().startsWith("v1=")).map((pair) => pair.trim().slice(3));
  const timestamp = Number(parts.t);
  if (!secret || !timestamp || !signatures.length) throw new Error("Missing signature.");
  if (Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds) throw new Error("Signature is too old.");
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const ok = signatures.some((signature) => signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)));
  if (!ok) throw new Error("Invalid signature.");
  return JSON.parse(rawBody);
}

/** Period dates of a Stripe subscription (newer API versions keep them on the item). */
export function periodOf(stripeSubscription) {
  const item = stripeSubscription.items?.data?.[0] ?? {};
  const start = stripeSubscription.current_period_start ?? item.current_period_start;
  const end = stripeSubscription.current_period_end ?? item.current_period_end;
  return { start: start ? new Date(start * 1000) : undefined, end: end ? new Date(end * 1000) : undefined };
}

/** Ends a card subscription straight away (admin action). */
export const cancelNow = (id) => stripe("DELETE", `/subscriptions/${encodeURIComponent(id)}`);
