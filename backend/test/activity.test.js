// Plumber activity: profile visits, project views, blog reads, compare/save, contact clicks, and bookings,
// recorded per plumber and shown to admins (who booked whom, how many times, when).
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { resetAdminLoginRateLimit } = await import("../src/auth/admin/middleware/adminLoginRateLimit.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());
beforeEach(() => resetAdminLoginRateLimit());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
async function newAdmin() {
  const email = `actadmin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  return (await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).body.token;
}
async function newCompany() {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Busy Co ${n}`, email: `busy${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Busy Co ${n}` } } })).body.data;
  return { token, id: listing._id, name: `Busy Co ${n}` };
}
const newCustomer = async (name = "Cus") => { const n = ++seq; return { ...(await signup("users", { name: `${name} ${n}`, email: `cus${n}@example.com` })), name: `${name} ${n}` }; };
const track = (body, token) => api("POST", "/api/activity", { token, body });
const nextWeek = () => new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);

describe("plumber activity", () => {
  test("visits, project views, contact clicks, compare, save, blog reads, and bookings are recorded per plumber", async () => {
    const company = await newCompany();
    const admin = await newAdmin();
    const [ana, ben] = [await newCustomer("Ana"), await newCustomer("Ben")];
    const base = { providerType: "company", providerId: company.id };

    // Profile visits: once per person per 30 minutes; the plumber's own visits and bots aren't counted.
    assert.equal((await track({ ...base, event: "profile_view" }, ana.token)).status, 201);
    assert.equal((await track({ ...base, event: "profile_view" }, ana.token)).status, 200, "a refresh isn't another visit");
    await track({ ...base, event: "profile_view" }, ben.token);
    await track({ ...base, event: "profile_view", visitorId: "guest-browser-aaaa" });
    await track({ ...base, event: "profile_view" }, company.token);
    assert.equal((await api("POST", "/api/activity", { body: { ...base, event: "profile_view", visitorId: "guest-browser-bbbb" }, headers: { "User-Agent": "Googlebot" } })).body.data.recorded, false);
    assert.equal((await track({ ...base, event: "hack" }, ana.token)).status, 400);
    assert.equal((await track({ providerType: "company", providerId: "000000000000000000000000", event: "profile_view" }, ana.token)).status, 404);

    await track({ ...base, event: "project_view", target: { id: "p1", title: "Kitchen repipe" } }, ana.token);
    await track({ ...base, event: "call_click" }, ana.token);
    await track({ ...base, event: "website_click" }, ben.token);
    // Compare and save are recorded when the customer adds them (not by the page).
    assert.equal((await api("POST", "/api/users/compare", { token: ana.token, body: { ...base, name: company.name } })).status, 201);
    assert.equal((await api("POST", "/api/users/saved", { token: ben.token, body: { ...base, name: company.name } })).status, 201);
    // A blog read is recorded for the plumber who wrote it.
    const post = (await api("POST", "/api/companies/blogs", { token: company.token, body: { title: "Tips", excerpt: "x", content: "x", status: "published" } })).body.data;
    await api("POST", `/api/blogs/posts/company/${post._id}/view`, { token: ana.token });
    // Bookings: Ana twice, Ben once; the company accepts one and declines one.
    const booking = (token, service) => api("POST", "/api/users/bookings", { token, body: { ...base, providerName: company.name, service, scheduledDate: nextWeek() } });
    const first = (await booking(ana.token, "Leak repair")).body.data;
    await booking(ana.token, "Drain cleaning");
    const third = (await booking(ben.token, "Water heater")).body.data;
    await api("PATCH", `/api/companies/bookings/${first._id}/accept`, { token: company.token, body: { note: "See you then." } });
    await api("PATCH", `/api/companies/bookings/${third._id}/decline`, { token: company.token, body: { reason: "Fully booked." } });

    // The customer hears back with the company's message.
    const anaNote = (await api("GET", "/api/users/notifications", { token: ana.token })).body.data.find((n) => n.title === "Booking confirmed");
    assert.match(anaNote.message, /See you then/);
    const benNote = (await api("GET", "/api/users/notifications", { token: ben.token })).body.data.find((n) => n.title === "Booking declined");
    assert.match(benNote.message, /Fully booked/);
    // The company sees how many customers booked it, and repeat customers.
    const inbox = (await api("GET", "/api/companies/bookings", { token: company.token })).body;
    assert.deepEqual(inbox.customers, { total: 2, repeat: 1 });

    // Admin: the plumber's row.
    const list = (await api("GET", `/api/admin/activity/providers?search=${encodeURIComponent(company.name)}`, { token: admin })).body;
    const row = list.data.find((r) => r.providerId === company.id);
    assert.deepEqual(
      [row.profileViews, row.visitors, row.projectViews, row.blogReads, row.compareAdds, row.saves, row.contactClicks, row.bookings, row.customers, row.repeatCustomers, row.acceptedBookings, row.declinedBookings, row.pendingBookings],
      [3, 3, 1, 1, 1, 1, 2, 3, 2, 1, 1, 1, 1],
    );
    assert.equal(row.url, `/company/${(await api("GET", `/api/companies/public/${company.id}`)).body.data.slug}`);

    // Admin: the plumber's details — customers who booked, bookings, daily visits, timeline with names.
    const detail = (await api("GET", `/api/admin/activity/providers/company/${company.id}`, { token: admin })).body.data;
    assert.deepEqual(detail.customerList.map((c) => [c.name, c.bookings, c.accepted, c.declined]), [[ana.name, 2, 1, 0], [ben.name, 1, 0, 1]]);
    assert.deepEqual([detail.bookingList.length, detail.bookings, detail.customers], [3, 3, 2], "lists and counts both arrive");
    assert.equal(detail.daily.length, 30);
    assert.equal(detail.daily.at(-1).profileViews, 3);
    assert.equal(detail.daily.at(-1).bookings, 3);
    const events = detail.activity.map((a) => `${a.event}:${a.actor.name}`);
    assert.ok(events.includes(`compare_add:${ana.name}`) && events.includes(`save:${ben.name}`) && events.includes(`blog_read:${ana.name}`) && events.includes("profile_view:Guest visitor"));
    assert.equal(detail.activity.find((a) => a.event === "project_view").target.title, "Kitchen repipe");

    // Admin: everything, newest first; filters by event.
    const recent = (await api("GET", "/api/admin/activity/recent?event=booking", { token: admin })).body;
    assert.ok(recent.data.length >= 3 && recent.data.every((a) => a.event === "booking"));
    assert.equal((await api("GET", "/api/admin/activity/recent", { token: ana.token })).status, 403);
  });

  test("sample plumbers' activity is recorded too", async () => {
    const admin = await newAdmin();
    const customer = await newCustomer();
    assert.equal((await track({ providerType: "company", providerId: "1", providerName: "Premier New York Plumbing", event: "profile_view" }, customer.token)).status, 201);
    const row = (await api("GET", "/api/admin/activity/providers?search=Premier", { token: admin })).body.data.find((r) => r.providerId === "1");
    assert.deepEqual([row.name, row.profileViews, row.sample], ["Premier New York Plumbing", 1, true]);
  });
});
