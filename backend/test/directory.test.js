// Top 10 / Top 50 directory: search intent and URLs, ranking of real providers (limits, no duplicates, suspended and
// excluded left out, sponsored kept apart), SEO eligibility, sitemap, suggestions, and the admin settings.
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { Company } = await import("../src/auth/company/models/Company.js");
const { CompanyListing } = await import("../src/company/listing/models/CompanyListing.js");
const { resetAdminLoginRateLimit } = await import("../src/auth/admin/middleware/adminLoginRateLimit.js");
const { parseSearch } = await import("../src/directory/services/intentParser.js");
const { resetRankingIndex } = await import("../src/directory/services/rankingIndex.js");
const { clearRankingResults } = await import("../src/directory/services/rankingEngine.js");
const { resetRankingConfigCache } = await import("../src/directory/services/rankingConfig.js");

let api, stop;
after(() => stop());
beforeEach(() => resetAdminLoginRateLimit());

let seq = 0;
async function company({ name, city, state, services = ["Leak Repair"], phone, website, status }) {
  const n = ++seq;
  const { token, account } = (await api("POST", "/api/auth/companies/signup", { body: { companyName: name, email: `dir${n}@example.com`, password: "password123", zipCode: "78701" } })).body;
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: name, primaryPhone: phone ?? `555-01${String(n).padStart(2, "0")}-${String(1000 + n)}`, website: website ?? `https://co${n}.example.com` }, services: services.map((item) => ({ name: item })), locations: [{ city, state, address: `${n} Main St` }] } })).body.data;
  if (status) await Company.updateOne({ _id: account._id }, { $set: { status } });
  return { token, id: listing._id, slug: listing.slug, account: account._id };
}
const fresh = () => { resetRankingIndex(); clearRankingResults(); resetRankingConfigCache(); };
const page = async (path) => api("GET", `/api/directory/rankings/${path}`);
async function adminToken() {
  const email = `diradmin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  return (await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).body.token;
}

const ny = [];
const tx = {};
before(async () => {
  ({ api, stop } = await startTestServer());
  // 12 companies in Brooklyn, NY (5 do drain cleaning); Austin, TX: one approved, one plain, a duplicate of the plain
  // one (same phone), and a suspended one. Nothing in Wyoming.
  for (let i = 0; i < 12; i++) ny.push(await company({ name: `Kings Plumbing ${i}`, city: "Brooklyn", state: "NY", services: i < 5 ? ["Drain Cleaning", "Leak Repair"] : ["Leak Repair"] }));
  tx.approved = await company({ name: "Lone Star Pipes", city: "Austin", state: "TX", status: "approved" });
  tx.plain = await company({ name: "Austin Flow", city: "Austin", state: "Texas", phone: "512-555-0199" });
  tx.duplicate = await company({ name: "Austin Flow Plumbing LLC", city: "Austin", state: "TX", phone: "(512) 555-0199" });
  tx.suspended = await company({ name: "Shady Pipes", city: "Austin", state: "TX", status: "suspended" });
  fresh();
});

describe("search intent and URLs", () => {
  const cases = [
    ["Best plumbers in New York", { intent: "ranking", stateCode: "NY", url: "/top-10-plumbers/new-york" }],
    ["Top 10 plumbers in New York", { intent: "ranking", stateCode: "NY", rankingLimit: 10, url: "/top-10-plumbers/new-york" }],
    ["Top 50 plumbers in New York", { intent: "ranking", rankingLimit: 50, url: "/top-50-plumbers/new-york" }],
    ["Top 10 plumbers in California", { stateCode: "CA", url: "/top-10-plumbers/california" }],
    ["Top 50 plumbers in California", { url: "/top-50-plumbers/california" }],
    ["Best plumbing companies in Texas", { stateCode: "TX", url: "/top-10-plumbers/texas" }],
    ["Best plumbers in Florida", { stateCode: "FL", url: "/top-10-plumbers/florida" }],
    ["Top-rated plumbers in New Hampshire", { stateCode: "NH", url: "/top-10-plumbers/new-hampshire" }],
    ["Best emergency plumbers in New York", { intent: "service-location", service: "emergency-plumbing", url: "/top-10-emergency-plumbers/new-york" }],
    ["Best drain cleaning companies in California", { service: "drain-cleaning", url: "/top-10-drain-cleaning-companies/california" }],
    ["Plumbers in Brooklyn, NY", { intent: "location", stateCode: "NY", url: "/states/new-york?city=Brooklyn" }],
    ["Best plumbers near me", { intent: "nearby", url: "/find?near=1" }],
    ["Top 10 licensed plumbers in Los Angeles", { rankingType: "verified", stateCode: "CA", url: "/top-10-licensed-plumbers/california/los-angeles" }],
    ["Top 50 plumbing companies in Chicago", { stateCode: "IL", rankingLimit: 50, url: "/top-50-plumbers/illinois/chicago" }],
    ["Plumbers in Atlantisville", { intent: "unknown-location", url: "/find?search=Plumbers%20in%20Atlantisville" }],
    ["Plumbers in New York City", { intent: "location", stateCode: "NY", url: "/states/new-york?city=New%20York%20City" }],
    ["drain cleaning", { intent: "service", url: "/services/drain-cleaning" }],
    ["Kings Plumbing 3", { intent: "keyword" }],
  ];
  for (const [query, expected] of cases) {
    test(query, async () => {
      const result = await parseSearch(query);
      for (const [key, value] of Object.entries(expected)) assert.equal(key === "stateCode" ? result.location?.stateCode : result[key], value, `${query} → ${key}`);
    });
  }

  test("a state with no companies: the page exists but has 0 results", async () => {
    const res = await api("GET", `/api/search?q=${encodeURIComponent("Top 10 plumbers in Wyoming")}`);
    assert.deepEqual([res.body.data.url, res.body.data.results], ["/top-10-plumbers/wyoming", 0]);
  });
});

describe("Top 10 and Top 50 pages", () => {
  test("limits are respected, positions are 1..n, nothing is invented", async () => {
    const top10 = (await page("10/plumbers/new-york")).body.data;
    const top50 = (await page("50/plumbers/new-york")).body.data;
    assert.equal(top10.items.length, 10);
    assert.equal(top50.items.length, 12, "only the 12 real companies, never padded to 50");
    assert.deepEqual(top50.items.map((item) => item.position), Array.from({ length: 12 }, (_, i) => i + 1));
    assert.equal(new Set(top50.items.map((item) => item.listingId)).size, 12, "no company twice");
    assert.ok(top50.items.every((item) => ny.some((company) => company.id === item.listingId)));
    assert.deepEqual([top10.seo.isIndexable, top50.seo.isIndexable], [true, true]);
    assert.equal(top10.items[0].account, undefined, "internal ids stay private");
    assert.ok(top10.items[0].breakdown.length === 6 && typeof top10.items[0].score === "number", "every score is explained");
  });

  test("city and service pages", async () => {
    assert.equal((await page("50/plumbers/new-york/brooklyn")).body.data.items.length, 12);
    const drains = (await page("10/drain-cleaning-companies/new-york")).body.data;
    assert.equal(drains.items.length, 5);
    assert.ok(drains.items.every((item) => item.services.includes("Drain Cleaning")));
    assert.ok((await page("10/plumbers/new-york")).body.data.relatedServices.some((item) => item.slug === "drain-cleaning" && item.providers === 5));
  });

  test("Texas: suspended left out, the duplicate listing removed, verified ranks higher, too few to index", async () => {
    const data = (await page("10/plumbers/texas")).body.data;
    const ids = data.items.map((item) => item.listingId);
    assert.ok(!ids.includes(tx.suspended.id), "suspended companies never rank");
    assert.equal(ids.filter((id) => id === tx.plain.id || id === tx.duplicate.id).length, 1, "one listing per business");
    assert.equal(data.items[0].listingId, tx.approved.id, "the verified company ranks first");
    assert.equal(data.items[0].verified, true);
    assert.deepEqual([data.qualifying, data.seo.isIndexable], [2, false], "fewer than 3 → noindex");
    assert.equal((await page("50/plumbers/texas")).body.data.seo.duplicateOfTop10, true, "a Top 50 with ≤10 repeats the Top 10");
  });

  test("sponsored listings are labelled and separate from the organic order", async () => {
    await CompanyListing.updateOne({ _id: tx.plain.id }, { $set: { premium: { tier: "premium", rank: 1, until: new Date(Date.now() + 864e5) } } });
    fresh();
    const data = (await page("10/plumbers/texas")).body.data;
    assert.equal(data.sponsored[0].listingId, tx.plain.id);
    assert.equal(data.sponsored[0].premiumTier, "premium");
    assert.equal(data.items[0].listingId, tx.approved.id, "paying doesn't change the organic position");
  });

  test("unknown number, kind, state or city → 404; a real state with nobody → empty page", async () => {
    for (const path of ["25/plumbers/texas", "10/unicorns/texas", "10/plumbers/atlantis", "10/plumbers/texas/atlantisville"]) assert.equal((await page(path)).status, 404, path);
    const wy = await page("10/plumbers/wyoming");
    assert.deepEqual([wy.status, wy.body.data.items.length, wy.body.data.seo.isIndexable], [200, 0, false]);
  });

  test("sitemap lists only pages with enough real providers", async () => {
    const paths = (await api("GET", "/api/directory/sitemap")).body.data.map((item) => item.path);
    for (const path of ["/top-10-plumbers/new-york", "/top-50-plumbers/new-york", "/top-10-plumbers/new-york/brooklyn", "/top-10-drain-cleaning-companies/new-york"]) assert.ok(paths.includes(path), path);
    assert.ok(!paths.some((path) => path.includes("texas") || path.includes("wyoming")), "thin pages stay out");
    assert.equal(new Set(paths).size, paths.length, "no duplicates");
  });
});

describe("locations and suggestions", () => {
  test("all 50 states + DC, with real counts and cities", async () => {
    const states = (await api("GET", "/api/location/states")).body.data;
    assert.equal(states.length, 51);
    assert.equal(states.find((state) => state.code === "NY").providers, 12);
    assert.equal(states.find((state) => state.code === "NH").name, "New Hampshire");
    const cities = (await api("GET", "/api/location/states/new-york/cities")).body.data;
    assert.equal(cities[0].name, "Brooklyn");
    assert.ok(cities.some((city) => city.slug === "new-york-city"));
    assert.equal((await api("GET", "/api/location/states/atlantis/cities")).status, 404);
  });

  test("suggestions from real places, services and names", async () => {
    const labels = async (q) => (await api("GET", `/api/search/suggestions?q=${encodeURIComponent(q)}`)).body.data.map((item) => item.label);
    const newLabels = await labels("best plumbers in new");
    for (const name of ["New York", "New Hampshire", "New Jersey"]) assert.ok(newLabels.some((label) => label.includes(name)), name);
    assert.ok((await labels("top 10 plumbers in cal")).includes("Top 10 plumbers in California"));
    assert.ok((await labels("kings plumb")).some((label) => label.startsWith("Kings Plumbing")));
    assert.deepEqual(await labels("a"), [], "nothing for one letter");
  });
});

describe("admin: Directory & SEO", () => {
  test("only admins; settings are validated, saved with history, and change the rankings", async () => {
    assert.equal((await api("GET", "/api/admin/directory/config")).status, 401);
    assert.equal((await api("PUT", "/api/admin/directory/config", { token: ny[0].token, body: { minimumQualifyingCompanies: 1 } })).status, 403);
    const token = await adminToken();
    const config = (await api("GET", "/api/admin/directory/config", { token })).body.data;
    assert.equal(config.settings.weights.rating, 25);
    assert.equal((await api("PUT", "/api/admin/directory/config", { token, body: { weights: { rating: 500 } } })).status, 400);
    assert.equal((await api("PUT", "/api/admin/directory/config", { token, body: { weights: { rating: 0, verified: 0, jobs: 0, relevance: 0, completeness: 0, engagement: 0 } } })).status, 400);

    const saved = await api("PUT", "/api/admin/directory/config", { token, body: { minimumQualifyingCompanies: 2, exclusions: [{ providerType: "company", listingId: tx.approved.id, reason: "Under review" }] } });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.data.history[0].adminName, "Ada Admin");
    assert.equal(saved.body.data.settings.exclusions[0].name, "Lone Star Pipes");
    clearRankingResults();
    const texas = (await page("10/plumbers/texas")).body.data;
    assert.ok(!texas.items.some((item) => item.listingId === tx.approved.id), "excluded");
    const preview = (await api("GET", "/api/admin/directory/preview?state=texas", { token })).body.data;
    assert.equal(preview.excluded[0].name, "Lone Star Pipes");
    await api("PUT", "/api/admin/directory/config", { token, body: { minimumQualifyingCompanies: 3, exclusions: [] } });
  });

  test("search analytics: what was searched and what found nothing", async () => {
    await api("GET", `/api/search?log=1&q=${encodeURIComponent("Top 10 plumbers in New York")}`);
    await api("GET", `/api/search?log=1&q=${encodeURIComponent("Top 50 plumbers in Wyoming")}`);
    await api("GET", `/api/search?log=1&q=${encodeURIComponent("plumbers in atlantisville")}`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const stats = (await api("GET", "/api/admin/directory/search-stats?days=7", { token: await adminToken() })).body.data;
    assert.equal(stats.searches, 3);
    assert.deepEqual([stats.top10, stats.top50], [1, 1]);
    assert.ok(stats.states.some((row) => row.label === "New York"));
    assert.ok(stats.noResultQueries.some((row) => row.label === "top 50 plumbers in wyoming"));
    assert.ok(stats.noResultQueries.some((row) => row.label === "plumbers in atlantisville"));
  });
});
