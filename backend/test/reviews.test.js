// The review system: directory reviews, verified reviews after completed bookings (with review requests and
// reminders), provider replies, reporting and moderation, and companies' Google reviews — never mixed.
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { resetAdminLoginRateLimit } = await import("../src/auth/admin/middleware/adminLoginRateLimit.js");
const { devOutbox } = await import("../src/auth/verification/services/mailer.js");
const { googleHttp } = await import("../src/reviews/google/places.js");
const { CustomerReview, GoogleOAuthToken, ReviewAudit, ReviewRequest } = await import("../src/reviews/models/index.js");
const { processDueReviewRequests } = await import("../src/reviews/services/requests.js");
const { runReviewJobs } = await import("../src/reviews/services/scheduler.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());
beforeEach(() => resetAdminLoginRateLimit());

const HOUR = 60 * 60 * 1000;
let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
const newCustomer = async (name = "Rae") => { const n = ++seq; return { ...(await signup("users", { name: `${name} Reviewer${n}`, email: `rev${n}@example.com` })), name: `${name} Reviewer${n}`, email: `rev${n}@example.com` }; };
async function newCompany() {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Rated Co ${n}`, email: `rated${n}@example.com` });
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Rated Co ${n}` } } })).body.data;
  return { type: "company", token, id: listing._id, name: `Rated Co ${n}` };
}
async function newFreelancer() {
  const n = ++seq;
  const { token } = await signup("freelancers", { name: `Fran Fixit ${n}`, email: `fran${n}@example.com` });
  await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: `Fran Fixit ${n}` } });
  const listing = (await api("GET", "/api/freelancers/public")).body.data.find((l) => l.displayName === `Fran Fixit ${n}`);
  return { type: "freelancer", token, id: listing._id, name: `Fran Fixit ${n}` };
}
async function newAdmin() {
  const email = `revadmin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  return (await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).body.token;
}
const nextWeek = () => new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
// Each review gets its own words (identical text from different customers is held as a likely fake).
let words = 0;
const good = (extra = {}) => ({ rating: 5, title: "Fast and tidy", body: `Arrived on time and fixed the leak under the sink (job ${++words}).`, serviceCategory: "Leak repair", ...extra });
const write = (provider, token, body) => api("POST", "/api/users/reviews", { token, body: { providerType: provider.type, providerId: provider.id, ...body } });
const list = (provider, query = "", token) => api("GET", `/api/reviews/${provider.type}/${provider.id}${query}`, { token });
const area = (provider) => `/api/${provider.type === "company" ? "companies" : "freelancers"}`;
const notes = async (token, path = "/api/users/notifications") => (await api("GET", path, { token })).body.data;

/** A booking taken all the way to "the plumber says it's done". */
async function doneBooking(provider, customer) {
  const { body } = await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: provider.type, providerId: provider.id, providerName: provider.name, service: "Leak repair", scheduledDate: nextWeek() } });
  const base = `${area(provider)}/bookings/${body.data._id}`;
  assert.equal((await api("PATCH", `${base}/accept`, { token: provider.token, body: {} })).status, 200);
  assert.equal((await api("PATCH", `${base}/start`, { token: provider.token, body: {} })).body.data.status, "in_progress");
  assert.equal((await api("PATCH", `${base}/complete`, { token: provider.token, body: {} })).body.data.status, "awaiting_confirmation");
  return body.data;
}
const confirm = (booking, customer) => api("PATCH", `/api/users/bookings/${booking._id}/confirm`, { token: customer.token });

describe("directory reviews", () => {
  test("any signed-in customer can review a listed plumber once; stats are per source", async () => {
    const company = await newCompany();
    const [ana, ben] = [await newCustomer("Ana"), await newCustomer("Ben")];
    assert.equal((await write(company, null, good())).status, 401, "signed-in customers only");
    assert.equal((await write(company, company.token, good())).status, 403, "plumbers can't review");
    assert.equal((await write(company, ana.token, good({ rating: 6 }))).status, 400);
    assert.equal((await write(company, ana.token, good({ body: "Too short" }))).status, 400);
    assert.equal((await write(company, ana.token, { ...good(), title: undefined })).status, 201, "the title is optional");
    assert.equal((await write(company, ana.token, good({ body: "Second try at writing about this plumber." }))).status, 409, "one directory review per plumber");
    const second = await write(company, ben.token, good({ rating: 3, body: "Did the job but arrived an hour late." }));
    assert.deepEqual([second.body.data.source, second.body.data.verified], ["directory", false], "never verified without a booking");
    assert.equal((await write(company, ben.token, { ...good(), source: "verified_booking", verified: true, body: "Trying to sneak a verified badge onto this." })).status, 409);

    const res = (await list(company, "", ana.token)).body;
    assert.deepEqual([res.stats.platform.average, res.stats.platform.count, res.stats.directory.count, res.stats.verified.count], [4, 2, 2, 0]);
    assert.equal(res.viewer.directoryReview.rating, 5, "the visitor sees their own review");
    assert.equal(res.googleEnabled, true);
    assert.equal(res.data[0].author.name, "Ben R.", "last names are shortened");
    const card = (await api("GET", "/api/companies/public")).body.data.find((item) => item._id === company.id);
    assert.deepEqual([card.rating, card.reviewCount], [4, 2], "cards use the same platform rating");
    assert.ok((await notes(company.token, "/api/companies/notifications")).some((n) => n.type === "review" && /New 5★ review/.test(n.title)));
    // The site's sample plumbers can be reviewed too.
    assert.equal((await api("POST", "/api/users/reviews", { token: ana.token, body: { providerType: "company", providerId: "1", providerName: "Demo", ...good({ body: "Quick response and a fair price for the repair." }) } })).status, 201);
  });
});

describe("verified booking reviews", () => {
  test("job done → customer confirms → review request → verified review → reminders stop", async () => {
    const company = await newCompany();
    const customer = await newCustomer("Vic");
    const booking = await doneBooking(company, customer);
    assert.ok((await notes(customer.token)).some((n) => n.title === "Please confirm your job is done"));
    assert.equal((await write(company, customer.token, good({ bookingId: booking._id }))).status, 409, "not before the customer confirms");

    const outbox = devOutbox.length;
    const confirmed = await confirm(booking, customer);
    assert.equal(confirmed.body.data.status, "completed");
    assert.deepEqual(confirmed.body.data.history.map((h) => `${h.status}:${h.by}`), ["pending:customer", "scheduled:provider", "in_progress:provider", "awaiting_confirmation:provider", "completed:customer"]);
    assert.equal((await confirm(booking, customer)).status, 409, "only once");
    assert.ok((await notes(company.token, "/api/companies/notifications")).some((n) => n.title === "Job completion confirmed"));

    // The review request goes out straight away (in-app + email), reminders are scheduled.
    const requests = await ReviewRequest.find({ booking: booking._id }).sort({ scheduledAt: 1 }).lean();
    assert.deepEqual(requests.map((r) => `${r.kind}:${r.status}`), ["request:sent", "reminder_24h:scheduled", "reminder_72h:scheduled"]);
    const request = (await notes(customer.token)).find((n) => n.title === "Your plumbing service is completed!");
    assert.match(request.link, new RegExp(`review=${booking._id}`));
    assert.ok(devOutbox.slice(outbox).some((mail) => mail.to === customer.email && mail.subject === "Your plumbing service is completed!"));
    assert.deepEqual((await api("GET", "/api/users/reviews/eligible", { token: customer.token })).body.data.map((b) => b.reference), [booking.reference]);
    assert.equal((await api("GET", "/api/users/reviews/requests", { token: customer.token })).body.data[0].reminders, 0);
    assert.deepEqual((await list(company, "", customer.token)).body.viewer.eligibleBookings.map((b) => b._id), [booking._id]);

    // Someone else's booking, or the booking against another plumber, can't be used.
    const other = await newCustomer("Oz");
    assert.equal((await write(company, other.token, good({ bookingId: booking._id }))).status, 404);
    const elsewhere = await newCompany();
    assert.equal((await write(elsewhere, customer.token, good({ bookingId: booking._id }))).status, 400, "provider ids can't be swapped");

    const review = (await write(company, customer.token, good({ bookingId: booking._id }))).body.data;
    assert.deepEqual([review.source, review.verified, review.bookingReference], ["verified_booking", true, booking.reference]);
    assert.equal((await write(company, customer.token, good({ bookingId: booking._id, body: "Writing about the same booking twice now." }))).status, 409, "one review per booking");
    assert.equal((await write(company, customer.token, good({ body: "Overall they are a good company to work with." }))).status, 201, "a directory review as well is fine");
    const stats = (await list(company)).body.stats;
    assert.deepEqual([stats.verified.count, stats.directory.count, stats.platform.count], [1, 1, 2]);
    assert.equal((await list(company, "?source=verified_booking")).body.data.length, 1);
    assert.deepEqual((await ReviewRequest.find({ booking: booking._id, status: "cancelled" }).lean()).map((r) => r.cancelReason), ["reviewed", "reviewed"], "reminders stop");
    assert.ok((await notes(company.token, "/api/companies/notifications")).some((n) => /verified customer review/.test(n.title)));
  });

  test("reminders after 24 and 72 hours, once each, email only when allowed", async () => {
    const company = await newCompany();
    const customer = await newCustomer("Rem");
    const booking = await doneBooking(company, customer);
    await confirm(booking, customer);
    await api("PUT", "/api/users/settings", { token: customer.token, body: { emailNotifications: false } });
    const reminders = async () => (await notes(customer.token)).filter((n) => /^Reminder/.test(n.title)).length;
    const outbox = devOutbox.length;

    await processDueReviewRequests({ now: new Date(Date.now() + 23 * HOUR) });
    assert.equal(await reminders(), 0, "not yet");
    await processDueReviewRequests({ now: new Date(Date.now() + 25 * HOUR) });
    await processDueReviewRequests({ now: new Date(Date.now() + 26 * HOUR) });
    assert.equal(await reminders(), 1, "the 24-hour reminder, once");
    await Promise.all([1, 2, 3].map(() => processDueReviewRequests({ now: new Date(Date.now() + 80 * HOUR) })));
    assert.equal(await reminders(), 2, "the 72-hour reminder, once, even with runs in parallel");
    assert.equal(devOutbox.slice(outbox).filter((mail) => mail.to === customer.email).length, 0, "email notifications are off");
  });

  test("a disputed job gets no review request; an admin resolves it; unanswered jobs confirm themselves after 7 days", async () => {
    const company = await newCompany();
    const customer = await newCustomer("Dee");
    const admin = await newAdmin();
    const booking = await doneBooking(company, customer);
    assert.equal((await api("PATCH", `/api/users/bookings/${booking._id}/dispute`, { token: customer.token, body: {} })).status, 400, "a reason is needed");
    assert.equal((await api("PATCH", `/api/users/bookings/${booking._id}/dispute`, { token: customer.token, body: { reason: "The tap still drips." } })).body.data.status, "disputed");
    assert.equal(await ReviewRequest.countDocuments({ booking: booking._id }), 0);
    assert.equal((await write(company, customer.token, good({ bookingId: booking._id }))).status, 409);
    assert.ok((await notes(admin, "/api/admin/notifications")).some((n) => n.title === "Booking disputed"));
    assert.equal((await api("PATCH", `/api/companies/bookings/${booking._id}/complete`, { token: company.token, body: {} })).status, 409, "the plumber can't overrule a dispute");
    assert.equal((await api("PATCH", `/api/admin/bookings/${booking._id}/status`, { token: admin, body: { status: "completed" } })).status, 400, "resolving needs a note");
    assert.equal((await api("PATCH", `/api/admin/bookings/${booking._id}/status`, { token: admin, body: { status: "completed", note: "Checked with both — the drip was a separate fixture." } })).body.data.status, "completed");
    assert.equal(await ReviewRequest.countDocuments({ booking: booking._id }), 3, "now the review request goes out");

    const quiet = await doneBooking(company, await newCustomer("Quiet"));
    assert.equal((await runReviewJobs(new Date(Date.now() + 6 * 864e5))).confirmed, 0);
    await runReviewJobs(new Date(Date.now() + 8 * 864e5));
    const later = (await api("GET", `/api/companies/bookings/${quiet._id}`, { token: company.token })).body.data;
    assert.deepEqual([later.status, later.completionConfirmedBy, later.history.at(-1).by], ["completed", "system", "system"]);
    assert.equal(await ReviewRequest.countDocuments({ booking: quiet._id }), 3);
  });
});

describe("trust and moderation", () => {
  test("spam: links and copied text are held, daily limit", async () => {
    const company = await newCompany();
    const spammer = await newCustomer("Sam");
    const admin = await newAdmin();
    const spam = "Great plumber! Visit https://cheap-pipes.example.com for deals.";
    assert.equal((await write(company, spammer.token, good({ body: spam }))).body.data.status, "pending");
    assert.equal((await list(company)).body.stats.platform.count, 0, "held reviews don't count");
    assert.ok((await notes(admin, "/api/admin/notifications")).some((n) => n.title === "Review held for moderation"));
    const copier = await newCustomer("Cop");
    const original = "Fantastic work on our kitchen pipes, would book again.";
    await write(await newCompany(), spammer.token, good({ body: original }));
    assert.equal((await write(await newCompany(), copier.token, good({ body: original }))).body.data.status, "pending", "same words as another customer");
    for (let i = 0; i < 3; i++) await write(await newCompany(), spammer.token, good({ body: `Honest review number ${i} about a good local plumber.` }));
    assert.equal((await write(await newCompany(), spammer.token, good({ body: "One more honest review about a plumber today." }))).status, 429);
  });

  test("owners reply (customer notified) and report; three reports hold a review; admins moderate with reasons and a full history", async () => {
    const company = await newCompany();
    const ana = await newCustomer("Ana");
    const admin = await newAdmin();
    const review = (await write(company, ana.token, good({ rating: 2, body: "Left a mess and charged more than quoted." }))).body.data;
    const base = `/api/companies/reviews/${review._id}`;
    assert.equal((await api("POST", `${base}/reply`, { token: company.token, body: { body: "Sorry — we've refunded the difference." } })).status, 201);
    assert.ok((await notes(ana.token)).some((n) => /replied to your review/.test(n.title)));
    assert.equal((await api("PUT", `${base}/reply`, { token: company.token, body: { body: "Sorry — we've refunded the difference and cleaned up." } })).status, 200);
    assert.equal((await api("PATCH", `/api/users/reviews/${review._id}`, { token: company.token, body: { rating: 5 } })).status, 403, "owners can't edit reviews");
    assert.equal((await api("GET", "/api/companies/reviews/unanswered", { token: company.token })).body.total, 0);
    assert.equal((await api("GET", "/api/companies/reviews?source=directory", { token: company.token })).body.summary.directory.count, 1);

    assert.equal((await api("POST", `${base}/report`, { token: company.token, body: { reason: "fake" } })).status, 201);
    assert.ok((await notes(admin, "/api/admin/notifications")).some((n) => n.title === "Review reported"));
    for (const who of [await newCustomer("R1"), await newCustomer("R2")]) await api("POST", `/api/reviews/item/${review._id}/report`, { token: who.token, body: { reason: "spam" } });
    assert.equal((await api("GET", "/api/admin/reviews?status=pending", { token: admin })).body.data[0]._id, review._id, "held after three reports");

    assert.equal((await api("PATCH", `/api/admin/reviews/${review._id}`, { token: admin, body: { status: "hidden" } })).status, 400, "hiding needs a reason");
    assert.equal((await api("PATCH", `/api/admin/reviews/${review._id}`, { token: admin, body: { status: "published", reason: "Reports checked: genuine customer." } })).status, 200);
    assert.ok((await notes(ana.token)).some((n) => /is live again/.test(n.title)));
    assert.equal((await api("PATCH", `/api/admin/reviews/${review._id}`, { token: admin, body: { status: "rejected", reason: "x" } })).status, 409, "only held reviews are rejected");
    const history = (await api("GET", `/api/admin/reviews/${review._id}/history`, { token: admin })).body.data;
    assert.deepEqual(history.audits.map((a) => a.action), ["created", "reply", "reply", "reported", "reported", "reported", "held", "published"]);
    assert.equal(history.reports.length, 3);
    assert.equal((await api("GET", `/api/admin/reviews?source=directory&providerType=company&providerId=${company.id}&rating=2`, { token: admin })).body.total, 1);

    await api("DELETE", `/api/users/reviews/${review._id}`, { token: ana.token });
    assert.equal((await ReviewAudit.findOne({ review: review._id, action: "deleted" }).lean()).snapshot.rating, 2, "the audit keeps a copy");
  });
});

describe("freelancers", () => {
  test("directory and verified reviews, but no Google", async () => {
    const freelancer = await newFreelancer();
    const customer = await newCustomer("Fay");
    assert.equal((await write(freelancer, customer.token, good())).status, 201);
    const booking = await doneBooking(freelancer, customer);
    await confirm(booking, customer);
    assert.ok((await notes(customer.token)).some((n) => n.title === "How was your experience with your plumber?"));
    assert.equal((await write(freelancer, customer.token, good({ bookingId: booking._id, body: "Booked through the site and it went great." }))).body.data.verified, true);
    const res = (await list(freelancer)).body;
    assert.deepEqual([res.googleEnabled, res.stats.verified.count, res.stats.directory.count], [false, 1, 1]);
    assert.equal((await api("GET", `/api/reviews/freelancer/${freelancer.id}/google`)).status, 404);
    assert.equal((await api("GET", "/api/freelancers/reviews/google", { token: freelancer.token })).status, 404);
    assert.equal((await api("GET", "/api/freelancers/reviews", { token: freelancer.token })).body.summary.platform.count, 2);
  });
});

describe("Google reviews (companies)", () => {
  const PLACE = "ChIJN1t_tDeuEmsRUsoyG83frY4";
  const placeResponse = { id: PLACE, displayName: { text: "Rated Co" }, formattedAddress: "1 Main St, Austin, TX", rating: 4.6, userRatingCount: 87, googleMapsUri: "https://maps.google.com/?cid=123", reviews: [{ rating: 5, text: { text: "Excellent service" }, relativePublishTimeDescription: "a week ago", authorAttribution: { displayName: "Jo G.", uri: "https://www.google.com/maps/contrib/1" } }] };
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status });

  test("links only without an API key; matching, owner confirmation and sync with one — never mixed into PlumberFinder ratings", async () => {
    const company = await newCompany();
    const start = (await api("GET", `/api/reviews/company/${company.id}/google`)).body.data;
    assert.deepEqual([start.connected, start.available], [false, false]);
    assert.equal((await api("PUT", "/api/companies/reviews/google", { token: company.token, body: { profileUrl: "https://evil.example.com/maps" } })).status, 400);
    delete process.env.GOOGLE_PLACES_API_KEY;
    const saved = (await api("PUT", "/api/companies/reviews/google", { token: company.token, body: { profileUrl: "https://maps.app.goo.gl/AbCdEf123" } })).body.data;
    assert.deepEqual([saved.connected, saved.connectionStatus, saved.reason], [true, "link_only", "no_place_id"]);
    assert.equal((await api("GET", "/api/companies/reviews/google/matches", { token: company.token })).status, 503);

    process.env.GOOGLE_PLACES_API_KEY = "test-key";
    const realFetch = googleHttp.fetch;
    let calls = 0;
    googleHttp.fetch = async (url) => {
      calls += 1;
      if (String(url).endsWith(":searchText")) return json({ places: [{ id: "ChIJotherBusiness12345", displayName: { text: "Rated Co Plumbing (other)" }, formattedAddress: "9 Far Rd, Dallas" }, { id: PLACE, displayName: { text: "Rated Co" }, formattedAddress: "1 Main St, Austin, TX", rating: 4.6, userRatingCount: 87 }] });
      if (String(url).includes("ChIJnotreal")) return json({ error: { message: "Not found" } }, 404);
      return json(placeResponse);
    };
    try {
      const matches = (await api("GET", "/api/companies/reviews/google/matches", { token: company.token })).body.data;
      assert.equal(matches.length, 2, "candidates are shown — nothing is connected automatically");
      assert.equal((await api("GET", `/api/reviews/company/${company.id}/google`)).body.data.connectionStatus, "link_only");
      assert.equal((await api("POST", "/api/companies/reviews/google/connect", { token: company.token, body: { placeId: "ChIJnotreal12345" } })).status, 400);
      const connected = (await api("POST", "/api/companies/reviews/google/connect", { token: company.token, body: { placeId: PLACE } })).body.data;
      assert.deepEqual([connected.connectionStatus, connected.businessName, connected.rating, connected.count, connected.reviews[0].author.name], ["connected", "Rated Co", 4.6, 87, "Jo G."]);
      const before = calls;
      assert.equal((await api("GET", `/api/reviews/company/${company.id}/google`)).body.data.reviews[0].text, "Excellent service");
      assert.equal(calls, before, "served from the day's data");
      assert.ok((await runReviewJobs(new Date(Date.now() + 25 * HOUR))).google >= 1, "the scheduler refreshes stale data");
      assert.equal((await list(company)).body.stats.platform.count, 0, "Google never counts as PlumberFinder reviews");
      googleHttp.fetch = async () => json({ error: { message: "API key not valid" } }, 400);
      const failed = (await api("POST", "/api/companies/reviews/google/refresh", { token: company.token })).body.data;
      assert.deepEqual([failed.available, failed.reason, failed.rating], [false, "google_error", undefined], "nothing stale or invented");
    } finally {
      googleHttp.fetch = realFetch;
      delete process.env.GOOGLE_PLACES_API_KEY;
    }
    assert.equal((await api("DELETE", "/api/companies/reviews/google", { token: company.token })).body.data.connected, false);
  });

  test("Business Profile OAuth: state is single-use, the token is encrypted, full reviews and owner replies are used", async () => {
    const company = await newCompany();
    assert.equal((await api("POST", "/api/companies/reviews/google/oauth", { token: company.token })).status, 503, "not set up");
    Object.assign(process.env, { GOOGLE_CLIENT_SECRET: "test-secret", GOOGLE_REDIRECT_URI: "http://localhost:3300/api/companies/reviews/google/oauth/callback" });
    const realFetch = googleHttp.fetch;
    googleHttp.fetch = async (url) => {
      const u = String(url);
      if (u.startsWith("https://oauth2.googleapis.com/token")) return json({ access_token: "access-1", refresh_token: "refresh-secret-1", scope: "https://www.googleapis.com/auth/business.manage" });
      if (u.endsWith("/v1/accounts")) return json({ accounts: [{ name: "accounts/1" }] });
      if (u.includes("/accounts/1/locations?")) return json({ locations: [{ name: "locations/9", title: "Rated Co", metadata: { placeId: PLACE } }] });
      if (u.includes("/v4/accounts/1/locations/9/reviews")) return json({ averageRating: 4.71, totalReviewCount: 212, reviews: [{ starRating: "FOUR", comment: "Good work", createTime: "2026-01-02T00:00:00Z", reviewer: { displayName: "Lee" }, reviewReply: { comment: "Thanks Lee!", updateTime: "2026-01-03T00:00:00Z" } }] });
      return json({ error: { message: `unexpected ${u}` } }, 500);
    };
    try {
      await api("PUT", "/api/companies/reviews/google", { token: company.token, body: { placeId: PLACE } });
      const { url } = (await api("POST", "/api/companies/reviews/google/oauth", { token: company.token })).body.data;
      const state = new URL(url).searchParams.get("state");
      assert.match(url, /scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fbusiness.manage/);
      const callback = (value) => api("GET", `/api/companies/reviews/google/oauth/callback?code=c&state=${value}`, { redirect: "manual" });
      assert.match((await callback("forged-state-value-123456")).location, /google=error/);
      assert.match((await callback(state)).location, /google=connected/);
      assert.match((await callback(state)).location, /google=error/, "state is single-use");
      const stored = await GoogleOAuthToken.findOne({}).select("+refreshToken").lean();
      assert.ok(stored.refreshToken && !stored.refreshToken.includes("refresh-secret-1"), "stored encrypted");
      const status = (await api("GET", "/api/companies/reviews/google", { token: company.token })).body.data;
      assert.deepEqual([status.oauth.connected, status.origin, status.rating, status.count, status.reviews[0].ownerReply.text], [true, "business_profile", 4.7, 212, "Thanks Lee!"]);
      assert.equal((await api("DELETE", "/api/companies/reviews/google/oauth", { token: company.token })).body.data.oauth.connected, false);
    } finally {
      googleHttp.fetch = realFetch;
      delete process.env.GOOGLE_CLIENT_SECRET;
      delete process.env.GOOGLE_REDIRECT_URI;
    }
  });
});

test("older reviews get a source (migration)", async () => {
  const { migrateReviews } = await import("../src/reviews/services/migrations.js");
  const company = await newCompany();
  const customer = await newCustomer("Old");
  const userId = (await api("GET", "/api/users/profile", { token: customer.token })).body.data._id;
  await CustomerReview.collection.insertOne({ providerType: "company", providerId: company.id, user: CustomerReview.castObject({ user: userId }).user, rating: 4, title: "Old", body: "Written before review sources existed.", status: "published", createdAt: new Date() });
  assert.ok(await migrateReviews() >= 1);
  assert.equal((await list(company)).body.stats.directory.count, 1);
});
