// Coupon codes in the booking form: checked against the plumber's current offers, and the discount
// (percentage or amount) taken off the service's price — previewed, then re-checked when booking.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
async function plumberWithOffers() {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Coupon Co ${n}`, email: `cc${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Coupon Co ${n}` } } })).body.data;
  await api("POST", "/api/companies/services", { token, body: { name: "Drain Cleaning", priceType: "fixed", priceAmount: 200 } });
  await api("POST", "/api/companies/services", { token, body: { name: "Leak Repair", priceType: "from", priceAmount: 80 } });
  await api("POST", "/api/companies/services", { token, body: { name: "Repiping", priceType: "quote" } });
  await api("POST", "/api/companies/special-offers", { token, body: { title: "Spring", endDate: "2099-01-01", coupons: [
    { code: "SAVE15", discountType: "percent", discountValue: 15 },
    { code: "DRAIN50", discountType: "amount", discountValue: 50, appliesTo: "Drain Cleaning" },
    { code: "BIG100", discountType: "amount", discountValue: 100, minSpend: 150 },
    { code: "CHECKUP", discountType: "free", label: "Free inspection" },
  ] } });
  await api("POST", "/api/companies/special-offers", { token, body: { title: "Old", discount: "20% off first visit", promoCode: "FIRST20" } });
  await api("POST", "/api/companies/special-offers", { token, body: { title: "Ended", endDate: "2020-01-01", coupons: [{ code: "GONE", discountValue: 50 }] } });
  await api("POST", "/api/companies/special-offers", { token, body: { title: "Paused", active: false, coupons: [{ code: "PAUSED", discountValue: 50 }] } });
  return { token, id: listing._id, name: `Coupon Co ${n}` };
}
const quote = (plumber, service, couponCode) => api("POST", "/api/booking-quote", { body: { providerType: "company", providerId: plumber.id, service, couponCode } });

describe("coupon codes when booking", () => {
  test("percentage, amount, applies-to, minimum spend, ended and paused offers", async () => {
    const plumber = await plumberWithOffers();
    let res = await quote(plumber, "Drain Cleaning", "save15");
    assert.deepEqual([res.status, res.body.data.price.base, res.body.data.price.discount, res.body.data.price.total, res.body.data.coupon.label], [200, 200, 30, 170, "15% off"], "15% off $200 is $30, codes are case-insensitive");
    res = await quote(plumber, "Drain Cleaning", "DRAIN50");
    assert.deepEqual([res.body.data.price.discount, res.body.data.price.total], [50, 150]);
    res = await quote(plumber, "Leak Repair", "DRAIN50");
    assert.deepEqual([res.status, res.body.message], [422, "DRAIN50 only works for Drain Cleaning."]);
    res = await quote(plumber, "Leak Repair", "BIG100");
    assert.equal(res.body.message, "BIG100 needs a minimum spend of $150.");
    res = await quote(plumber, "Drain Cleaning", "BIG100");
    assert.equal(res.body.data.price.total, 100);
    res = await quote(plumber, "Leak Repair", "FIRST20");
    assert.deepEqual([res.body.data.price.discount, res.body.data.coupon.discountType], [16, "percent"], "older offers' '20% off' is read as 20 percent");
    res = await quote(plumber, "Repiping", "SAVE15");
    assert.deepEqual([res.body.data.price.total, res.body.data.coupon.appliesToFinalPrice], [null, true], "with no set price, the 15% comes off the final price");
    res = await quote(plumber, "Leak Repair", "CHECKUP");
    assert.deepEqual([res.body.data.price.discount, res.body.data.coupon.label], [0, "Free inspection"]);
    for (const code of ["GONE", "PAUSED", "NOPE"]) assert.equal((await quote(plumber, "Leak Repair", code)).status, 422, `${code} can't be used`);
    res = await quote(plumber, "Drain Cleaning");
    assert.deepEqual([res.body.data.price.total, res.body.data.coupon], [200, null], "without a code: the plain price");
  });

  test("the booking stores the server's price, and a bad code stops the booking", async () => {
    const plumber = await plumberWithOffers();
    const customer = await signup("users", { name: "Cora", email: `cora${++seq}@example.com` });
    const book = (body) => api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: plumber.id, providerName: plumber.name, service: "Drain Cleaning", ...body } });
    assert.equal((await book({ couponCode: "NOPE" })).status, 400);
    const res = await book({ couponCode: "save15", price: 1, discountAmount: 199 });
    assert.equal(res.status, 201);
    assert.deepEqual([res.body.data.couponCode, res.body.data.couponLabel, res.body.data.originalPrice, res.body.data.discountAmount, res.body.data.price], ["SAVE15", "15% off", 200, 30, 170], "prices sent by the browser are ignored");
    const note = (await api("GET", "/api/companies/notifications", { token: plumber.token })).body.data[0];
    assert.match(note.message, /coupon SAVE15 \(15% off\)/);
    const inbox = (await api("GET", "/api/companies/bookings", { token: plumber.token })).body.data[0];
    assert.deepEqual([inbox.couponCode, inbox.price, inbox.originalPrice], ["SAVE15", 170, 200]);
    // Sample plumbers: the code is kept as given (there are no saved offers to check).
    const sample = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: "1", providerName: "Demo", service: "Leak repair", couponCode: "nyplumb15" } });
    assert.equal(sample.body.data.couponCode, "NYPLUMB15");
  });
});
