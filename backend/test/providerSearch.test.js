// Site search over profiles: names, services, places and keywords; prefix and typo tolerance; service words;
// corrected queries; related profiles when few or none match; filters; suspended providers never shown.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { Company } = await import("../src/auth/company/models/Company.js");
const { resetRankingIndex } = await import("../src/directory/services/rankingIndex.js");
const { resetProviderSearch } = await import("../src/directory/services/providerSearch.js");

let api, stop;
after(() => stop());

let seq = 0;
async function company({ name, city, state, services, status }) {
  const n = ++seq;
  const { token, account } = (await api("POST", "/api/auth/companies/signup", { body: { companyName: name, email: `find${n}@example.com`, password: "password123", zipCode: "78701" } })).body;
  await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: name, primaryPhone: `555-02${n}0-${1000 + n}`, website: `https://find${n}.example.com` }, services: services.map((item) => ({ name: item })), locations: [{ city, state, address: `${n} Elm St` }] } });
  if (status) await Company.updateOne({ _id: account._id }, { $set: { status } });
}

before(async () => {
  ({ api, stop } = await startTestServer());
  await company({ name: "Kings County Plumbing", city: "Brooklyn", state: "NY", services: ["Drain Cleaning", "Leak Repair"], status: "approved" });
  await company({ name: "Lone Star Water Heaters", city: "Austin", state: "TX", services: ["Water Heater Repair", "Tankless Installation"] });
  await company({ name: "Bayou Drain Pros", city: "Houston", state: "TX", services: ["Drain Cleaning", "Hydro Jetting"] });
  await company({ name: "Granite State Plumbing", city: "Manchester", state: "NH", services: ["Leak Detection"] });
  await company({ name: "Shady Pipes", city: "Houston", state: "TX", services: ["Drain Cleaning"], status: "suspended" });
  resetRankingIndex();
  resetProviderSearch();
});

const find = async (q, extra = "") => (await api("GET", `/api/search/providers?q=${encodeURIComponent(q)}${extra}`)).body.data;
const names = (list) => list.map((item) => item.name);

describe("profile search", () => {
  test("a company's name finds it first", async () => {
    const data = await find("kings county");
    assert.equal(data.results[0].name, "Kings County Plumbing");
    assert.equal(data.correctedQuery, null);
    assert.equal(data.results[0].url.startsWith("/company/"), true);
    assert.equal("account" in data.results[0], false, "no account ids in public results");
  });

  test("still typing (prefix) and typos both find it, with a corrected query", async () => {
    assert.equal((await find("lone st")).results[0].name, "Lone Star Water Heaters");
    const typo = await find("kigns county");
    assert.equal(typo.results[0].name, "Kings County Plumbing");
    assert.equal(typo.correctedQuery, "kings county");
    const city = await find("huston");
    assert.deepEqual(names(city.results), ["Bayou Drain Pros"]);
    assert.equal(city.correctedQuery, "houston");
  });

  test("service words match providers offering that service", async () => {
    assert.deepEqual(names((await find("clogged drain")).results).sort(), ["Bayou Drain Pros", "Kings County Plumbing"]);
    assert.deepEqual(names((await find("tankless")).results), ["Lone Star Water Heaters"]);
  });

  test("every word must match; profiles matching some words are offered as related", async () => {
    const data = await find("drain houston");
    assert.deepEqual(names(data.results), ["Bayou Drain Pros"]);
    assert.ok(names(data.related).includes("Kings County Plumbing"), "same service elsewhere is related");
    assert.ok(!names(data.related).includes("Bayou Drain Pros"), "results are not repeated");
  });

  test("nothing matches: no results, but related profiles so the page is never empty", async () => {
    const data = await find("zzqxv");
    assert.equal(data.total, 0);
    assert.ok(data.related.length >= 4);
  });

  test("suspended providers are never shown", async () => {
    const data = await find("shady pipes");
    assert.ok(![...names(data.results), ...names(data.related)].includes("Shady Pipes"));
  });

  test("general words alone list every profile; filters and facet counts", async () => {
    assert.equal((await find("best plumbers near me")).total, 4);
    const texas = await find("drain", "&state=TX");
    assert.deepEqual(names(texas.results), ["Bayou Drain Pros"]);
    const all = await find("drain");
    assert.deepEqual(all.facets.services.find((item) => item.slug === "drain-cleaning")?.count, 2);
    assert.deepEqual(names((await find("drain", "&verified=1")).results), ["Kings County Plumbing"]);
  });

  test("search-as-you-type suggests matching profiles first", async () => {
    const list = (await api("GET", `/api/search/suggestions?q=${encodeURIComponent("bayo")}`)).body.data;
    assert.equal(list[0].kind, "provider");
    assert.equal(list[0].label, "Bayou Drain Pros");
    assert.equal(list[0].hint, "Houston, TX");
  });
});

test("a misspelled general word is corrected and ignored", async () => {
  const data = await find("plumbng houston");
  assert.deepEqual(names(data.results), ["Bayou Drain Pros"]);
  assert.equal(data.correctedQuery, "plumbing houston");
});

test("Enter: names and multi-word searches open the results; a plain service keeps its page", async () => {
  const go = async (q) => (await api("GET", `/api/search?q=${encodeURIComponent(q)}`)).body.data.url;
  assert.equal(await go("bayou drain pros"), "/find?search=bayou%20drain%20pros");
  assert.equal(await go("drain cleaning houston"), "/find?search=drain%20cleaning%20houston");
  assert.equal(await go("kigns county"), "/find?search=kigns%20county");
  assert.equal(await go("drain cleaning"), "/services/drain-cleaning");
});
