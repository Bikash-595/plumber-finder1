// Premium plans for companies and freelancers: plans and prices from the server, manual requests that an admin
// activates, Stripe webhooks (signed, applied once), the directory ranking, cancel / resume, and expiry.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { startTestServer } from "./helpers/testServer.js";

const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { expireDue } = await import("../src/premium/services/subscriptions.js");
const { syncListingBadge } = await import("../src/premium/services/listingBadge.js");
const { CompanyListing } = await import("../src/company/listing/models/CompanyListing.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
async function newCompany() {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Prem Co ${n}`, email: `prem${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Prem Co ${n}` } } })).body.data;
  return { token, id: listing._id };
}
async function newFreelancer() {
  const n = ++seq;
  const { token, account } = await signup("freelancers", { name: `Prem Fran ${n}`, email: `premfl${n}@example.com` });
  await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: `Prem Fran ${n}` } });
  return { token, accountId: account._id };
}
async function adminToken() {
  const email = `premadmin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  return (await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).body.token;
}
const sign = (payload, secret, t = Math.floor(Date.now() / 1000)) => `t=${t},v1=${crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex")}`;

describe("plans and manual requests", () => {
  test("prices come from the server; a request waits for an admin; activation ranks the listing first", async () => {
    const company = await newCompany();
    const page = (await api("GET", "/api/companies/premium", { token: company.token })).body.data;
    assert.equal(page.mode, "manual", "no Stripe keys in tests");
    assert.deepEqual(page.plans.map((p) => [p.id, p.prices.month, p.prices.year]), [["premium", 4900, 49000], ["elite", 9900, 99000]]);
    assert.equal(page.subscription, null);
    assert.equal((await api("POST", "/api/companies/premium/checkout", { token: company.token, body: { plan: "premium" } })).status, 409, "no card payments without Stripe");
    assert.equal((await api("POST", "/api/companies/premium/request", { token: company.token, body: { plan: "gold" } })).status, 400);
    const requested = await api("POST", "/api/companies/premium/request", { token: company.token, body: { plan: "premium", interval: "month", note: "Please invoice us", amount: 1 } });
    assert.equal(requested.status, 201);
    assert.deepEqual([requested.body.data.subscription.status, requested.body.data.subscription.active], ["pending", false]);
    assert.equal((await CompanyListing.findById(company.id).lean()).premium?.rank ?? 0, 0, "no badge before payment");

    const admin = await adminToken();
    const list = (await api("GET", "/api/admin/premium?status=pending", { token: admin })).body;
    const row = list.data.find((r) => String(r.account) !== "" && r.requestNote === "Please invoice us");
    assert.ok(row && row.name?.startsWith("Prem Co"));
    assert.equal((await api("POST", `/api/admin/premium/${row.id}/activate`, { token: admin, body: { months: 0, amount: 49 } })).status, 400);
    const activated = await api("POST", `/api/admin/premium/${row.id}/activate`, { token: admin, body: { months: 1, amount: 49, note: "Bank transfer #123" } });
    assert.equal(activated.status, 200);
    const mine = (await api("GET", "/api/companies/premium", { token: company.token })).body.data;
    assert.deepEqual([mine.subscription.status, mine.subscription.active, mine.payments[0].amount, mine.payments[0].source], ["active", true, 4900, "manual"]);
    assert.ok((await api("GET", "/api/companies/notifications", { token: company.token })).body.data.some((n) => /Premium is active/.test(n.title)));

    await newCompany(); // a newer free listing
    const directory = (await api("GET", "/api/companies/public")).body.data;
    assert.equal(directory[0]._id, company.id, "premium is listed first");
    assert.deepEqual([directory[0].premium.tier, directory[0].premium.rank], ["premium", 1]);
    assert.equal((await api("POST", "/api/companies/premium/request", { token: company.token, body: { plan: "elite" } })).status, 409, "already premium");

    // Cancel keeps premium until the period ends; resume turns renewal back on.
    assert.equal((await api("POST", "/api/companies/premium/cancel", { token: company.token })).body.data.subscription.cancelAtPeriodEnd, true);
    assert.equal((await api("POST", "/api/companies/premium/resume", { token: company.token })).body.data.subscription.cancelAtPeriodEnd, false);

    // When the paid period is over, the sweep removes premium and the badge.
    assert.equal(await expireDue(new Date(Date.now() + 40 * 864e5), syncListingBadge), 1);
    assert.equal((await CompanyListing.findById(company.id).lean()).premium, undefined);
    assert.equal((await api("GET", "/api/companies/premium", { token: company.token })).body.data.subscription.status, "expired");
  });

  test("freelancers have their own prices; admins can decline; access is limited to the owner and admins", async () => {
    const fl = await newFreelancer();
    assert.deepEqual((await api("GET", "/api/freelancers/premium", { token: fl.token })).body.data.plans.map((p) => p.prices.month), [2900, 5900]);
    await api("POST", "/api/freelancers/premium/request", { token: fl.token, body: { plan: "elite", interval: "year" } });
    const admin = await adminToken();
    const row = (await api("GET", "/api/admin/premium?type=freelancer&status=pending", { token: admin })).body.data.find((r) => String(r.account) === String(fl.accountId));
    assert.ok(row);
    assert.equal((await api("POST", `/api/admin/premium/${row.id}/cancel`, { token: admin, body: { note: "Couldn't verify payment" } })).body.data.status, "expired");
    const user = await signup("users", { name: "Nosy User", email: `nosy${++seq}@example.com` });
    assert.equal((await api("GET", "/api/companies/premium", { token: user.token })).status, 403);
    assert.equal((await api("GET", "/api/admin/premium", { token: fl.token })).status, 403);
    assert.equal((await api("GET", "/api/companies/premium")).status, 401);
  });
});

describe("Stripe webhook", () => {
  test("only signed events count; each is applied once; invoices become billing history", async () => {
    const secret = "whsec_test_secret";
    process.env.STRIPE_WEBHOOK_SECRET = secret;
    process.env.STRIPE_SECRET_KEY = "sk_test_unused";
    try {
      const company = await newCompany();
      const account = (await api("GET", "/api/companies/settings", { token: company.token })).body.data;
      assert.ok(account);
      const companyId = (await CompanyListing.findById(company.id).lean()).company;
      const end = Math.floor(Date.now() / 1000) + 30 * 86400;
      const subEvent = (id) => JSON.stringify({ id, type: "customer.subscription.updated", data: { object: { id: "sub_123", customer: "cus_123", status: "active", cancel_at_period_end: false, current_period_start: end - 30 * 86400, current_period_end: end, metadata: { providerType: "company", account: String(companyId), plan: "elite", interval: "month" } } } });
      const post = (payload, signature) => api("POST", "/api/premium/webhook/stripe", { raw: payload, headers: { "stripe-signature": signature } });

      const payload = subEvent("evt_1");
      assert.equal((await post(payload, sign(payload, "wrong_secret"))).status, 400, "forged signature");
      assert.equal((await post(payload, sign(payload, secret, Math.floor(Date.now() / 1000) - 3600))).status, 400, "replayed (too old)");
      assert.equal((await post(payload.replace("elite", "premium"), sign(payload, secret))).status, 400, "body changed after signing");
      assert.equal((await post(payload, sign(payload, secret))).status, 200);
      const listing = await CompanyListing.findById(company.id).lean();
      assert.deepEqual([listing.premium.tier, listing.premium.rank], ["elite", 2]);
      const page = (await api("GET", "/api/companies/premium", { token: company.token })).body.data;
      assert.deepEqual([page.mode, page.subscription.source, page.subscription.active, page.subscription.canManageCard], ["stripe", "stripe", true, true]);
      assert.equal((await post(payload, sign(payload, secret))).body.duplicate, true, "the same event twice is ignored");

      const invoice = JSON.stringify({ id: "evt_2", type: "invoice.paid", data: { object: { id: "in_1", subscription: "sub_123", amount_paid: 9900, currency: "usd", hosted_invoice_url: "https://invoice.stripe.com/i/123", lines: { data: [{ period: { start: end - 30 * 86400, end } }] } } } });
      await post(invoice, sign(invoice, secret));
      const again = JSON.stringify({ ...JSON.parse(invoice), id: "evt_3" });
      await post(again, sign(again, secret));
      const payments = (await api("GET", "/api/companies/premium", { token: company.token })).body.data.payments;
      assert.deepEqual(payments.map((p) => [p.amount, p.source]), [[9900, "stripe"]], "one row per invoice");

      const deleted = JSON.stringify({ id: "evt_4", type: "customer.subscription.deleted", data: { object: { ...JSON.parse(payload).data.object, status: "canceled" } } });
      await post(deleted, sign(deleted, secret));
      assert.equal((await CompanyListing.findById(company.id).lean()).premium, undefined, "canceled in Stripe → no badge");

      const bogus = JSON.stringify({ id: "evt_5", type: "customer.subscription.updated", data: { object: { id: "sub_x", status: "active", current_period_end: end, metadata: { providerType: "admin", account: "nope", plan: "elite" } } } });
      assert.equal((await post(bogus, sign(bogus, secret))).status, 200, "unknown metadata is ignored, not applied");
    } finally {
      delete process.env.STRIPE_WEBHOOK_SECRET;
      delete process.env.STRIPE_SECRET_KEY;
    }
  });
});
