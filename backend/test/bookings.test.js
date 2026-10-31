// Booking requests from customer to plumber (company or freelancer): accept / decline, notifications
// for every party, contact details shared only after accepting, and the admin's view.
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { resetAdminLoginRateLimit } = await import("../src/auth/admin/middleware/adminLoginRateLimit.js");
const { devOutbox } = await import("../src/auth/verification/services/mailer.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());
beforeEach(() => resetAdminLoginRateLimit());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
async function newAdmin() {
  const email = `bookadmin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  return (await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).body.token;
}
async function newCompany() {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Booked Co ${n}`, email: `bookedco${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Booked Co ${n}` } } })).body.data;
  return { token, listingId: listing._id, name: `Booked Co ${n}` };
}
async function newCustomer() {
  const n = ++seq;
  const { token } = await signup("users", { name: `Cora Customer ${n}`, email: `cora${n}@example.com` });
  return { token, name: `Cora Customer ${n}`, email: `cora${n}@example.com` };
}
const titles = async (path, token) => (await api("GET", path, { token })).body.data.map((n) => n.title);
const nextWeek = () => new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);

describe("booking requests to a company", () => {
  test("the plumber sees the customer's contact preferences; the alternate contact only after accepting", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    await api("PUT", "/api/users/profile", { token: customer.token, body: { name: "Pat", preferredContact: "sms", contactTime: "evening", language: "Spanish", alternateContactName: "Sam (tenant)", alternateContactPhone: "512-555-0142" } });
    const { body } = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.listingId, providerName: company.name, service: "Leak repair", scheduledDate: nextWeek() } });
    const find = async () => (await api("GET", "/api/companies/bookings", { token: company.token })).body.data.find((b) => b._id === body.data._id);
    assert.deepEqual((await find()).customerContact, { preferredContact: "sms", contactTime: "evening", language: "Spanish" });
    assert.equal((await api("PATCH", `/api/companies/bookings/${body.data._id}/accept`, { token: company.token, body: {} })).status, 200);
    assert.deepEqual((await find()).customerContact, { preferredContact: "sms", contactTime: "evening", language: "Spanish", alternateName: "Sam (tenant)", alternatePhone: "512-555-0142" });
  });

  test("the company accepts; everyone is notified and contact details are shared after accepting", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const admin = await newAdmin();
    const outboxBefore = devOutbox.length;

    const created = await api("POST", "/api/users/bookings", { token: customer.token, body: {
      providerType: "company", providerId: company.listingId, providerName: company.name, service: "Leak repair",
      scheduledDate: nextWeek(), timeSlot: "8:00 AM – 10:00 AM", address: "1 Main St, Austin, TX", phone: "512-555-0100", details: "Kitchen sink leaking",
    } });
    assert.equal(created.status, 201);
    const booking = created.body.data;
    assert.match(booking.reference, /^BK-[2-9A-HJ-NP-Z]{6}$/);
    assert.equal(booking.customerName, customer.name);

    // The company is asked to accept or decline (in-app and by email); admins are told too.
    const inbox = (await api("GET", "/api/companies/notifications", { token: company.token })).body;
    assert.equal(inbox.unread, 1);
    assert.equal(inbox.data[0].title, "New booking request");
    assert.equal(inbox.data[0].actionRequired, true);
    assert.match(inbox.data[0].link, new RegExp(`^/company-dashboard/bookings\\?booking=${booking._id}$`));
    assert.ok(devOutbox.slice(outboxBefore).some((mail) => mail.subject === `New booking request ${booking.reference}: Leak repair`), "the company is emailed");
    assert.ok((await titles("/api/admin/notifications", admin)).includes("New booking"));

    // Before accepting, the company sees the request but not the customer's phone, email, or address.
    let list = (await api("GET", "/api/companies/bookings?status=pending", { token: company.token })).body;
    assert.equal(list.counts.pending, 1);
    assert.equal(list.data[0].reference, booking.reference);
    assert.deepEqual([list.data[0].phone, list.data[0].address, list.data[0].customerEmail, list.data[0].contactVisible], [undefined, undefined, undefined, false]);

    // Another company can't see or answer it.
    const other = await newCompany();
    assert.equal((await api("GET", `/api/companies/bookings/${booking._id}`, { token: other.token })).status, 404);
    assert.equal((await api("PATCH", `/api/companies/bookings/${booking._id}/accept`, { token: other.token, body: {} })).status, 404);
    assert.equal((await api("PATCH", `/api/companies/bookings/${booking._id}/accept`, { token: customer.token, body: {} })).status, 403);

    const accepted = await api("PATCH", `/api/companies/bookings/${booking._id}/accept`, { token: company.token, body: { timeSlot: "10:00 AM – 12:00 PM", note: "Our plumber Sam will call before arriving." } });
    assert.equal(accepted.status, 200);
    assert.equal(accepted.body.data.status, "scheduled");
    assert.equal(accepted.body.data.timeSlot, "10:00 AM – 12:00 PM", "the company can adjust the time");
    assert.deepEqual([accepted.body.data.phone, accepted.body.data.address, accepted.body.data.customerEmail, accepted.body.data.contactVisible], ["512-555-0100", "1 Main St, Austin, TX", customer.email, true]);
    assert.equal((await api("PATCH", `/api/companies/bookings/${booking._id}/decline`, { token: company.token, body: { reason: "Too late" } })).status, 409, "an accepted booking can't be declined");

    const customerNotes = (await api("GET", "/api/users/notifications", { token: customer.token })).body.data;
    const confirmed = customerNotes.find((n) => n.title === "Booking confirmed");
    assert.match(confirmed.message, /Our plumber Sam will call/);
    assert.ok(devOutbox.some((mail) => mail.to === customer.email && /Booking confirmed/.test(mail.subject)));
    assert.equal((await api("GET", "/api/companies/notifications", { token: company.token })).body.data[0].actionRequired, false, "the prompt is answered");
    assert.ok((await titles("/api/admin/notifications", admin)).includes("Booking accepted"));

    const completed = await api("PATCH", `/api/companies/bookings/${booking._id}/complete`, { token: company.token, body: {} });
    assert.equal(completed.body.data.status, "completed");
    assert.deepEqual(completed.body.data.history.map((h) => `${h.status}:${h.by}`), ["pending:customer", "scheduled:provider", "completed:provider"]);
    list = (await api("GET", "/api/companies/bookings", { token: company.token })).body;
    assert.deepEqual([list.counts.pending, list.counts.completed], [0, 1]);
  });

  test("declining needs a reason, which the customer sees", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const { body } = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.listingId, providerName: company.name, service: "Drain cleaning" } });
    assert.equal((await api("PATCH", `/api/companies/bookings/${body.data._id}/decline`, { token: company.token, body: {} })).status, 400);
    assert.equal((await api("PATCH", `/api/companies/bookings/${body.data._id}/accept`, { token: company.token, body: {} })).status, 400, "a flexible-date booking needs a visit date to accept");
    const declined = await api("PATCH", `/api/companies/bookings/${body.data._id}/decline`, { token: company.token, body: { reason: "Fully booked this week." } });
    assert.equal(declined.body.data.status, "declined");
    assert.equal(declined.body.data.contactVisible, false);
    const note = (await api("GET", "/api/users/notifications", { token: customer.token })).body.data.find((n) => n.title === "Booking declined");
    assert.match(note.message, /Fully booked this week/);
    const mine = (await api("GET", "/api/users/bookings", { token: customer.token })).body.data[0];
    assert.deepEqual([mine.status, mine.responseNote], ["declined", "Fully booked this week."]);
  });

  test("a customer's cancellation reaches the company and admins", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const admin = await newAdmin();
    const { body } = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.listingId, providerName: company.name, service: "Water heater", scheduledDate: nextWeek() } });
    await api("PATCH", `/api/users/bookings/${body.data._id}/cancel`, { token: customer.token, body: { reason: "Fixed it myself" } });
    const companyNote = (await api("GET", "/api/companies/notifications", { token: company.token })).body.data.find((n) => n.title === "Booking cancelled");
    assert.match(companyNote.message, /Fixed it myself/);
    assert.ok((await titles("/api/admin/notifications", admin)).includes("Booking cancelled"));
    assert.equal((await api("PATCH", `/api/companies/bookings/${body.data._id}/accept`, { token: company.token, body: {} })).status, 409);
  });
});

describe("booking requests to a freelancer", () => {
  test("the freelancer gets the request and can accept it", async () => {
    const n = ++seq;
    const { token } = await signup("freelancers", { name: `Fran ${n}`, email: `bookfran${n}@example.com` });
    await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: `Fran ${n}` } });
    const listing = (await api("GET", "/api/freelancers/public")).body.data.find((item) => item.displayName === `Fran ${n}`);
    const customer = await newCustomer();
    const { body } = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "freelancer", providerId: listing._id, providerName: `Fran ${n}`, service: "Toilet repair", scheduledDate: nextWeek() } });
    const inbox = (await api("GET", "/api/freelancers/notifications", { token })).body;
    assert.equal(inbox.data[0].title, "New booking request");
    assert.match(inbox.data[0].link, /^\/freelancer\/bookings\?booking=/);
    assert.equal((await api("PATCH", `/api/freelancers/bookings/${body.data._id}/accept`, { token, body: {} })).body.data.status, "scheduled");
    // Notifications can be marked read and deleted.
    assert.equal((await api("PATCH", "/api/freelancers/notifications/read-all", { token })).status, 200);
    assert.equal((await api("GET", "/api/freelancers/notifications/unread-count", { token })).body.data.unread, 0);
    assert.equal((await api("DELETE", `/api/freelancers/notifications/${inbox.data[0]._id}`, { token })).status, 200);
  });
});

describe("admins and bookings", () => {
  test("admins see every booking with its history and can decline with a reason", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const admin = await newAdmin();
    const { body } = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.listingId, providerName: company.name, service: "Gas line check", scheduledDate: nextWeek() } });
    const list = (await api("GET", `/api/admin/bookings?search=${body.data.reference}`, { token: admin })).body;
    assert.equal(list.data.length, 1);
    assert.ok(list.counts.pending >= 1);
    const detail = (await api("GET", `/api/admin/bookings/${body.data._id}`, { token: admin })).body.data;
    assert.equal(detail.user.email, customer.email);
    assert.equal(detail.provider.hasAccount, true);
    assert.match(detail.provider.url, /^\/company\//);
    assert.equal((await api("PATCH", `/api/admin/bookings/${body.data._id}/status`, { token: admin, body: { status: "declined" } })).status, 400, "declining needs a reason");
    const declined = await api("PATCH", `/api/admin/bookings/${body.data._id}/status`, { token: admin, body: { status: "declined", note: "Outside the service area." } });
    assert.equal(declined.body.data.status, "declined");
    assert.ok((await titles("/api/companies/notifications", company.token)).includes("Booking declined by admin"));
    // Admin notifications are for admins only.
    assert.equal((await api("GET", "/api/admin/notifications", { token: company.token })).status, 403);
  });

  test("bookings for the site's sample plumbers go to admins only", async () => {
    const customer = await newCustomer();
    const admin = await newAdmin();
    const { body } = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: "1", providerName: "Demo Plumbing", service: "Leak repair" } });
    assert.equal(body.data.providerAccount, null);
    const note = (await api("GET", "/api/admin/notifications", { token: admin })).body.data.find((n) => n.message.includes(body.data.reference));
    assert.match(note.message, /sample plumber/);
  });
});

describe("older bookings", () => {
  test("bookings saved before references existed get one, plus their plumber account and history", async () => {
    const { backfillBookings } = await import("../src/shared/bookings/backfillBookings.js");
    const { UserBooking } = await import("../src/user/bookings/models/UserBooking.js");
    const company = await newCompany();
    const customer = await newCustomer();
    const { User } = await import("../src/auth/user/models/User.js");
    const user = await User.findOne({ email: customer.email }).select("_id").lean();
    const { insertedId } = await UserBooking.collection.insertOne({ user: user._id, providerType: "company", providerId: company.listingId, providerName: company.name, service: "Old job", status: "scheduled", source: "request", createdAt: new Date("2026-01-05"), updatedAt: new Date("2026-01-06") });
    assert.ok(await backfillBookings() >= 1);
    const saved = await UserBooking.findById(insertedId).lean();
    assert.match(saved.reference, /^BK-/);
    assert.equal(saved.customerName, customer.name);
    assert.deepEqual(saved.history.map((h) => `${h.status}:${h.by}`), ["pending:customer", "scheduled:system"]);
    const inbox = (await api("GET", "/api/companies/bookings?status=scheduled", { token: company.token })).body.data;
    assert.equal(inbox[0].reference, saved.reference, "the company now sees it, with contact details as it was already accepted");
    assert.equal(inbox[0].contactVisible, true);
    assert.equal(await backfillBookings(), 0, "running again changes nothing");
  });
});
