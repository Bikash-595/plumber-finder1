// Integration tests for the freelancer profile sections and public freelancer directory.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { startTestServer } from "./helpers/testServer.js";

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
async function newFreelancer({ profile = true } = {}) {
  const n = ++seq;
  const { body } = await api("POST", "/api/auth/freelancers/signup", { body: { name: `Fran ${n}`, email: `fl${n}@example.com`, password: "password123" } });
  let listingId;
  if (profile) {
    await api("PUT", "/api/freelancers/header-profile", { token: body.token, body: { displayName: `Fran ${n}`, headline: "Licensed Plumber", city: "Austin", state: "TX", hourlyRate: "85" } });
    listingId = (await api("GET", "/api/freelancers/public")).body.data.find((listing) => listing.displayName === `Fran ${n}`)?._id;
  }
  return { token: body.token, freelancerId: body.account._id, listingId };
}

const tinyPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const singletons = ["header-profile", "overview", "service-areas", "booking"];
const collections = {
  services: { name: "Leak repair" },
  gallery: { media: tinyPng, caption: "Recent job" },
  "previous-projects": { title: "Bathroom refit", service: "Bathroom plumbing", description: "Full refit" },
  reviews: { customer: "Sam", rating: 5, review: "Quick and tidy" },
  faqs: { question: "Do you work weekends?", answer: "Yes" },
  blogs: { title: "Fixing a dripping tap", excerpt: "How-to", content: "Body", status: "published" },
  "special-offers": { title: "10% off first job" },
};

describe("access", () => {
  test("every section requires a freelancer token", async () => {
    const { body: company } = await api("POST", "/api/auth/companies/signup", { body: { companyName: "Co", email: "co-fl@example.com", password: "password123" } });
    for (const section of [...singletons, ...Object.keys(collections)]) {
      assert.equal((await api("GET", `/api/freelancers/${section}`)).status, 401, section);
      assert.equal((await api("GET", `/api/freelancers/${section}`, { token: company.token })).status, 403, `${section} (company token)`);
    }
  });

  test("a freelancer cannot read, change, or delete another freelancer's items", async () => {
    const owner = await newFreelancer();
    const other = await newFreelancer();
    const id = (await api("POST", "/api/freelancers/faqs", { token: owner.token, body: { question: "Private?", answer: "Yes" } })).body.data._id;
    assert.equal((await api("GET", `/api/freelancers/faqs/${id}`, { token: other.token })).status, 404);
    assert.equal((await api("PUT", `/api/freelancers/faqs/${id}`, { token: other.token, body: { answer: "No" } })).status, 404);
    assert.equal((await api("DELETE", `/api/freelancers/faqs/${id}`, { token: other.token })).status, 404);
    assert.equal((await api("GET", "/api/freelancers/faqs", { token: other.token })).body.data.length, 0);
  });

  test("freelancer and company data are fully separate", async () => {
    const { token } = await newFreelancer();
    await api("POST", "/api/freelancers/services", { token, body: { name: "Freelancer only" } });
    const { body: company } = await api("POST", "/api/auth/companies/signup", { body: { companyName: "Sep Co", email: "sep-co@example.com", password: "password123" } });
    assert.equal((await api("GET", "/api/companies/services", { token: company.token })).body.data.length, 0);
    assert.equal((await api("GET", "/api/companies/services", { token })).status, 403, "freelancer token on company routes");
  });
});

describe("sections", () => {
  test("collections support full CRUD", async () => {
    const { token } = await newFreelancer();
    for (const [section, item] of Object.entries(collections)) {
      const created = await api("POST", `/api/freelancers/${section}`, { token, body: item });
      assert.equal(created.status, 201, `${section}: ${JSON.stringify(created.body)}`);
      const id = created.body.data._id;
      assert.equal((await api("GET", `/api/freelancers/${section}`, { token })).body.data.length, 1, section);
      const key = Object.keys(item).find((k) => typeof item[k] === "string" && !item[k].startsWith("data:") && k !== "status");
      const updated = await api("PATCH", `/api/freelancers/${section}/${id}`, { token, body: { [key]: "Updated" } });
      assert.equal(updated.body.data[key], "Updated", section);
      assert.equal((await api("DELETE", `/api/freelancers/${section}/${id}`, { token })).status, 200, section);
      assert.equal((await api("GET", `/api/freelancers/${section}/${id}`, { token })).status, 404, section);
    }
  });

  test("single-record sections upsert and validate", async () => {
    const { token } = await newFreelancer({ profile: false });
    const overview = await api("PUT", "/api/freelancers/overview", { token, body: { bio: "20 years on the tools", specialties: "Leaks, Boilers, Leaks", jobsCompleted: "320" } });
    assert.equal(overview.status, 200);
    assert.deepEqual(overview.body.data.specialties, ["Leaks", "Boilers"]);
    assert.equal(overview.body.data.jobsCompleted, 320);
    assert.equal((await api("PUT", "/api/freelancers/booking", { token, body: { instantBooking: "maybe" } })).status, 400);
    const noName = await api("PUT", "/api/freelancers/header-profile", { token, body: { headline: "Plumber" } });
    assert.equal(noName.status, 400);
    assert.equal(noName.body.errors.displayName, "is required");
    assert.equal((await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: "X", photo: "javascript:alert(1)" } })).status, 400);
  });
});

describe("public freelancer directory", () => {
  test("saving the profile registers the freelancer publicly, with services and areas synced", async () => {
    const { token } = await newFreelancer({ profile: false });
    // Sections saved before the profile exists are picked up when the listing is created.
    await api("POST", "/api/freelancers/services", { token, body: { name: "Water Heater" } });
    await api("PUT", "/api/freelancers/service-areas", { token, body: { areasCovered: "Austin, Round Rock" } });
    await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: "Dana Pipes", headline: "Master Plumber", hourlyRate: "95", photo: tinyPng } });

    let listing = (await api("GET", "/api/freelancers/public")).body.data.find((item) => item.displayName === "Dana Pipes");
    assert.ok(listing, "freelancer appears in the public directory");
    assert.equal(listing.headline, "Master Plumber");
    assert.equal(listing.hourlyRate, 95);
    assert.deepEqual(listing.services, ["Water Heater"]);
    assert.deepEqual(listing.serviceAreas, ["Austin", "Round Rock"]);
    assert.match(listing.slug, /^dana-pipes-[a-f0-9]{6}$/);

    // Later changes keep syncing.
    await api("POST", "/api/freelancers/services", { token, body: { name: "Drain Cleaning" } });
    listing = (await api("GET", `/api/freelancers/public/${listing._id}`)).body.data;
    assert.deepEqual(listing.services, ["Water Heater", "Drain Cleaning"]);
  });

  test("unpublishing hides the listing and its public sections", async () => {
    const { token, listingId } = await newFreelancer();
    await api("POST", "/api/freelancers/faqs", { token, body: { question: "Q", answer: "A" } });
    assert.equal((await api("GET", `/api/freelancers/faqs/public/${listingId}`)).body.data.length, 1);

    await api("PUT", "/api/freelancers/header-profile", { token, body: { displayName: "Hidden Fran", published: false } });
    assert.equal((await api("GET", `/api/freelancers/public/${listingId}`)).status, 404);
    assert.equal((await api("GET", `/api/freelancers/faqs/public/${listingId}`)).status, 404);
    assert.ok(!(await api("GET", "/api/freelancers/public")).body.data.some((item) => item._id === listingId));
  });

  test("public sections only expose public content", async () => {
    const { token, listingId } = await newFreelancer();
    await api("POST", "/api/freelancers/blogs", { token, body: { title: "Draft", excerpt: "E", content: "C" } });
    await api("POST", "/api/freelancers/blogs", { token, body: { title: "Live", excerpt: "E", content: "C", status: "published" } });
    await api("POST", "/api/freelancers/previous-projects", { token, body: { title: "Hidden", service: "S", description: "D", visible: false } });
    await api("POST", "/api/freelancers/previous-projects", { token, body: { title: "Shown", service: "S", description: "D" } });
    await api("POST", "/api/freelancers/special-offers", { token, body: { title: "Expired", endDate: "2020-01-01" } });
    await api("POST", "/api/freelancers/special-offers", { token, body: { title: "Current", endDate: "2099-01-01" } });
    const titles = async (section) => (await api("GET", `/api/freelancers/${section}/public/${listingId}`)).body.data.map((item) => item.title);
    assert.deepEqual(await titles("blogs"), ["Live"]);
    assert.deepEqual(await titles("previous-projects"), ["Shown"]);
    assert.deepEqual(await titles("special-offers"), ["Current"]);
    const header = (await api("GET", `/api/freelancers/header-profile/public/${listingId}`)).body.data;
    assert.equal(header.freelancer, undefined, "owner id is not exposed");
    assert.equal((await api("GET", `/api/freelancers/blogs/public/${new mongoose.Types.ObjectId()}`)).status, 404);
  });

  test("blog slugs are unique per freelancer and the gallery accepts large videos", async () => {
    const { token } = await newFreelancer();
    const post = { title: "Winter Prep", excerpt: "E", content: "C" };
    assert.equal((await api("POST", "/api/freelancers/blogs", { token, body: post })).body.data.slug, "winter-prep");
    assert.equal((await api("POST", "/api/freelancers/blogs", { token, body: post })).body.data.slug, "winter-prep-2");
    const video = await api("POST", "/api/freelancers/gallery", { token, body: { media: `data:video/mp4;base64,${"A".repeat(4 * 1024 * 1024)}` } });
    assert.equal(video.status, 201);
    assert.equal(video.body.data.mediaKind, "video");
  });
});
