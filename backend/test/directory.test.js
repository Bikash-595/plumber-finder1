// Top 10 / Top 50 directory: search intent and URLs, premium-only ranking of real providers (limits, verified premium
// first, no free listings, no duplicates, suspended / excluded / expired left out, placements kept apart), USA pages,
// SEO eligibility, page publishing and wording, sitemaps, suggestions, and the admin settings.
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
const { resetPageSettings } = await import("../src/directory/services/pageSettings.js");
const fresh = () => { resetRankingIndex(); clearRankingResults(); resetRankingConfigCache(); resetPageSettings(); };
const inDays = (days) => new Date(Date.now() + days * 864e5);
const makePremium = (id, tier = "premium", until = inDays(30)) => CompanyListing.updateOne({ _id: id }, { $set: { premium: { tier, rank: tier === "elite" ? 2 : 1, until } } });
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
  // 12 companies in Brooklyn, NY (5 do drain cleaning), 11 of them premium. Austin, TX: an approved premium company,
  // a plain premium one, a premium duplicate of it (same phone), a suspended premium one and a free one.
  // Nothing in Wyoming.
  for (let i = 0; i < 12; i++) ny.push(await company({ name: `Kings Plumbing ${i}`, city: "Brooklyn", state: "NY", services: i < 5 ? ["Drain Cleaning", "Leak Repair"] : ["Leak Repair"] }));
  tx.approved = await company({ name: "Lone Star Pipes", city: "Austin", state: "TX", status: "approved" });
  tx.plain = await company({ name: "Austin Flow", city: "Austin", state: "Texas", phone: "512-555-0199" });
  tx.duplicate = await company({ name: "Austin Flow Plumbing LLC", city: "Austin", state: "TX", phone: "(512) 555-0199" });
  tx.suspended = await company({ name: "Shady Pipes", city: "Austin", state: "TX", status: "suspended" });
  tx.free = await company({ name: "Free Flow Austin", city: "Austin", state: "TX", status: "approved" });
  for (const item of [...ny.slice(0, 11), tx.plain, tx.duplicate, tx.suspended]) await makePremium(item.id);
  await makePremium(tx.approved.id, "elite");
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
    ["Best plumbers in USA", { intent: "ranking", url: "/top-10-plumbers-usa" }],
    ["Top 50 plumbers in America", { rankingLimit: 50, url: "/top-50-plumbers-usa" }],
    ["Top 10 plumbers in the United States", { url: "/top-10-plumbers-usa" }],
    ["best drain cleaning companies nationwide", { service: "drain-cleaning", url: "/top-10-drain-cleaning-companies-usa" }],
    ["Premium plumbers in Texas", { intent: "ranking", stateCode: "TX", url: "/top-10-plumbers/texas" }],
    ["Best emergency plumbers in Brooklyn", { service: "emergency-plumbing", url: "/top-10-emergency-plumbers/new-york/brooklyn" }],
    ["Top 10 plumbers in 78701", { stateCode: "TX", url: "/top-10-plumbers/texas/austin" }],
    ["plumbers near us", { intent: "nearby" }],
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

describe("Top 10 and Top 50 pages (premium only)", () => {
  test("limits are respected, positions are 1..n, only premium, nothing is invented", async () => {
    const top10 = (await page("10/plumbers/new-york")).body.data;
    const top50 = (await page("50/plumbers/new-york")).body.data;
    assert.equal(top10.page.scope, "state");
    assert.equal(top10.items.length, 10);
    assert.equal(top50.items.length, 11, "only the 11 premium companies, never padded with free ones");
    assert.ok(!top50.items.some((item) => item.listingId === ny[11].id), "the free company is not ranked");
    assert.equal(top50.otherProviders, 1, "but it is counted for “see all plumbers”");
    assert.ok(top50.items.every((item) => item.premiumTier === "premium"));
    assert.deepEqual(top50.items.map((item) => item.position), Array.from({ length: 11 }, (_, i) => i + 1));
    assert.equal(new Set(top50.items.map((item) => item.listingId)).size, 11, "no company twice");
    assert.deepEqual([top10.seo.isIndexable, top50.seo.isIndexable], [true, true]);
    assert.equal(top10.items[0].account, undefined, "internal ids stay private");
    assert.ok(top10.items[0].breakdown.length === 6 && typeof top10.items[0].score === "number", "every score is explained");
  });

  test("city and service pages", async () => {
    const city = (await page("50/plumbers/new-york/brooklyn")).body.data;
    assert.equal(city.page.scope, "city");
    assert.equal(city.items.length, 11);
    assert.ok(city.centre && Number.isFinite(city.centre.lat), "the city page knows the city centre");
    assert.ok(city.items.every((item) => item.distanceMiles === undefined || typeof item.distanceMiles === "number"));
    const drains = (await page("10/drain-cleaning-companies/new-york")).body.data;
    assert.equal(drains.items.length, 5);
    assert.ok(drains.items.every((item) => item.services.includes("Drain Cleaning")));
    const state = (await page("10/plumbers/new-york")).body.data;
    assert.ok(state.relatedServices.some((item) => item.slug === "drain-cleaning" && item.providers === 5));
    assert.equal(state.nearby.find((item) => item.slug === "brooklyn")?.providers, 11, "cities count premium providers");
  });

  test("Texas: verified premium first, suspended / duplicate / free left out, too few to index", async () => {
    const data = (await page("10/plumbers/texas")).body.data;
    const ids = data.items.map((item) => item.listingId);
    assert.ok(!ids.includes(tx.suspended.id), "suspended companies never rank");
    assert.ok(!ids.includes(tx.free.id), "free companies never rank");
    assert.equal(ids.filter((id) => id === tx.plain.id || id === tx.duplicate.id).length, 1, "one listing per business");
    assert.equal(data.items[0].listingId, tx.approved.id, "the verified premium company ranks first");
    assert.deepEqual([data.items[0].verified, data.items[0].premiumTier], [true, "elite"]);
    assert.deepEqual([data.qualifying, data.verifiedQualifying, data.seo.isIndexable], [2, 1, false], "fewer than 3 → noindex");
    assert.equal((await page("50/plumbers/texas")).body.data.seo.duplicateOfTop10, true, "a Top 50 with ≤10 repeats the Top 10");
  });

  test("an expired plan leaves the ranking at once, even before the premium sweep runs", async () => {
    await CompanyListing.updateOne({ _id: tx.plain.id }, { $set: { "premium.until": new Date(Date.now() + 1500) } });
    await CompanyListing.updateOne({ _id: tx.duplicate.id }, { $unset: { premium: 1 } });
    fresh();
    assert.equal((await page("10/plumbers/texas")).body.data.qualifying, 2);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    clearRankingResults();
    const data = (await page("10/plumbers/texas")).body.data;
    assert.deepEqual(data.items.map((item) => item.listingId), [tx.approved.id], "the expired plan is gone");
    await makePremium(tx.plain.id);
    await makePremium(tx.duplicate.id);
    fresh();
  });

  test("USA pages rank premium providers from every state", async () => {
    const usa = (await page("10/plumbers/usa")).body.data;
    assert.equal(usa.page.scope, "usa");
    assert.deepEqual([usa.page.state, usa.page.path, usa.page.allPath], [null, "/top-10-plumbers-usa", "/find"]);
    assert.equal(usa.items.length, 10);
    assert.equal(usa.items[0].listingId, tx.approved.id, "verified premium first, nationwide");
    const top50 = (await page("50/plumbers/usa")).body.data;
    assert.equal(top50.items.length, 13, "11 in New York + 2 in Texas");
    assert.deepEqual(top50.coverage.map((item) => [item.code, item.premium]), [["NY", 11], ["TX", 3]], "coverage counts premium listings per state");
    assert.equal((await page("10/drain-cleaning-companies/usa")).body.data.items.length, 5);
    assert.equal((await page("10/plumbers/usa/brooklyn")).status, 404, "no city under usa");
  });

  test("featured and sponsored placements: chosen by an admin, scoped, dated, labelled, apart from the ranking", async () => {
    const token = await adminToken();
    const placements = [
      { providerType: "company", listingId: tx.free.id, kind: "sponsored", stateCode: "TX" },
      { providerType: "company", listingId: ny[11].id, kind: "featured", stateCode: "NY", citySlug: "brooklyn", until: inDays(5).toISOString() },
      { providerType: "company", listingId: ny[0].id, kind: "sponsored", until: inDays(-1).toISOString() },
    ];
    assert.equal((await api("PUT", "/api/admin/directory/config", { token, body: { placements: [{ providerType: "company", listingId: tx.free.id, stateCode: "ZZ" }] } })).status, 400);
    assert.equal((await api("PUT", "/api/admin/directory/config", { token, body: { placements } })).status, 200);
    clearRankingResults();
    const texas = (await page("10/plumbers/texas")).body.data;
    assert.deepEqual(texas.sponsored.map((item) => [item.listingId, item.placement]), [[tx.free.id, "sponsored"]]);
    assert.ok(!texas.items.some((item) => item.listingId === tx.free.id), "a placement never enters the ranking");
    assert.deepEqual((await page("10/plumbers/texas/austin")).body.data.sponsored.map((item) => item.listingId), [tx.free.id], "state placements show in its cities");
    assert.deepEqual((await page("10/plumbers/new-york/brooklyn")).body.data.sponsored.map((item) => item.placement), ["featured"]);
    assert.deepEqual((await page("10/plumbers/new-york")).body.data.sponsored, [], "a city placement stays in its city");
    assert.deepEqual((await page("10/plumbers/usa")).body.data.sponsored, [], "the expired USA placement is gone");
    await api("PUT", "/api/admin/directory/config", { token, body: { placements: [] } });
    clearRankingResults();
  });

  test("unknown number, kind, state or city → 404; a real state with nobody → empty page", async () => {
    for (const path of ["25/plumbers/texas", "10/unicorns/texas", "10/plumbers/atlantis", "10/plumbers/texas/atlantisville"]) assert.equal((await page(path)).status, 404, path);
    const wy = await page("10/plumbers/wyoming");
    assert.deepEqual([wy.status, wy.body.data.items.length, wy.body.data.seo.isIndexable], [200, 0, false]);
  });

  test("sitemaps list only published pages with enough premium providers, per page design", async () => {
    const paths = (await api("GET", "/api/directory/sitemap")).body.data.map((item) => item.path);
    for (const path of ["/top-10-plumbers-usa", "/top-50-plumbers-usa", "/top-10-plumbers/new-york", "/top-50-plumbers/new-york", "/top-10-plumbers/new-york/brooklyn", "/top-10-drain-cleaning-companies/new-york"]) assert.ok(paths.includes(path), path);
    assert.ok(!paths.some((path) => path.includes("texas") || path.includes("wyoming")), "thin pages stay out");
    assert.equal(new Set(paths).size, paths.length, "no duplicates");
    const usa = (await api("GET", "/api/directory/sitemap?scope=usa")).body.data;
    assert.ok(usa.length > 0 && usa.every((item) => item.scope === "usa"));
    assert.ok((await api("GET", "/api/directory/sitemap?scope=city")).body.data.every((item) => item.scope === "city"));
  });
});

describe("admin: landing pages, premium eligibility, templates, sitemap status", () => {
  test("publish / unpublish a page or a whole location, and set its SEO wording", async () => {
    const token = await adminToken();
    assert.equal((await api("GET", "/api/admin/directory/pages?state=new-york")).status, 401);
    const list = (await api("GET", "/api/admin/directory/pages?state=new-york", { token })).body.data;
    assert.equal(list.pages.length, (2 + 12) * 2, "plumbers, licensed and 12 services × Top 10 / Top 50");
    assert.ok(list.pages.find((item) => item.path === "/top-10-plumbers/new-york").isIndexable);

    assert.equal((await api("PUT", "/api/admin/directory/pages", { token, body: { key: "/not-a-page", kind: "page" } })).status, 400);
    assert.equal((await api("PUT", "/api/admin/directory/pages", { token, body: { key: "/top-10-plumbers/new-york", kind: "page", title: "Best NYC-area plumbers", description: "Hand-written description.", intro: "Our own introduction." } })).status, 200);
    const custom = (await page("10/plumbers/new-york")).body.data;
    assert.deepEqual([custom.text.title, custom.text.description, custom.text.intro], ["Best NYC-area plumbers", "Hand-written description.", "Our own introduction."]);

    await api("PUT", "/api/admin/directory/pages", { token, body: { key: "/top-10-plumbers/new-york", kind: "page", published: false } });
    assert.equal((await page("10/plumbers/new-york")).status, 404, "unpublished → 404");
    assert.ok(!(await api("GET", "/api/directory/sitemap")).body.data.some((item) => item.path === "/top-10-plumbers/new-york"), "and out of the sitemap");
    await api("PUT", "/api/admin/directory/pages", { token, body: { key: "state:NY", kind: "location", published: false } });
    assert.equal((await page("10/plumbers/new-york/brooklyn")).status, 404, "a hidden state hides its cities");
    const status = (await api("GET", "/api/admin/directory/sitemap-status", { token })).body.data;
    assert.ok(status.unpublished.some((item) => item.key === "state:NY"));
    assert.equal(status.byScope.state, 0);

    await api("PUT", "/api/admin/directory/pages", { token, body: { key: "state:NY", kind: "location", published: true } });
    await api("PUT", "/api/admin/directory/pages", { token, body: { key: "/top-10-plumbers/new-york", kind: "page", published: true } });
    const back = (await page("10/plumbers/new-york")).body.data;
    assert.deepEqual([back.text.title, back.text.intro], [null, null], "back to the built-in wording");
  });

  test("page templates: SEO patterns and sections per design", async () => {
    const token = await adminToken();
    assert.equal((await api("PUT", "/api/admin/directory/config", { token, body: { templates: { city: { showMap: "yes" } } } })).status, 400);
    await api("PUT", "/api/admin/directory/config", { token, body: { templates: { usa: { title: "{count} premium {noun} across {place}", showMap: false } } } });
    const usa = (await page("10/plumbers/usa")).body.data;
    assert.equal(usa.text.title, "10 premium Plumbers across the USA");
    assert.deepEqual(usa.sections, { map: false, faq: true });
    assert.equal((await page("10/plumbers/new-york")).body.data.text.title, null, "other designs keep the built-in title");
    await api("PUT", "/api/admin/directory/config", { token, body: { templates: { usa: { title: "", showMap: true } } } });
  });

  test("premium eligibility: every active plan, and making one ineligible removes it from rankings", async () => {
    const token = await adminToken();
    const premium = (await api("GET", "/api/admin/directory/premium?state=tx", { token })).body.data;
    assert.equal(premium.total, 4);
    assert.equal(premium.rows.find((row) => row.listingId === tx.suspended.id).eligible, false, "suspended can't rank");
    assert.equal(premium.rows.find((row) => row.listingId === tx.approved.id).tier, "elite");
    const config = (await api("GET", "/api/admin/directory/config", { token })).body.data;
    await api("PUT", "/api/admin/directory/config", { token, body: { exclusions: [...config.settings.exclusions, { providerType: "company", listingId: tx.approved.id, reason: "Licence check" }] } });
    clearRankingResults();
    assert.equal((await api("GET", "/api/admin/directory/premium?state=tx", { token })).body.data.rows.find((row) => row.listingId === tx.approved.id).excludedReason, "Licence check");
    assert.ok(!(await page("10/plumbers/texas")).body.data.items.some((item) => item.listingId === tx.approved.id));
    await api("PUT", "/api/admin/directory/config", { token, body: { exclusions: [] } });
    clearRankingResults();
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
