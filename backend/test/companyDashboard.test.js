// Company dashboard home, profile strength, analytics, settings, and account security.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { devOutbox } = await import("../src/auth/verification/services/mailer.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
const password = "password123";
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password, zipCode: "78701", ...body } })).body;
async function newCompany() {
  const n = ++seq;
  const email = `dash${n}@example.com`;
  const { token } = await signup("companies", { companyName: `Dash Co ${n}`, email });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Dash Co ${n}` } } })).body.data;
  return { token, id: listing._id, name: `Dash Co ${n}`, email };
}
const newCustomer = async () => { const n = ++seq; return signup("users", { name: `Cus Tomer${n}`, email: `dashcus${n}@example.com` }); };
const nextWeek = () => new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
const tinyPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

/** A booking taken to completed (accepted → done → confirmed by the customer). */
async function completedBooking(company, customer, service, price) {
  const booking = (await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service, scheduledDate: nextWeek() } })).body.data;
  for (const action of ["accept", "complete"]) await api("PATCH", `/api/companies/bookings/${booking._id}/${action}`, { token: company.token, body: {} });
  await api("PATCH", `/api/users/bookings/${booking._id}/confirm`, { token: customer.token });
  // Sample prices: bookings of live companies without a priced service have no price; set one for the revenue numbers.
  if (price) {
    const { UserBooking } = await import("../src/user/bookings/models/UserBooking.js");
    await UserBooking.updateOne({ _id: booking._id }, { $set: { price } });
  }
  return booking;
}

describe("dashboard home and profile strength", () => {
  test("strength grows as the profile is filled in; the summary counts real activity", async () => {
    const company = await newCompany();
    const empty = (await api("GET", "/api/companies/dashboard/strength", { token: company.token })).body.data;
    assert.ok(empty.percent < 40, `a new profile is weak (${empty.percent}%)`);
    assert.equal(empty.items.reduce((sum, item) => sum + item.weight, 0), 100, "weights add up to 100");
    assert.ok(empty.items.every((item) => item.href.startsWith("/company-dashboard/business-profile/")));

    for (const name of ["Drain cleaning", "Leak repair", "Water heaters"]) await api("POST", "/api/companies/services", { token: company.token, body: { name } });
    for (let i = 0; i < 4; i++) await api("POST", "/api/companies/gallery", { token: company.token, body: { media: tinyPng, caption: `Job ${i}` } });
    const fuller = (await api("GET", "/api/companies/dashboard/strength", { token: company.token })).body.data;
    assert.equal(fuller.percent, empty.percent + 22, "services (12) and photos (10)");
    assert.ok(fuller.items.find((item) => item.key === "services").done);

    const [ana, ben] = [await newCustomer(), await newCustomer()];
    for (const who of [ana, ben]) await api("POST", "/api/activity", { token: who.token, body: { providerType: "company", providerId: company.id, event: "profile_view" } });
    await api("POST", "/api/activity", { token: ana.token, body: { providerType: "company", providerId: company.id, event: "call_click" } });
    await completedBooking(company, ana, "Drain cleaning", 200);
    await api("POST", "/api/users/bookings", { token: ben.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service: "Leak repair" } });
    await api("POST", "/api/users/reviews", { token: ana.token, body: { providerType: "company", providerId: company.id, rating: 5, body: `Great drain cleaning job, very tidy (${company.id}).` } });

    const dash = (await api("GET", "/api/companies/dashboard", { token: company.token })).body.data;
    assert.deepEqual([dash.kpis.views.value, dash.kpis.visitors.value, dash.kpis.contacts.value, dash.kpis.requests.value, dash.kpis.completed.value, dash.kpis.revenue.value], [2, 2, 1, 2, 1, 200]);
    assert.deepEqual([dash.actions.pendingRequests, dash.actions.unansweredReviews], [1, 1]);
    assert.equal(dash.pending[0].service, "Leak repair");
    assert.equal(dash.reviews.platform.count, 1);
    assert.equal(dash.trend.length, 14);
    assert.equal(dash.trend.at(-1).views, 2, "today is last");
    assert.ok(dash.strength.next.length <= 3 && dash.strength.next.every((item) => !item.done));
    assert.ok(dash.notifications.length > 0);

    // Each company sees only its own numbers.
    const other = await newCompany();
    const theirs = (await api("GET", "/api/companies/dashboard", { token: other.token })).body.data;
    assert.deepEqual([theirs.kpis.views.value, theirs.kpis.requests.value, theirs.actions.pendingRequests], [0, 0, 0]);
  });
});

describe("analytics", () => {
  test("timeline, funnel, top services, weekdays and reviews for the chosen range", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    await api("POST", "/api/activity", { token: customer.token, body: { providerType: "company", providerId: company.id, event: "profile_view" } });
    await completedBooking(company, customer, "Drain cleaning", 150);
    await completedBooking(company, customer, "Drain cleaning", 250);
    await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service: "Leak repair" } });

    assert.equal((await api("GET", "/api/companies/analytics")).status, 401);
    const month = (await api("GET", "/api/companies/analytics?days=30", { token: company.token })).body.data;
    assert.equal(month.timeline.length, 30);
    assert.equal(month.granularity, "day");
    const today = month.timeline.at(-1);
    assert.deepEqual([today.views, today.bookings, today.completed, today.revenue], [1, 3, 2, 400]);
    assert.deepEqual(month.funnel.map((step) => step.value), [1, 0, 3, 2, 2]);
    assert.deepEqual([month.kpis.revenue.value, month.kpis.avgJobValue.value, month.kpis.conversionRate.value, month.kpis.acceptanceRate.value], [400, 200, 300, 100]);
    assert.deepEqual(month.topServices[0], { service: "Drain cleaning", bookings: 2, completed: 2, revenue: 400 });
    assert.equal(month.weekdays.reduce((sum, day) => sum + day.count, 0), 3);
    assert.equal(month.statuses.pending, 1);
    const year = (await api("GET", "/api/companies/analytics?days=365", { token: company.token })).body.data;
    assert.deepEqual([year.granularity, year.timeline.length, year.timeline.at(-1).bookings], ["month", 12, 3]);
    assert.equal((await api("GET", "/api/companies/analytics?days=13", { token: company.token })).body.data.days, 30, "unknown ranges fall back to 30 days");
  });
});

describe("settings and security", () => {
  test("email preferences are respected", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    assert.deepEqual((await api("GET", "/api/companies/settings", { token: company.token })).body.data.preferences, { emailNewBooking: true, emailBookingUpdates: true, emailNewReview: true });
    assert.equal((await api("PUT", "/api/companies/settings/preferences", { token: company.token, body: { emailNewBooking: false } })).body.data.emailNewBooking, false);
    const outbox = devOutbox.length;
    await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service: "Leak repair" } });
    assert.equal(devOutbox.slice(outbox).filter((mail) => mail.to === company.email).length, 0, "no booking email");
    await api("PUT", "/api/companies/settings/preferences", { token: company.token, body: { emailNewBooking: true } });
    await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service: "Drain cleaning" } });
    assert.equal(devOutbox.slice(outbox).filter((mail) => mail.to === company.email).length, 1);
    assert.equal((await api("PUT", "/api/companies/settings/account", { token: company.token, body: { phone: "drop table" } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/settings/account", { token: company.token, body: { phone: "(512) 555-0100" } })).body.data.phone, "(512) 555-0100");
  });

  test("changing the password and 'sign out everywhere' end other sessions; sign-ins are listed", async () => {
    const company = await newCompany();
    const login = async (pw = password) => api("POST", "/api/auth/companies/login", { body: { email: company.email, password: pw } });
    const laptop = (await login()).body.token;
    const settings = (await api("GET", "/api/companies/settings", { token: laptop })).body.data;
    assert.ok(settings.security.recentLogins.length >= 2, "signup and login are listed");
    assert.match(settings.security.recentLogins[0].ip, /x$|…$|unknown/, "IPs are masked");
    assert.equal(settings.security.hasPassword, true);

    const change = (token, body) => api("POST", "/api/companies/settings/password", { token, body });
    assert.equal((await change(company.token, { currentPassword: "wrong-password", newPassword: "BetterPass2026" })).status, 400);
    assert.equal((await change(company.token, { currentPassword: password, newPassword: "short1" })).status, 400, "too short");
    assert.equal((await change(company.token, { currentPassword: password, newPassword: "onlyletterslong" })).status, 400, "needs a number");
    const changed = await change(company.token, { currentPassword: password, newPassword: "BetterPass2026" });
    assert.equal(changed.status, 200);
    assert.equal((await api("GET", "/api/companies/dashboard", { token: laptop })).status, 401, "the other device is signed out");
    assert.equal((await api("GET", "/api/companies/dashboard", { token: company.token })).status, 401, "so is the old token here");
    const fresh = changed.body.data.token;
    assert.equal((await api("GET", "/api/companies/dashboard", { token: fresh })).status, 200, "this device keeps working with the new token");
    assert.equal((await login()).status, 401, "old password no longer works");
    assert.equal((await login("BetterPass2026")).status, 200);
    assert.ok((await api("GET", "/api/companies/notifications", { token: fresh })).body.data.some((n) => n.title === "Your password was changed"));

    const out = await api("POST", "/api/companies/settings/sign-out-everywhere", { token: fresh });
    assert.equal((await api("GET", "/api/companies/settings", { token: fresh })).status, 401);
    assert.equal((await api("GET", "/api/companies/settings", { token: out.body.data.token })).status, 200);
    assert.equal((await api("GET", "/api/companies/settings", { token: out.body.data.token })).body.data.account.tokenVersion, undefined);
  });

  test("password guessing is slowed down, and the API sends security headers", async () => {
    const company = await newCompany();
    for (let i = 0; i < 10; i++) assert.equal((await api("POST", "/api/auth/companies/login", { body: { email: company.email, password: `wrong-${i}` } })).status, 401);
    const blocked = await api("POST", "/api/auth/companies/login", { body: { email: company.email, password } });
    assert.equal(blocked.status, 429, "even the right password waits");
    assert.equal((await api("POST", "/api/auth/login", { body: { email: company.email, password } })).status, 429, "the unified login too");

    const { headers } = await api("GET", "/health");
    assert.equal(headers.get("x-content-type-options"), "nosniff");
    assert.equal(headers.get("x-frame-options"), "DENY");
    assert.match(headers.get("content-security-policy"), /frame-ancestors 'none'/);
    assert.equal(headers.get("x-powered-by"), null, "the server doesn't announce itself");
  });
});

describe("notifications inbox", () => {
  test("filters by type and pages with a cursor", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    for (const service of ["A", "B", "C"]) await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service } });
    await api("POST", "/api/users/reviews", { token: customer.token, body: { providerType: "company", providerId: company.id, rating: 4, body: `Solid work and fair prices overall (${company.id}).` } });
    const all = (await api("GET", "/api/companies/notifications", { token: company.token })).body;
    assert.equal(all.unread, 4);
    assert.deepEqual(all.unreadByType, { booking: 3, review: 1 });
    assert.equal((await api("GET", "/api/companies/notifications?type=review", { token: company.token })).body.data.length, 1);
    const first = (await api("GET", "/api/companies/notifications?limit=2", { token: company.token })).body;
    assert.equal(first.data.length, 2);
    assert.equal((await api("GET", `/api/companies/notifications?limit=2&cursor=${first.nextCursor}`, { token: company.token })).body.data.length, 2);
  });
});
