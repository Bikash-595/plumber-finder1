// Company growth tools: quotes, availability, saved replies, and assigning jobs to the team.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
async function newCompany() {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Grow Co ${n}`, email: `grow${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Grow Co ${n}` } } })).body.data;
  return { token, id: listing._id, name: `Grow Co ${n}` };
}
const newCustomer = async () => { const n = ++seq; return signup("users", { name: `Gina Grow${n}`, email: `growcus${n}@example.com` }); };
const day = (offset) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);
const book = (company, customer, date = day(7), service = "Repipe") => api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service, scheduledDate: date } });

describe("quotes", () => {
  test("itemised quote: server-side totals, send, customer accepts → booking price", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const booking = (await book(company, customer)).body.data;
    const items = [{ description: "Copper pipe, per metre", quantity: 12, unitPrice: 18.5 }, { description: "Labour (hours)", quantity: 6, unitPrice: 95 }];
    assert.equal((await api("POST", "/api/companies/quotes", { token: company.token, body: { items } })).status, 400, "needs a booking");
    const draft = (await api("POST", "/api/companies/quotes", { token: company.token, body: { bookingId: booking._id, title: "Kitchen repipe", items, discount: 42, taxRate: 8.25, total: 1 } })).body.data;
    assert.deepEqual([draft.status, draft.subtotal, draft.discount, draft.tax, draft.total], ["draft", 792, 42, 61.88, 811.88], "totals are computed, not trusted");
    assert.match(draft.number, /^Q-[A-Z2-9]{6}$/);
    assert.equal((await api("GET", "/api/users/quotes", { token: customer.token })).body.data.length, 0, "drafts are private");
    assert.equal((await api("PATCH", `/api/companies/quotes/${draft._id}`, { token: company.token, body: { discount: 0 } })).body.data.total, 857.34);
    const sent = await api("POST", `/api/companies/quotes/${draft._id}/send`, { token: company.token });
    assert.equal(sent.body.data.status, "sent");
    assert.equal((await api("PATCH", `/api/companies/quotes/${draft._id}`, { token: company.token, body: { discount: 10 } })).status, 409, "sent quotes are fixed");
    assert.ok((await api("GET", "/api/users/notifications", { token: customer.token })).body.data.some((n) => /New quote from/.test(n.title)));

    const other = await newCustomer();
    assert.equal((await api("POST", `/api/users/quotes/${draft._id}/accept`, { token: other.token })).status, 404);
    const accepted = await api("POST", `/api/users/quotes/${draft._id}/accept`, { token: customer.token });
    assert.equal(accepted.body.data.status, "accepted");
    const updated = (await api("GET", `/api/users/bookings/${booking._id}`, { token: customer.token })).body.data;
    assert.deepEqual([updated.price, updated.quantity], [857.34, 1]);
    assert.equal((await api("POST", `/api/users/quotes/${draft._id}/decline`, { token: customer.token })).status, 409, "answered once");
    const list = (await api("GET", "/api/companies/quotes", { token: company.token })).body;
    assert.deepEqual([list.counts.accepted, list.value.won, list.acceptanceRate], [1, 857.34, 100]);
    assert.ok((await api("GET", "/api/companies/notifications", { token: company.token })).body.data.some((n) => /accepted/.test(n.title)));
    assert.equal((await api("GET", `/api/companies/quotes/${draft._id}`, { token: (await newCompany()).token })).status, 404, "other companies can't see it");
  });

  test("expired quotes can't be accepted; withdrawn and declined quotes", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const booking = (await book(company, customer)).body.data;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const old = (await api("POST", "/api/companies/quotes", { token: company.token, body: { bookingId: booking._id, items: [{ description: "Fix", quantity: 1, unitPrice: 100 }], validUntil: yesterday, send: true } })).body.data;
    assert.equal(old.status, "expired");
    assert.equal((await api("POST", `/api/users/quotes/${old._id}/accept`, { token: customer.token })).status, 409);
    const second = (await api("POST", "/api/companies/quotes", { token: company.token, body: { bookingId: booking._id, items: [{ description: "Fix", quantity: 1, unitPrice: 120 }], send: true } })).body.data;
    assert.equal((await api("POST", `/api/companies/quotes/${second._id}/withdraw`, { token: company.token })).body.data.status, "withdrawn");
    const third = (await api("POST", "/api/companies/quotes", { token: company.token, body: { bookingId: booking._id, items: [{ description: "Fix", quantity: 1, unitPrice: 90 }], send: true } })).body.data;
    assert.equal((await api("POST", `/api/users/quotes/${third._id}/decline`, { token: customer.token, body: { reason: "Found someone closer" } })).body.data.status, "declined");
    assert.equal((await api("POST", "/api/companies/quotes", { token: company.token, body: { bookingId: booking._id, items: [] , send: true } })).status, 400, "nothing to send");
  });
});

describe("availability", () => {
  test("paused, days off, minimum notice and a daily limit are enforced when customers book", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    assert.equal((await api("GET", "/api/companies/availability", { token: company.token })).body.data.acceptingBookings, true);
    assert.equal((await book(company, customer, day(7))).status, 201, "no rules: always available");

    await api("PUT", "/api/companies/availability", { token: company.token, body: { acceptingBookings: false, pauseMessage: "Back on Monday!" } });
    const paused = await book(company, customer, day(8));
    assert.deepEqual([paused.status, paused.body.message], [409, "Back on Monday!"]);
    assert.equal((await api("GET", `/api/companies/availability/public/${company.id}`)).body.data.acceptingBookings, false);

    assert.equal((await api("PUT", "/api/companies/availability", { token: company.token, body: { timeOff: [{ start: day(10), end: day(9) }] } })).status, 400, "end before start");
    await api("PUT", "/api/companies/availability", { token: company.token, body: { acceptingBookings: true, minNoticeDays: 2, maxJobsPerDay: 1, timeOff: [{ start: day(20), end: day(22), reason: "Vacation" }] } });
    assert.match((await book(company, customer, day(1))).body.message, /2 days' notice/);
    assert.match((await book(company, customer, day(21))).body.message, /away on that date/);
    assert.equal((await book(company, customer, day(5))).status, 201);
    assert.match((await book(company, customer, day(5))).body.message, /fully booked/);
    const pub = (await api("GET", `/api/companies/availability/public/${company.id}`)).body.data;
    assert.deepEqual([pub.minNoticeDays, pub.blockedDays], [2, [day(20), day(21), day(22)]]);
  });
});

describe("saved replies and team assignment", () => {
  test("templates are private to the company; jobs can be assigned to team members", async () => {
    const company = await newCompany();
    const created = await api("POST", "/api/companies/saved-replies", { token: company.token, body: { title: "On my way", body: "Hi! I'm on my way and will be there in about 20 minutes." } });
    assert.equal(created.status, 201);
    assert.equal((await api("GET", "/api/companies/saved-replies", { token: company.token })).body.data.length, 1);
    assert.equal((await api("GET", "/api/companies/saved-replies", { token: (await newCompany()).token })).body.data.length, 0);

    const customer = await newCustomer();
    const booking = (await book(company, customer)).body.data;
    await api("PATCH", `/api/companies/bookings/${booking._id}/accept`, { token: company.token, body: {} });
    const member = (await api("POST", "/api/companies/team", { token: company.token, body: { name: "Chris Diaz", role: "Lead plumber" } })).body.data;
    assert.deepEqual((await api("GET", "/api/companies/jobs/team", { token: company.token })).body.data.map((m) => m.name), ["Chris Diaz"]);
    const rivalMember = (await api("POST", "/api/companies/team", { token: (await newCompany()).token, body: { name: "Not yours" } })).body.data;
    assert.equal((await api("PATCH", `/api/companies/jobs/${booking._id}/assign`, { token: company.token, body: { memberId: rivalMember._id } })).status, 400);
    assert.equal((await api("PATCH", `/api/companies/jobs/${booking._id}/assign`, { token: company.token, body: { memberId: member._id } })).body.data.assignedTo.name, "Chris Diaz");
    assert.equal((await api("GET", `/api/companies/jobs?assignee=${member._id}`, { token: company.token })).body.data.length, 1);
    assert.equal((await api("GET", "/api/companies/jobs?assignee=none", { token: company.token })).body.data.length, 0);
    assert.equal((await api("GET", `/api/users/bookings/${booking._id}`, { token: customer.token })).body.data.assignedTo.name, "Chris Diaz", "the customer sees who's coming");
    assert.equal((await api("PATCH", `/api/companies/jobs/${booking._id}/assign`, { token: company.token, body: { memberId: null } })).body.data.assignedTo, undefined);
  });
});
