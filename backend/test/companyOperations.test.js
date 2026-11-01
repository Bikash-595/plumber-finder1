// Company operations: leads, jobs (with private notes), the schedule, customers, and messages with customers.
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
  const { token } = await signup("companies", { companyName: `Ops Co ${n}`, email: `ops${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Ops Co ${n}` } } })).body.data;
  return { token, id: listing._id, name: `Ops Co ${n}` };
}
const newCustomer = async (name = "Cara") => { const n = ++seq; return { ...(await signup("users", { name: `${name} Client${n}`, email: `opscus${n}@example.com` })), email: `opscus${n}@example.com` }; };
const day = (offset) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);
const book = (company, customer, service, date = day(7)) => api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service, scheduledDate: date, phone: "512-555-0100", address: "1 Main St" } }).then((r) => r.body.data);
const act = (company, booking, action, body = {}) => api("PATCH", `/api/companies/bookings/${booking._id}/${action}`, { token: company.token, body });

describe("leads", () => {
  test("requests by stage (new, won, lost) and anonymous interest signals", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const [a, b] = [await book(company, customer, "Leak repair"), await book(company, customer, "Drain cleaning")];
    await book(company, customer, "Water heater");
    await act(company, a, "accept");
    await act(company, b, "decline", { reason: "Fully booked" });
    await api("POST", "/api/activity", { token: customer.token, body: { providerType: "company", providerId: company.id, event: "call_click" } });
    const leads = (await api("GET", "/api/companies/leads", { token: company.token })).body;
    assert.deepEqual(leads.counts, { new: 1, won: 1, lost: 1 });
    assert.equal(leads.data[0].service, "Water heater");
    assert.equal(leads.data[0].stage, "new");
    assert.ok(leads.data[0].waitingMinutes >= 0);
    assert.equal(leads.summary.winRate, 33);
    assert.equal(leads.signals.call_click, 1);
    assert.equal((await api("GET", "/api/companies/leads?stage=lost", { token: company.token })).body.data[0].service, "Drain cleaning");
    assert.equal((await api("GET", "/api/companies/leads?q=water", { token: company.token })).body.data.length, 1);
    assert.equal((await api("GET", "/api/companies/leads", { token: (await newCompany()).token })).body.counts.new, 0, "only your own leads");
  });
});

describe("jobs", () => {
  test("accepted jobs by stage, with private notes the customer never sees", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const job = await book(company, customer, "Repipe");
    await book(company, customer, "Not accepted yet");
    await act(company, job, "accept");
    await act(company, job, "start");
    const list = (await api("GET", "/api/companies/jobs", { token: company.token })).body;
    assert.deepEqual(list.data.map((j) => j.service), ["Repipe"], "requests aren't jobs until accepted");
    assert.equal(list.counts.in_progress, 1);
    assert.equal(list.data[0].phone, "512-555-0100", "contact details after accepting");

    const added = await api("POST", `/api/companies/jobs/${job._id}/notes`, { token: company.token, body: { body: "Gate code 4321. Bring 3/4 inch fittings." } });
    assert.equal(added.status, 201);
    assert.equal((await api("POST", `/api/companies/jobs/${job._id}/notes`, { token: company.token, body: { body: "" } })).status, 400);
    const detail = (await api("GET", `/api/companies/jobs/${job._id}`, { token: company.token })).body.data;
    assert.equal(detail.notes[0].body, "Gate code 4321. Bring 3/4 inch fittings.");
    const other = await newCompany();
    assert.equal((await api("GET", `/api/companies/jobs/${job._id}`, { token: other.token })).status, 404);
    assert.equal((await api("POST", `/api/companies/jobs/${job._id}/notes`, { token: other.token, body: { body: "x" } })).status, 404);
    const customerView = JSON.stringify((await api("GET", `/api/users/bookings/${job._id}`, { token: customer.token })).body);
    assert.ok(!customerView.includes("Gate code 4321"), "notes are private");
    assert.equal((await api("DELETE", `/api/companies/jobs/${job._id}/notes/${added.body.data._id}`, { token: company.token })).status, 200);
  });
});

describe("schedule", () => {
  test("bookings in a date range, with range checks", async () => {
    const company = await newCompany();
    const customer = await newCustomer();
    const soon = await book(company, customer, "Soon", day(3));
    await book(company, customer, "Later", day(40));
    await act(company, soon, "accept");
    assert.equal((await api("GET", "/api/companies/schedule", { token: company.token })).status, 400);
    assert.equal((await api("GET", `/api/companies/schedule?from=${day(0)}&to=${day(90)}`, { token: company.token })).status, 400, "at most 62 days");
    const week = (await api("GET", `/api/companies/schedule?from=${day(0)}&to=${day(6)}`, { token: company.token })).body.data;
    assert.deepEqual(week.items.map((i) => [i.service, i.status]), [["Soon", "scheduled"]]);
    const month = (await api("GET", `/api/companies/schedule?from=${day(0)}&to=${day(45)}`, { token: company.token })).body.data;
    assert.deepEqual(month.items.map((i) => i.service), ["Soon", "Later"], "requests show as tentative");
  });
});

describe("customers", () => {
  test("one row per customer with totals; contact details only after a booking is accepted", async () => {
    const company = await newCompany();
    const [ann, bob] = [await newCustomer("Ann"), await newCustomer("Bob")];
    const first = await book(company, ann, "Leak repair");
    await book(company, ann, "Drain cleaning");
    await book(company, bob, "Toilet repair");
    await act(company, first, "accept");
    const res = (await api("GET", "/api/companies/customers", { token: company.token })).body;
    assert.deepEqual([res.summary.customers, res.summary.repeat, res.total], [2, 1, 2]);
    const annRow = res.data.find((c) => c.name.startsWith("Ann"));
    const bobRow = res.data.find((c) => c.name.startsWith("Bob"));
    assert.deepEqual([annRow.bookings, annRow.contactVisible, annRow.email, annRow.phone], [2, true, ann.email, "512-555-0100"]);
    assert.deepEqual([bobRow.contactVisible, bobRow.email, bobRow.phone], [false, null, null], "not accepted yet: no contact details");
    assert.equal((await api("GET", "/api/companies/customers?sort=bookings", { token: company.token })).body.data[0].name.startsWith("Ann"), true);
    assert.equal((await api("GET", "/api/companies/customers?q=bob", { token: company.token })).body.total, 1);
    const detail = (await api("GET", `/api/companies/customers/${annRow.id}`, { token: company.token })).body.data;
    assert.equal(detail.bookings.length, 2);
    assert.equal((await api("GET", `/api/companies/customers/${annRow.id}`, { token: (await newCompany()).token })).status, 404);
  });
});

describe("messages", () => {
  test("customer and company talk about a booking; nobody else can read it", async () => {
    const company = await newCompany();
    const customer = await newCustomer("Mia");
    const booking = await book(company, customer, "Leak repair");
    const opened = await api("POST", "/api/users/messages", { token: customer.token, body: { bookingId: booking._id } });
    assert.equal(opened.status, 201);
    const id = opened.body.data._id;
    assert.equal((await api("POST", "/api/companies/messages", { token: company.token, body: { bookingId: booking._id } })).body.data._id, id, "one conversation per booking");

    assert.equal((await api("POST", `/api/users/messages/${id}`, { token: customer.token, body: { body: "" } })).status, 400);
    assert.equal((await api("POST", `/api/users/messages/${id}`, { token: customer.token, body: { body: "x".repeat(2001) } })).status, 400);
    await api("POST", `/api/users/messages/${id}`, { token: customer.token, body: { body: "Hi, is Tuesday morning OK?" } });
    await api("POST", `/api/users/messages/${id}`, { token: customer.token, body: { body: "The leak is under the kitchen sink." } });
    let inbox = (await api("GET", "/api/companies/messages", { token: company.token })).body;
    assert.deepEqual([inbox.unread, inbox.data[0].lastMessage.body], [2, "The leak is under the kitchen sink."]);
    const notes = (await api("GET", "/api/companies/notifications", { token: company.token })).body.data.filter((n) => /New message/.test(n.title));
    assert.equal(notes.length, 1, "one notification per burst");

    await api("POST", `/api/companies/messages/${id}`, { token: company.token, body: { body: "Tuesday 9am works. <script>alert(1)</script>" } });
    await api("PATCH", `/api/companies/messages/${id}/read`, { token: company.token });
    inbox = (await api("GET", "/api/companies/messages", { token: company.token })).body;
    assert.equal(inbox.unread, 0);
    const thread = (await api("GET", `/api/users/messages/${id}`, { token: customer.token })).body.data;
    assert.deepEqual(thread.messages.map((m) => m.from), ["customer", "customer", "provider"]);
    assert.equal(thread.messages[2].body, "Tuesday 9am works. <script>alert(1)</script>", "stored as plain text (shown escaped)");
    assert.equal(thread.conversation.unreadForMe, 1);
    assert.ok((await api("GET", "/api/users/notifications", { token: customer.token })).body.data.some((n) => /New message from/.test(n.title)));

    const stranger = await newCustomer("Eve");
    const rival = await newCompany();
    assert.equal((await api("GET", `/api/users/messages/${id}`, { token: stranger.token })).status, 404);
    assert.equal((await api("POST", `/api/users/messages/${id}`, { token: stranger.token, body: { body: "hi" } })).status, 404);
    assert.equal((await api("GET", `/api/companies/messages/${id}`, { token: rival.token })).status, 404);
    assert.equal((await api("POST", "/api/users/messages", { token: stranger.token, body: { bookingId: booking._id } })).status, 404, "can't open someone else's booking");

    const declined = await book(company, customer, "Gas line");
    await act(company, declined, "decline", { reason: "Not our area" });
    assert.equal((await api("POST", "/api/users/messages", { token: customer.token, body: { bookingId: declined._id } })).status, 409);
  });
});
