// Integration tests for the customer (user) dashboard backend: /api/users/*.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { User } = await import("../src/auth/user/models/User.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
async function newUser() {
  const n = ++seq;
  const { body } = await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: `Cus ${n}`, email: `cus${n}@example.com`, password: "password123" } });
  return { token: body.token, userId: body.account._id, email: `cus${n}@example.com` };
}
const demoPlumber = (id = "1", extra = {}) => ({ providerType: "company", providerId: id, name: `Demo Plumbing ${id}`, image: "/Plumber.png", rating: 4.5, location: "Austin, TX", ...extra });
const cartItem = (extra = {}) => ({ providerType: "company", providerId: "1", providerName: "Demo Plumbing", name: "Drain cleaning", price: 100, ...extra });
const nextYear = new Date().getUTCFullYear() + 1;

describe("access", () => {
  test("every customer route needs a customer token", async () => {
    const { body: company } = await api("POST", "/api/auth/companies/signup", { body: { companyName: "Co", email: "co-user-tests@example.com", password: "password123" } });
    const { body: freelancer } = await api("POST", "/api/auth/freelancers/signup", { body: { name: "Fl", email: "fl-user-tests@example.com", password: "password123" } });
    for (const path of ["dashboard", "profile", "settings", "security", "saved", "compare", "cart", "bookings", "notifications", "invoices", "payment-methods"]) {
      assert.equal((await api("GET", `/api/users/${path}`)).status, 401, path);
      assert.equal((await api("GET", `/api/users/${path}`, { token: company.token })).status, 403, `${path} (company)`);
      assert.equal((await api("GET", `/api/users/${path}`, { token: freelancer.token })).status, 403, `${path} (freelancer)`);
    }
  });
});

describe("profile, settings, security", () => {
  test("profile updates allowed fields only (not email)", async () => {
    const { token, email } = await newUser();
    const res = await api("PUT", "/api/users/profile", { token, body: { name: "New Name", phone: "+1 555 0100", email: "hijack@example.com", role: "admin" } });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.name, "New Name");
    assert.equal(res.body.data.email, email);
    assert.equal(res.body.data.role, "user");
    assert.equal(res.body.data.password, undefined);
    assert.equal((await api("PUT", "/api/users/profile", { token, body: { name: "" } })).status, 400);
  });

  test("settings return defaults until saved", async () => {
    const { token } = await newUser();
    assert.equal((await api("GET", "/api/users/settings", { token })).body.data.emailNotifications, true);
    const saved = await api("PUT", "/api/users/settings", { token, body: { emailNotifications: false, marketingEmails: true } });
    assert.equal(saved.body.data.emailNotifications, false);
    assert.equal((await api("GET", "/api/users/settings", { token })).body.data.marketingEmails, true);
  });

  test("password change needs the current password and the new one works for login", async () => {
    const { token, email } = await newUser();
    assert.deepEqual((await api("GET", "/api/users/security", { token })).body.data, { hasPassword: true, googleLinked: false, appleLinked: false });
    assert.equal((await api("POST", "/api/users/security/password", { token, body: { currentPassword: "wrong-one", newPassword: "newpassword456" } })).status, 401);
    assert.equal((await api("POST", "/api/users/security/password", { token, body: { currentPassword: "password123", newPassword: "short" } })).status, 400);
    assert.equal((await api("POST", "/api/users/security/password", { token, body: { currentPassword: "password123", newPassword: "password123" } })).status, 400, "must differ");
    const ok = await api("POST", "/api/users/security/password", { token, body: { currentPassword: "password123", newPassword: "newpassword456" } });
    assert.equal(ok.body.message, "Password updated.");
    assert.equal((await api("POST", "/api/auth/users/login", { body: { email, password: "newpassword456" } })).status, 200);
    assert.equal((await api("POST", "/api/auth/users/login", { body: { email, password: "password123" } })).status, 401);
  });

  test("social-only accounts can set a first password", async () => {
    const social = await User.create({ name: "Social", email: "social-only@example.com", googleId: "g-123" });
    const login = await api("POST", "/api/auth/users/login", { body: { email: "social-only@example.com", password: "whatever123" } });
    assert.equal(login.status, 400, "no password yet");
    const { createAccessToken } = await import("../src/auth/shared/services/tokens.js");
    const token = createAccessToken(social);
    const res = await api("POST", "/api/users/security/password", { token, body: { newPassword: "firstpassword1" } });
    assert.equal(res.body.message, "Password set.");
    assert.equal((await api("POST", "/api/auth/users/login", { body: { email: "social-only@example.com", password: "firstpassword1" } })).status, 200);
  });
});

describe("saved and compare", () => {
  test("save, reject duplicates, remove by plumber or by id", async () => {
    const { token } = await newUser();
    const first = await api("POST", "/api/users/saved", { token, body: demoPlumber("1") });
    assert.equal(first.status, 201);
    assert.equal((await api("POST", "/api/users/saved", { token, body: demoPlumber("1") })).status, 409);
    await api("POST", "/api/users/saved", { token, body: demoPlumber("2") });
    assert.equal((await api("GET", "/api/users/saved", { token })).body.data.length, 2);
    assert.equal((await api("DELETE", "/api/users/saved/provider/company/1", { token })).status, 200);
    assert.equal((await api("DELETE", "/api/users/saved/provider/company/1", { token })).status, 404);
    const [remaining] = (await api("GET", "/api/users/saved", { token })).body.data;
    assert.equal((await api("DELETE", `/api/users/saved/${remaining._id}`, { token })).status, 200);
  });

  test("snapshot images must be http(s) URLs or site paths", async () => {
    const { token } = await newUser();
    for (const image of ["javascript:alert(1)", "//evil.example/x.png", "data:image/png;base64,AA"]) {
      assert.equal((await api("POST", "/api/users/saved", { token, body: demoPlumber("9", { image }) })).status, 400, image);
    }
  });

  test("real listings must exist and be published", async () => {
    const { token } = await newUser();
    const missing = "64b7f0c2a1b2c3d4e5f60718";
    assert.equal((await api("POST", "/api/users/saved", { token, body: demoPlumber(missing) })).status, 404);
    const { body: company } = await api("POST", "/api/auth/companies/signup", { body: { companyName: "Real Co", email: "real-co@example.com", password: "password123" } });
    const listing = (await api("POST", "/api/companies/onboarding", { token: company.token, body: { formData: { companyName: "Real Co" } } })).body.data;
    assert.equal((await api("POST", "/api/users/saved", { token, body: demoPlumber(listing._id) })).status, 201);
  });

  test("compare holds at most 3 plumbers", async () => {
    const { token } = await newUser();
    for (const id of ["1", "2", "3"]) assert.equal((await api("POST", "/api/users/compare", { token, body: demoPlumber(id) })).status, 201);
    assert.equal((await api("POST", "/api/users/compare", { token, body: demoPlumber("4") })).status, 409);
  });
});

describe("cart and checkout", () => {
  test("server calculates quantities, promo, tax, and totals", async () => {
    const { token } = await newUser();
    await api("POST", "/api/users/cart/items", { token, body: cartItem({ total: 1, subtotal: 0 }) });
    const again = await api("POST", "/api/users/cart/items", { token, body: cartItem() });
    assert.equal(again.body.data.items.length, 1, "same service merges");
    assert.equal(again.body.data.items[0].quantity, 2);

    assert.equal((await api("POST", "/api/users/cart/promo", { token, body: { code: "FREE100" } })).status, 400);
    const promo = await api("POST", "/api/users/cart/promo", { token, body: { code: "save10" } });
    assert.deepEqual(promo.body.data.summary, { itemCount: 2, subtotal: 200, promoCode: "SAVE10", discountPercent: 10, discount: 20, taxRate: 0.08, tax: 14.4, total: 194.4 });

    const id = promo.body.data.items[0]._id;
    assert.equal((await api("PATCH", `/api/users/cart/items/${id}`, { token, body: { quantity: 25 } })).status, 400);
    const updated = await api("PATCH", `/api/users/cart/items/${id}`, { token, body: { quantity: 3 } });
    assert.equal(updated.body.data.summary.subtotal, 300);
    assert.equal((await api("DELETE", `/api/users/cart/items/${id}`, { token })).body.data.items.length, 0);
  });

  test("checkout creates bookings, an invoice, a notification, and empties the cart", async () => {
    const { token } = await newUser();
    assert.equal((await api("POST", "/api/users/checkout", { token, body: { address: "1 Main St" } })).status, 400, "empty cart");
    await api("POST", "/api/users/cart/items", { token, body: cartItem({ name: "Leak repair", price: 150 }) });
    await api("POST", "/api/users/cart/items", { token, body: cartItem({ name: "Water heater", price: 50, quantity: 2 }) });
    await api("POST", "/api/users/cart/promo", { token, body: { code: "WELCOME20" } });
    assert.equal((await api("POST", "/api/users/checkout", { token, body: { address: "1 Main St", scheduledDate: "2020-01-01" } })).status, 400, "past date");
    assert.equal((await api("POST", "/api/users/checkout", { token, body: {} })).status, 400, "address required");

    const res = await api("POST", "/api/users/checkout", { token, body: { address: "1 Main St", timeSlot: "Morning" } });
    assert.equal(res.status, 201);
    const { invoice, bookings } = res.body.data;
    assert.match(invoice.number, /^INV-\d{8}-[0-9A-F]{6}$/);
    assert.equal(invoice.subtotal, 250);
    assert.equal(invoice.discount, 50);
    assert.equal(invoice.total, 216);
    assert.equal(invoice.status, "pending");
    assert.equal(bookings.length, 2);

    assert.equal((await api("GET", "/api/users/cart", { token })).body.data.items.length, 0);
    const myBookings = (await api("GET", "/api/users/bookings", { token })).body.data;
    assert.ok(myBookings.every((booking) => booking.source === "checkout" && booking.invoice === invoice._id && booking.address === "1 Main St"));
    assert.equal((await api("GET", `/api/users/invoices/${invoice._id}`, { token })).body.data.number, invoice.number);
    const notes = (await api("GET", "/api/users/notifications", { token })).body;
    assert.equal(notes.data[0].type, "order");
    assert.equal(notes.unreadCount, 1);
  });
});

describe("bookings and notifications", () => {
  test("booking requests can be created and cancelled once; others cannot touch them", async () => {
    const { token } = await newUser();
    const other = await newUser();
    assert.equal((await api("POST", "/api/users/bookings", { token, body: { providerType: "company", providerId: "1", providerName: "Demo", service: "Repair", scheduledDate: "2020-05-01" } })).status, 400, "past date");
    const created = await api("POST", "/api/users/bookings", { token, body: { providerType: "company", providerId: "1", providerName: "Demo", service: "Repair", scheduledDate: `${nextYear}-03-01`, status: "completed" } });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.status, "pending", "customers cannot set the status");
    const id = created.body.data._id;

    assert.equal((await api("GET", `/api/users/bookings/${id}`, { token: other.token })).status, 404);
    assert.equal((await api("PATCH", `/api/users/bookings/${id}/cancel`, { token: other.token })).status, 404);
    assert.equal((await api("PATCH", `/api/users/bookings/${id}/cancel`, { token })).body.data.status, "cancelled");
    assert.equal((await api("PATCH", `/api/users/bookings/${id}/cancel`, { token })).status, 409);
    assert.equal((await api("GET", "/api/users/bookings?status=cancelled", { token })).body.data.length, 1);
    assert.equal((await api("GET", "/api/users/bookings?status=pending", { token })).body.data.length, 0);
  });

  test("notifications can be read, read-all, and deleted by their owner only", async () => {
    const { token } = await newUser();
    const other = await newUser();
    for (const service of ["A", "B"]) await api("POST", "/api/users/bookings", { token, body: { providerType: "company", providerId: "1", providerName: "Demo", service } });
    let list = (await api("GET", "/api/users/notifications", { token })).body;
    assert.equal(list.unreadCount, 2);
    const [first] = list.data;
    assert.equal((await api("PATCH", `/api/users/notifications/${first._id}/read`, { token: other.token })).status, 404);
    assert.equal((await api("PATCH", `/api/users/notifications/${first._id}/read`, { token })).body.data.read, true);
    assert.equal((await api("GET", "/api/users/notifications?unread=true", { token })).body.data.length, 1);
    await api("POST", "/api/users/notifications/read-all", { token });
    list = (await api("GET", "/api/users/notifications", { token })).body;
    assert.equal(list.unreadCount, 0);
    assert.equal((await api("DELETE", `/api/users/notifications/${first._id}`, { token })).status, 200);
    assert.equal((await api("GET", "/api/users/notifications", { token })).body.data.length, 1);
  });
});

describe("payment methods", () => {
  test("stores only card display details, keeps one default, rejects expired cards", async () => {
    const { token } = await newUser();
    const first = await api("POST", "/api/users/payment-methods", { token, body: { brand: "visa", last4: "4242", expMonth: 12, expYear: nextYear, cardNumber: "4242424242424242", cvc: "123" } });
    assert.equal(first.status, 201);
    assert.equal(first.body.data.isDefault, true, "first card is the default");
    assert.equal(first.body.data.cardNumber, undefined);
    assert.equal(first.body.data.cvc, undefined);

    const second = await api("POST", "/api/users/payment-methods", { token, body: { brand: "mastercard", last4: "4444", expMonth: 1, expYear: nextYear, isDefault: true } });
    const all = (await api("GET", "/api/users/payment-methods", { token })).body.data;
    assert.deepEqual(all.filter((card) => card.isDefault).map((card) => card._id), [second.body.data._id]);

    assert.equal((await api("POST", "/api/users/payment-methods", { token, body: { brand: "visa", last4: "4242424242424242", expMonth: 12, expYear: nextYear } })).status, 400, "full number in last4");
    assert.equal((await api("POST", "/api/users/payment-methods", { token, body: { brand: "visa", last4: "1111", expMonth: 1, expYear: 2020 } })).status, 400, "expired");
    assert.equal((await api("PATCH", `/api/users/payment-methods/${first.body.data._id}`, { token, body: { expYear: 2020 } })).status, 400, "expired via partial update");
  });
});

describe("dashboard summary", () => {
  test("counts reflect the customer's data", async () => {
    const { token } = await newUser();
    await api("POST", "/api/users/saved", { token, body: demoPlumber("1") });
    await api("POST", "/api/users/compare", { token, body: demoPlumber("1") });
    await api("POST", "/api/users/cart/items", { token, body: cartItem({ quantity: 3 }) });
    await api("POST", "/api/users/bookings", { token, body: { providerType: "company", providerId: "1", providerName: "Demo", service: "Repair" } });
    const { counts, upcomingBookings, recentNotifications } = (await api("GET", "/api/users/dashboard", { token })).body.data;
    assert.deepEqual(counts, { cart: 3, saved: 1, compare: 1, activeBookings: 1, completedBookings: 0, unreadNotifications: 1, pendingInvoices: 0 });
    assert.equal(upcomingBookings.length, 1);
    assert.equal(recentNotifications.length, 1);
  });
});
