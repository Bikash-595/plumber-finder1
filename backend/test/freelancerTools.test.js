// Freelancers get the same business tools as companies: dashboard, analytics, settings, leads, jobs,
// schedule, customers, quotes, availability, saved replies, contact, map location and documents.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
async function newFreelancer() {
  const n = ++seq;
  const email = `ftool${n}@example.com`;
  const { token } = await signup("freelancers", { name: `Fiona Fix ${n}`, email });
  await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: `Fiona Fix ${n}` } });
  const listing = (await api("GET", "/api/freelancers/public")).body.data.find((l) => l.displayName === `Fiona Fix ${n}`);
  return { token, id: listing._id, name: `Fiona Fix ${n}`, email };
}
const newCustomer = async () => { const n = ++seq; return signup("users", { name: `Cal Customer${n}`, email: `ftcus${n}@example.com` }); };
const day = (offset) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);
const book = (fl, customer, service = "Leak repair", date = day(7)) => api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "freelancer", providerId: fl.id, providerName: fl.name, service, scheduledDate: date, phone: "512-555-0100", address: "1 Main St" } });
const act = (fl, booking, action, body = {}) => api("PATCH", `/api/freelancers/bookings/${booking._id}/${action}`, { token: fl.token, body });

describe("freelancer dashboard and analytics", () => {
  test("home, profile strength and analytics come from the freelancer's own records", async () => {
    const fl = await newFreelancer();
    const customer = await newCustomer();
    const booking = (await book(fl, customer)).body.data;
    await api("POST", "/api/activity", { token: customer.token, body: { providerType: "freelancer", providerId: fl.id, event: "profile_view" } });
    const home = (await api("GET", "/api/freelancers/dashboard", { token: fl.token })).body.data;
    assert.equal(home.account.companyName, fl.name);
    assert.equal(home.account.status, "pending");
    assert.equal(home.listing.url, `/plumber/${fl.id}`);
    assert.equal(home.actions.pendingRequests, 1);
    assert.equal(home.pending[0].reference, booking.reference);
    assert.equal(home.kpis.views.value, 1);
    const strength = (await api("GET", "/api/freelancers/dashboard/strength", { token: fl.token })).body.data;
    assert.ok(strength.items.every((item) => item.href.startsWith("/freelancer/business-profile/")));
    assert.equal(strength.items.reduce((sum, item) => sum + item.weight, 0), 100);
    const analytics = (await api("GET", "/api/freelancers/analytics?days=30", { token: fl.token })).body.data;
    assert.deepEqual([analytics.kpis.requests.value, analytics.hasListing], [1, true]);
    assert.equal((await api("GET", "/api/companies/dashboard", { token: fl.token })).status, 403, "the company dashboard stays company-only");
    const other = await newFreelancer();
    assert.equal((await api("GET", "/api/freelancers/dashboard", { token: other.token })).body.data.actions.pendingRequests, 0, "only your own bookings");
  });
});

describe("freelancer settings", () => {
  test("email preferences are honoured; changing the password signs out other devices", async () => {
    const fl = await newFreelancer();
    const settings = (await api("GET", "/api/freelancers/settings", { token: fl.token })).body.data;
    assert.deepEqual([settings.account.companyName, settings.account.email, settings.preferences.emailNewBooking], [fl.name, fl.email, true]);
    assert.equal((await api("PUT", "/api/freelancers/settings/preferences", { token: fl.token, body: { emailNewBooking: false } })).body.data.emailNewBooking, false);
    assert.equal((await api("POST", "/api/freelancers/settings/password", { token: fl.token, body: { currentPassword: "wrong", newPassword: "BetterPass2026" } })).status, 400);
    const changed = await api("POST", "/api/freelancers/settings/password", { token: fl.token, body: { currentPassword: "password123", newPassword: "BetterPass2026" } });
    assert.equal(changed.status, 200);
    assert.equal((await api("GET", "/api/freelancers/settings", { token: fl.token })).status, 401, "the old token stops working");
    assert.equal((await api("GET", "/api/freelancers/settings", { token: changed.body.data.token })).status, 200, "this device keeps working");
  });
});

describe("freelancer operations and growth", () => {
  test("leads, jobs with notes, schedule, customers, quotes", async () => {
    const fl = await newFreelancer();
    const customer = await newCustomer();
    const a = (await book(fl, customer, "Water heater")).body.data;
    await book(fl, customer, "Drain cleaning");
    await act(fl, a, "accept");
    const leads = (await api("GET", "/api/freelancers/leads", { token: fl.token })).body;
    assert.deepEqual(leads.counts, { new: 1, won: 1, lost: 0 });
    const jobs = (await api("GET", "/api/freelancers/jobs", { token: fl.token })).body;
    assert.deepEqual(jobs.data.map((j) => j.service), ["Water heater"]);
    assert.equal((await api("POST", `/api/freelancers/jobs/${a._id}/notes`, { token: fl.token, body: { body: "Bring a 50-gallon tank." } })).status, 201);
    assert.equal((await api("GET", `/api/freelancers/jobs/${a._id}`, { token: fl.token })).body.data.notes.length, 1);
    assert.equal((await api("PATCH", `/api/freelancers/jobs/${a._id}/assign`, { token: fl.token, body: { memberId: null } })).status, 404, "no team assignment for freelancers");
    const week = (await api("GET", `/api/freelancers/schedule?from=${day(0)}&to=${day(14)}`, { token: fl.token })).body.data;
    assert.equal(week.items.length, 2);
    const customers = (await api("GET", "/api/freelancers/customers", { token: fl.token })).body;
    assert.deepEqual([customers.total, customers.data[0].bookings, customers.data[0].contactVisible], [1, 2, true]);
    const quote = (await api("POST", "/api/freelancers/quotes", { token: fl.token, body: { bookingId: a._id, items: [{ description: "Tank", quantity: 1, unitPrice: 900 }], send: true } })).body.data;
    assert.deepEqual([quote.status, quote.total], ["sent", 900]);
    await api("POST", `/api/users/quotes/${quote._id}/accept`, { token: customer.token });
    assert.equal((await api("GET", `/api/users/bookings/${a._id}`, { token: customer.token })).body.data.price, 900);
    const note = (await api("GET", "/api/freelancers/notifications", { token: fl.token })).body.data.find((n) => /accepted/.test(n.title));
    assert.match(note.link, /^\/freelancer\/quotes\?quote=/, "links to the freelancer dashboard");
    const rival = await newFreelancer();
    assert.equal((await api("GET", `/api/freelancers/jobs/${a._id}`, { token: rival.token })).status, 404);
    assert.equal((await api("GET", `/api/freelancers/quotes/${quote._id}`, { token: rival.token })).status, 404);
  });

  test("availability is enforced on freelancer bookings; saved replies are private", async () => {
    const fl = await newFreelancer();
    const customer = await newCustomer();
    await api("PUT", "/api/freelancers/availability", { token: fl.token, body: { acceptingBookings: false, pauseMessage: "On holiday until Monday" } });
    const paused = await book(fl, customer);
    assert.deepEqual([paused.status, paused.body.message], [409, "On holiday until Monday"]);
    assert.equal((await api("GET", `/api/freelancers/availability/public/${fl.id}`)).body.data.acceptingBookings, false);
    await api("PUT", "/api/freelancers/availability", { token: fl.token, body: { acceptingBookings: true, timeOff: [{ start: day(10), end: day(11) }] } });
    assert.match((await book(fl, customer, "Leak repair", day(10))).body.message, /away on that date/);
    assert.equal((await book(fl, customer, "Leak repair", day(12))).status, 201);
    assert.equal((await api("POST", "/api/freelancers/saved-replies", { token: fl.token, body: { title: "On my way", body: "Be there in 20 minutes." } })).status, 201);
    assert.equal((await api("GET", "/api/freelancers/saved-replies", { token: (await newFreelancer()).token })).body.data.length, 0);
  });
});

describe("freelancer profile: contact, map, documents, service pages", () => {
  test("contact and map location show on the public profile; documents stay private", async () => {
    const fl = await newFreelancer();
    await api("PUT", "/api/freelancers/contact", { token: fl.token, body: { primaryPhone: "(512) 555-0177", email: "fiona@fix.example", website: "https://fix.example", whatsapp: "+1 512 555 0178" } });
    await api("PUT", "/api/freelancers/location", { token: fl.token, body: { headquarters: "Austin, TX", latitude: 30.27, longitude: -97.74, serviceRadius: 20 } });
    assert.equal((await api("PUT", "/api/freelancers/location", { token: fl.token, body: { latitude: 30.2 } })).status, 400, "both or neither");
    await api("PUT", "/api/freelancers/verification", { token: fl.token, body: { license: "https://docs.example/fiona-license.pdf" } });
    const profile = (await api("GET", `/api/freelancers/public/${fl.id}/profile`)).body.data;
    assert.deepEqual([profile.phone, profile.contact.email, profile.contact.website, profile.contact.whatsapp], ["(512) 555-0177", "fiona@fix.example", "https://fix.example", "+1 512 555 0178"]);
    assert.deepEqual(profile.coordinates, { lat: 30.27, lng: -97.74 });
    assert.ok(!JSON.stringify(profile).includes("fiona-license.pdf"));
    const service = (await api("POST", "/api/freelancers/services", { token: fl.token, body: { name: "Leak Repair", priceType: "from", priceAmount: 99, overview: "Quick, tidy leak fixes.", videos: ["https://youtu.be/dQw4w9WgXcQ"] } })).body.data;
    const page = (await api("GET", `/api/freelancers/services/public/${fl.id}/${service._id}`)).body.data;
    assert.deepEqual([page.overview, page.videos.length, page.price], ["Quick, tidy leak fixes.", 1, "From $99"]);
  });
});
