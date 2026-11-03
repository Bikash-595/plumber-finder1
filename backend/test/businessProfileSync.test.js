// Business-profile sections that used to save only in the browser (contact, map, branches, documents)
// now save to the server and show on the public profile; services have their own public page.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
async function newCompany() {
  const n = ++seq;
  const { token } = (await api("POST", "/api/auth/companies/signup", { body: { companyName: `Sync Co ${n}`, email: `sync${n}@example.com`, password: "password123", zipCode: "78701" } })).body;
  const listing = (await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Sync Co ${n}` } } })).body.data;
  return { token, id: listing._id, slug: listing.slug };
}
const profile = async (company) => (await api("GET", `/api/companies/public/${company.id}/profile`)).body.data;
const photo = `data:image/png;base64,${"A".repeat(400)}`;

describe("contact, map location, branches, documents", () => {
  test("contact details save to the server and update the public listing", async () => {
    const company = await newCompany();
    assert.equal((await api("PUT", "/api/companies/contact", { token: company.token, body: { primaryPhone: "not a phone" } })).status, 400);
    const saved = await api("PUT", "/api/companies/contact", { token: company.token, body: { primaryPhone: "(512) 555-0199", email: "hello@syncco.example", website: "https://syncco.example", whatsapp: "+1 512 555 0100", contactPerson: "Dana" } });
    assert.equal(saved.status, 200);
    assert.equal((await api("GET", "/api/companies/contact", { token: company.token })).body.data.primaryPhone, "(512) 555-0199");
    const pub = await profile(company);
    assert.deepEqual([pub.phone, pub.email, pub.website, pub.contact.whatsapp, pub.contact.contactPerson], ["(512) 555-0199", "hello@syncco.example", "https://syncco.example", "+1 512 555 0100", "Dana"]);
    assert.equal((await api("GET", "/api/companies/contact", { token: (await newCompany()).token })).body.data?.primaryPhone, undefined, "private to each company");
  });

  test("map location: address, coordinates and radius; deleting keeps the wizard's other data", async () => {
    const company = await newCompany();
    assert.equal((await api("PUT", "/api/companies/location", { token: company.token, body: { latitude: 120, longitude: 10 } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/location", { token: company.token, body: { latitude: 30.2 } })).status, 400, "both or neither");
    const saved = (await api("PUT", "/api/companies/location", { token: company.token, body: { headquarters: "500 Congress Ave, Austin, TX", latitude: 30.2672, longitude: -97.7431, serviceRadius: 30 } })).body.data;
    assert.deepEqual([saved.latitude, saved.serviceRadius], ["30.2672", "30"]);
    const pub = await profile(company);
    assert.equal(pub.location, "500 Congress Ave, Austin, TX");
    assert.deepEqual(pub.coordinates, { lat: 30.2672, lng: -97.7431 });
    await api("DELETE", "/api/companies/location", { token: company.token });
    assert.equal((await api("GET", "/api/companies/location", { token: company.token })).body.data, null);
  });

  test("branches are listed on the public profile", async () => {
    const company = await newCompany();
    assert.equal((await api("POST", "/api/companies/branches", { token: company.token, body: { manager: "No name" } })).status, 400);
    const branch = await api("POST", "/api/companies/branches", { token: company.token, body: { name: "North Austin", address: "9 Oak St", city: "Austin", state: "TX", latitude: "30.4", longitude: "-97.7", services: "Drain cleaning, Leak repair", phone: "512-555-0123" } });
    assert.equal(branch.status, 201);
    assert.deepEqual(branch.body.data.services, ["Drain cleaning", "Leak repair"]);
    const pub = await profile(company);
    assert.deepEqual(pub.branches.map((b) => [b.label, b.city, b.latitude]), [["North Austin", "Austin", 30.4]]);
    assert.equal((await api("DELETE", `/api/companies/branches/${branch.body.data._id}`, { token: (await newCompany()).token })).status, 404, "only your own");
  });

  test("verification documents are private; admins can read them", async () => {
    const company = await newCompany();
    assert.equal((await api("PUT", "/api/companies/verification", { token: company.token, body: { license: "ftp://x" } })).status, 400);
    await api("PUT", "/api/companies/verification", { token: company.token, body: { license: "https://docs.example/license.pdf", notes: "Renewed 2026" } });
    assert.ok(!JSON.stringify(await profile(company)).includes("license.pdf"), "never public");
    assert.equal((await api("GET", "/api/companies/verification/public/" + company.id)).status, 404);
  });
});

describe("service pages", () => {
  test("several photos and page content; lists stay light; one public service with everything", async () => {
    const company = await newCompany();
    const body = { name: "Drain Cleaning", priceType: "from", priceAmount: 129, images: [photo, photo.replace("AAAA", "BBBB")], overview: "We clear any blocked drain.", process: ["Camera inspection", "Hydro jetting", "Test flow"], faqs: [{ question: "How long?", answer: "About an hour." }] };
    const created = (await api("POST", "/api/companies/services", { token: company.token, body })).body.data;
    assert.equal(created.image, photo, "the first photo is the card photo");
    assert.equal((await api("POST", "/api/companies/services", { token: company.token, body: { name: "Too many", images: Array(9).fill(photo) } })).status, 400);
    const list = (await api("GET", "/api/companies/services", { token: company.token })).body.data;
    assert.equal(list[0].images, undefined, "the dashboard list leaves photos out");
    assert.equal((await api("GET", `/api/companies/services/${created._id}`, { token: company.token })).body.data.images.length, 2);
    const pub = await profile(company);
    assert.deepEqual([pub.services[0].name, pub.services[0].images, pub.services[0].image], ["Drain Cleaning", undefined, photo], "profile stays light but keeps the card photo");
    const page = (await api("GET", `/api/companies/services/public/${company.id}/${created._id}`)).body.data;
    assert.deepEqual([page.images.length, page.overview, page.process.length, page.faqs[0].answer, page.price], [2, "We clear any blocked drain.", 3, "About an hour.", "From $129"]);
    assert.equal((await api("GET", `/api/companies/services/public/${(await newCompany()).id}/${created._id}`)).status, 404, "wrong company");
    await api("PATCH", `/api/companies/services/${created._id}`, { token: company.token, body: { images: [] } });
    assert.equal((await api("GET", `/api/companies/services/${created._id}`, { token: company.token })).body.data.image, null, "removing every photo clears the card photo");
  });

  test("videos: YouTube or file links and one uploaded clip; counts and a poster for cards", async () => {
    const company = await newCompany();
    const clip = `data:video/mp4;base64,${"A".repeat(800)}`;
    const bad = await api("POST", "/api/companies/services", { token: company.token, body: { name: "Bad", videos: ["https://evil.example/page"] } });
    assert.equal(bad.status, 400);
    assert.equal((await api("POST", "/api/companies/services", { token: company.token, body: { name: "Two clips", videos: [clip, clip] } })).status, 400, "one upload at most");
    const created = (await api("POST", "/api/companies/services", { token: company.token, body: { name: "Repipe", images: [photo], videos: ["https://youtu.be/dQw4w9WgXcQ", "https://cdn.example/tour.mp4", clip] } })).body.data;
    assert.deepEqual([created.photoCount, created.videoCount, created.videoPoster], [1, 3, "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"]);
    const list = (await api("GET", "/api/companies/services", { token: company.token })).body.data[0];
    assert.deepEqual([list.videos, list.videoCount], [undefined, 3], "lists carry counts, not the videos");
    const page = (await api("GET", `/api/companies/services/public/${company.id}/${created._id}`)).body.data;
    assert.equal(page.videos.length, 3);
    const big = `data:image/png;base64,${"A".repeat(1_250_000)}`;
    assert.equal((await api("PATCH", `/api/companies/services/${created._id}`, { token: company.token, body: { images: Array(8).fill(big), videos: [`data:video/mp4;base64,${"A".repeat(5_000_000)}`] } })).status, 400, "total size is capped");
  });

  test("page content lists: signs you need it, highlights, before-your-visit tips; tagline on the card", async () => {
    const company = await newCompany();
    const created = (await api("POST", "/api/companies/services", { token: company.token, body: { name: "Water Heater Repair", tagline: "Hot water back the same day", problems: ["No hot water", "Leaking tank"], highlights: ["Same-day parts"], prepare: ["Clear space around the heater"] } })).body.data;
    assert.equal((await api("POST", "/api/companies/services", { token: company.token, body: { name: "Too many", problems: Array.from({ length: 13 }, (_, i) => `Problem ${i}`) } })).status, 400);
    const list = (await api("GET", "/api/companies/services", { token: company.token })).body.data[0];
    assert.deepEqual([list.tagline, list.problems], ["Hot water back the same day", undefined], "lists keep the tagline, not the page content");
    const page = (await api("GET", `/api/companies/services/public/${company.id}/${created._id}`)).body.data;
    assert.deepEqual([page.problems, page.highlights, page.prepare], [["No hot water", "Leaking tank"], ["Same-day parts"], ["Clear space around the heater"]]);
  });
});
