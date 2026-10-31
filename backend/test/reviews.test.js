// PlumberFinder reviews (customers → companies/freelancers) and Google Business Profile reviews, kept apart.
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { resetAdminLoginRateLimit } = await import("../src/auth/admin/middleware/adminLoginRateLimit.js");
const { googleHttp } = await import("../src/reviews/google.js");
const { CustomerReview } = await import("../src/reviews/models.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());
beforeEach(() => resetAdminLoginRateLimit());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
const newCustomer = async (name = "Rae") => { const n = ++seq; return { ...(await signup("users", { name: `${name} Reviewer${n}`, email: `rev${n}@example.com` })), name: `${name} Reviewer${n}` }; };
async function newCompany() {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Rated Co ${n}`, email: `rated${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Rated Co ${n}` } } })).body.data;
  return { token, id: listing._id, name: `Rated Co ${n}` };
}
async function newAdmin() {
  const email = `revadmin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  return (await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).body.token;
}
const good = (extra = {}) => ({ rating: 5, title: "Fast and tidy", body: "Arrived on time and fixed the leak under the sink.", serviceCategory: "Leak repair", ...extra });
const write = (company, token, body) => api("POST", `/api/reviews/company/${company.id}`, { token, body });
const list = (company, query = "", token) => api("GET", `/api/reviews/company/${company.id}${query}`, { token });

describe("PlumberFinder reviews", () => {
  test("customers write one review per plumber; the rating, count, and distribution follow", async () => {
    const company = await newCompany();
    const [ana, ben, cal] = [await newCustomer("Ana"), await newCustomer("Ben"), await newCustomer("Cal")];
    assert.equal((await write(company, null, good())).status, 401, "signed-in customers only");
    assert.equal((await write(company, company.token, good())).status, 403, "plumbers can't review");
    assert.equal((await write(company, ana.token, good({ rating: 6 }))).status, 400);
    assert.equal((await write(company, ana.token, good({ body: "Too short" }))).status, 400);
    assert.equal((await write(company, ana.token, good({ serviceCategory: "Painting" }))).status, 400);
    const first = await write(company, ana.token, good());
    assert.equal(first.status, 201);
    assert.equal((await write(company, ana.token, good({ title: "Again" }))).status, 409, "one review per plumber");
    await write(company, ben.token, good({ rating: 3, title: "Okay", body: "Did the job but arrived an hour late." }));
    await write(company, cal.token, good({ rating: 4, title: "Good", body: "Solid work on our water heater, fair price." }));

    const res = (await list(company)).body;
    assert.deepEqual([res.summary.average, res.summary.count, res.summary.distribution], [4, 3, { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 }]);
    assert.equal(res.data[0].author.name, `Cal R.`, "last names are shortened");
    assert.deepEqual((await list(company, "?sort=lowest")).body.data.map((r) => r.rating), [3, 4, 5]);
    assert.deepEqual((await list(company, "?rating=5")).body.data.map((r) => r.rating), [5]);
    assert.equal((await list(company, "", ana.token)).body.mine.title, "Fast and tidy");
    // Cards and the profile use the same rating.
    const card = (await api("GET", "/api/companies/public")).body.data.find((item) => item._id === company.id);
    assert.deepEqual([card.rating, card.reviewCount], [4, 3]);
    const profile = (await api("GET", `/api/companies/public/${company.id}/profile`)).body.data;
    assert.equal(profile.reviews.length, 3);
    // The company is told about each new review.
    const notes = (await api("GET", "/api/companies/notifications", { token: company.token })).body.data.map((n) => n.title);
    assert.ok(notes.includes("New 5★ review") && notes.includes("New 3★ review"));

    // Edit and delete: only the author.
    const id = first.body.data._id;
    assert.equal((await api("PATCH", `/api/reviews/item/${id}`, { token: ben.token, body: { rating: 1 } })).status, 404);
    const edited = await api("PATCH", `/api/reviews/item/${id}`, { token: ana.token, body: { rating: 4, body: "Arrived on time and fixed the leak. A little pricey." } });
    assert.deepEqual([edited.body.data.rating, edited.body.data.edited], [4, true]);
    assert.equal((await api("DELETE", `/api/reviews/item/${id}`, { token: ana.token })).status, 200);
    assert.deepEqual([(await list(company)).body.summary.count, (await list(company)).body.summary.average], [2, 3.5]);
  });

  test("a booking reference links the review; a completed booking makes it 'verified'; one review per booking", async () => {
    const company = await newCompany();
    const ana = await newCustomer();
    const booking = (await api("POST", "/api/users/bookings", { token: ana.token, body: { providerType: "company", providerId: company.id, providerName: company.name, service: "Leak repair", scheduledDate: new Date(Date.now() + 864e5).toISOString().slice(0, 10) } })).body.data;
    assert.equal((await write(company, ana.token, good({ bookingReference: "BK-AAAAAA" }))).status, 400, "the booking must be the customer's own, with this plumber");
    await api("PATCH", `/api/companies/bookings/${booking._id}/accept`, { token: company.token, body: {} });
    await api("PATCH", `/api/companies/bookings/${booking._id}/complete`, { token: company.token, body: {} });
    const res = await write(company, ana.token, good({ bookingReference: booking.reference.toLowerCase() }));
    assert.deepEqual([res.status, res.body.data.verified], [201, true]);
  });

  test("spam protection: links are held for moderation, daily limit, no copy-pasted reviews", async () => {
    const companies = [await newCompany(), await newCompany(), await newCompany(), await newCompany(), await newCompany(), await newCompany(), await newCompany()];
    const spammer = await newCustomer();
    const held = await write(companies[0], spammer.token, good({ body: "Great plumber, also visit https://cheap-deals.example for offers!" }));
    assert.deepEqual([held.status, held.body.data.status], [201, "pending"]);
    assert.equal((await list(companies[0])).body.summary.count, 0, "held reviews don't count or show");
    assert.equal((await write(companies[1], spammer.token, good({ body: "Great plumber, also visit https://cheap-deals.example for offers!" }))).status, 409, "the same text again");
    for (let i = 1; i <= 4; i++) assert.equal((await write(companies[i], spammer.token, good({ body: `Honest review number ${i} about a really good plumber.` }))).status, 201);
    assert.equal((await write(companies[5], spammer.token, good({ body: "One more review today about another plumber here." }))).status, 429);
  });

  test("owners reply publicly and report reviews, but can't change them; three reports hold a review; admins moderate", async () => {
    const company = await newCompany();
    const ana = await newCustomer();
    const review = (await write(company, ana.token, good({ rating: 2, title: "Late", body: "They were two hours late and did not call ahead." }))).body.data;
    // The inbox.
    const inbox = (await api("GET", "/api/companies/reviews", { token: company.token })).body;
    assert.deepEqual([inbox.summary.count, inbox.summary.unanswered, inbox.data[0].author.name], [1, 1, ana.name], "owners see the full name");
    assert.equal((await api("PUT", `/api/companies/reviews/${review._id}`, { token: company.token, body: { rating: 5 } })).status, 404, "no way to edit a customer's review");
    const reply = await api("PUT", `/api/companies/reviews/${review._id}/reply`, { token: company.token, body: { body: "Sorry about the delay — traffic was terrible. We've changed our scheduling." } });
    assert.equal(reply.status, 200);
    assert.match((await list(company)).body.data[0].reply.body, /changed our scheduling/);
    assert.ok((await api("GET", "/api/users/notifications", { token: ana.token })).body.data.some((n) => /replied to your review/.test(n.title)));
    const other = await newCompany();
    assert.equal((await api("PUT", `/api/companies/reviews/${review._id}/reply`, { token: other.token, body: { body: "Not mine" } })).status, 404, "only the reviewed company");

    // Reports: once per person; the third different person holds it.
    assert.equal((await api("POST", `/api/companies/reviews/${review._id}/report`, { token: company.token, body: { reason: "fake" } })).status, 201);
    assert.equal((await api("POST", `/api/companies/reviews/${review._id}/report`, { token: company.token, body: { reason: "fake" } })).status, 409);
    assert.equal((await api("POST", `/api/reviews/item/${review._id}/report`, { token: ana.token, body: { reason: "spam" } })).status, 400, "not your own");
    for (const reporter of [await newCustomer(), await newCustomer()]) await api("POST", `/api/reviews/item/${review._id}/report`, { token: reporter.token, body: { reason: "offensive" } });
    assert.equal((await CustomerReview.findById(review._id)).status, "pending");
    assert.equal((await list(company)).body.summary.count, 0);

    // Admin: the queue, then publish again (or hide).
    const admin = await newAdmin();
    const queue = (await api("GET", "/api/admin/reviews?status=pending", { token: admin })).body;
    const item = queue.data.find((r) => r._id === review._id);
    assert.equal(item.reports.length, 3);
    assert.equal((await api("PATCH", `/api/admin/reviews/${review._id}`, { token: admin, body: { status: "published" } })).status, 200);
    assert.equal((await list(company)).body.summary.count, 1);
    await api("PATCH", `/api/admin/reviews/${review._id}`, { token: admin, body: { status: "hidden", reason: "Personal information" } });
    assert.equal((await list(company)).body.summary.count, 0);
    assert.equal((await api("PATCH", `/api/reviews/item/${review._id}`, { token: ana.token, body: { rating: 5 } })).status, 409, "a removed review can't be edited back");
  });

  test("freelancers and sample plumbers have PlumberFinder reviews too", async () => {
    const { token } = await signup("freelancers", { name: "Rev Fran", email: `revfran${++seq}@example.com` });
    await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: `Rev Fran ${seq}` } });
    const listing = (await api("GET", "/api/freelancers/public")).body.data.find((l) => l.displayName === `Rev Fran ${seq}`);
    const ana = await newCustomer();
    assert.equal((await api("POST", `/api/reviews/freelancer/${listing._id}`, { token: ana.token, body: good() })).status, 201);
    assert.equal((await api("GET", "/api/freelancers/reviews", { token })).body.summary.count, 1);
    assert.equal((await api("POST", "/api/reviews/company/1", { token: ana.token, body: good({ body: "Quick response and a fair price for the repair." }) })).status, 201);
    assert.equal((await api("GET", "/api/reviews/company/1")).body.summary.count, 1);
  });
});

describe("Google reviews", () => {
  test("not connected, links only, and Google content through the Places API — never mixed into PlumberFinder ratings", async () => {
    const company = await newCompany();
    const google = (await api("GET", `/api/reviews/company/${company.id}/google`)).body.data;
    assert.deepEqual([google.connected, google.available], [false, false]);

    // The owner adds their Google link (only Google links) and Place ID.
    assert.equal((await api("PUT", "/api/companies/reviews/google", { token: company.token, body: { profileUrl: "https://evil.example.com/maps" } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/reviews/google", { token: company.token, body: { placeId: "not a place id!" } })).status, 400);
    delete process.env.GOOGLE_PLACES_API_KEY;
    let saved = (await api("PUT", "/api/companies/reviews/google", { token: company.token, body: { profileUrl: "https://maps.app.goo.gl/AbCdEf123" } })).body.data;
    assert.deepEqual([saved.connected, saved.available, saved.reason, saved.writeUrl], [true, false, "no_place_id", "https://maps.app.goo.gl/AbCdEf123"]);
    saved = (await api("PUT", "/api/companies/reviews/google", { token: company.token, body: { profileUrl: "https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4" } })).body.data;
    assert.deepEqual([saved.placeId, saved.reason, saved.writeUrl], ["ChIJN1t_tDeuEmsRUsoyG83frY4", "api_not_configured", "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4"], "the Place ID is read from the link");
    assert.equal((await api("POST", "/api/companies/reviews/google/search", { token: company.token, body: { query: "Rated Co Austin" } })).status, 503);

    // With an API key: Google's rating, count, and reviews (simulated Places API), refreshed at most daily.
    process.env.GOOGLE_PLACES_API_KEY = "test-key";
    const realFetch = googleHttp.fetch;
    let calls = 0;
    googleHttp.fetch = async (url, init) => {
      calls += 1;
      assert.equal(init.headers["X-Goog-Api-Key"], "test-key");
      if (String(url).endsWith(":searchText")) return new Response(JSON.stringify({ places: [{ id: "ChIJN1t_tDeuEmsRUsoyG83frY4", displayName: { text: "Rated Co" }, formattedAddress: "1 Main St, Austin", rating: 4.6, userRatingCount: 87 }] }), { status: 200 });
      return new Response(JSON.stringify({ displayName: { text: "Rated Co" }, rating: 4.6, userRatingCount: 87, googleMapsUri: "https://maps.google.com/?cid=123", reviews: [{ rating: 5, text: { text: "Excellent service" }, relativePublishTimeDescription: "a week ago", authorAttribution: { displayName: "Jo G.", uri: "https://www.google.com/maps/contrib/1" } }] }), { status: 200 });
    };
    try {
      const refreshed = (await api("POST", "/api/companies/reviews/google/refresh", { token: company.token })).body.data;
      assert.deepEqual([refreshed.available, refreshed.rating, refreshed.count, refreshed.reviews[0].author.name, refreshed.readUrl], [true, 4.6, 87, "Jo G.", "https://maps.google.com/?cid=123"]);
      const before = calls;
      const publicGoogle = (await api("GET", `/api/reviews/company/${company.id}/google`)).body.data;
      assert.equal(publicGoogle.reviews[0].text, "Excellent service");
      assert.equal(calls, before, "served from the day's data, not a new Google call");
      const found = (await api("POST", "/api/companies/reviews/google/search", { token: company.token, body: { query: "Rated Co Austin" } })).body.data;
      assert.equal(found[0].placeId, "ChIJN1t_tDeuEmsRUsoyG83frY4");
      // Google's numbers never touch the PlumberFinder rating.
      const pf = (await list(company)).body.summary;
      assert.deepEqual([pf.count, pf.average], [0, 0]);
      // Google errors: nothing stale or invented is shown.
      googleHttp.fetch = async () => new Response(JSON.stringify({ error: { message: "API key not valid" } }), { status: 400 });
      const failed = (await api("POST", "/api/companies/reviews/google/refresh", { token: company.token })).body.data;
      assert.deepEqual([failed.available, failed.reason, failed.rating], [false, "google_error", undefined]);
    } finally {
      googleHttp.fetch = realFetch;
      delete process.env.GOOGLE_PLACES_API_KEY;
    }
    // Removing the link.
    assert.equal((await api("PUT", "/api/companies/reviews/google", { token: company.token, body: {} })).body.data.connected, false);
  });
});
