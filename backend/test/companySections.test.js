// Integration tests for the company business-profile sections.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { startTestServer } from "./helpers/testServer.js";

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
async function newCompany({ publish = true } = {}) {
  const n = ++seq;
  const { body } = await api("POST", "/api/auth/companies/signup", { body: { companyName: `Co ${n}`, email: `co${n}@example.com`, password: "password123" } });
  let listingId;
  if (publish) {
    const res = await api("POST", "/api/companies/onboarding", { token: body.token, body: { formData: { companyName: `Co ${n}` } } });
    listingId = res.body.data._id;
  }
  return { token: body.token, companyId: body.account._id, listingId };
}

const tinyPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const singletons = ["company-overview", "service-areas", "booking"];
const collections = {
  services: { name: "Drain cleaning" },
  gallery: { media: tinyPng, caption: "Team" },
  "previous-projects": { title: "Repipe", service: "Pipe repair", description: "Whole home repipe" },
  reviews: { customer: "Ann", rating: 5, review: "Great" },
  team: { name: "Chris", role: "Owner" },
  faqs: { question: "Do you do emergencies?", answer: "Yes" },
  blogs: { title: "Frozen pipes", excerpt: "Tips", content: "Body", status: "published" },
  "special-offers": { title: "Free estimate" },
};

describe("every section", () => {
  test("requires a company token", async () => {
    const { body: user } = await api("POST", "/api/auth/users/signup", { body: { name: "U", email: "u-sections@example.com", password: "password123" } });
    for (const section of [...singletons, ...Object.keys(collections)]) {
      assert.equal((await api("GET", `/api/companies/${section}`)).status, 401, section);
      assert.equal((await api("GET", `/api/companies/${section}`, { token: user.token })).status, 403, `${section} (user token)`);
    }
  });

  test("collections support full CRUD for the owner", async () => {
    const { token } = await newCompany();
    for (const [section, item] of Object.entries(collections)) {
      const created = await api("POST", `/api/companies/${section}`, { token, body: item });
      assert.equal(created.status, 201, `${section} create: ${JSON.stringify(created.body)}`);
      const id = created.body.data._id;

      const list = await api("GET", `/api/companies/${section}`, { token });
      assert.equal(list.body.data.length, 1, `${section} list`);
      assert.equal((await api("GET", `/api/companies/${section}/${id}`, { token })).status, 200, `${section} get`);

      const firstKey = Object.keys(item).find((key) => typeof item[key] === "string" && !item[key].startsWith("data:") && key !== "status");
      const updated = await api("PUT", `/api/companies/${section}/${id}`, { token, body: { [firstKey]: "Updated value" } });
      assert.equal(updated.status, 200, `${section} update: ${JSON.stringify(updated.body)}`);
      assert.equal(updated.body.data[firstKey], "Updated value", `${section} updated field`);

      assert.equal((await api("DELETE", `/api/companies/${section}/${id}`, { token })).status, 200, `${section} delete`);
      assert.equal((await api("GET", `/api/companies/${section}/${id}`, { token })).status, 404, `${section} gone`);
    }
  });

  test("singletons upsert and read back", async () => {
    const { token } = await newCompany();
    const bodies = {
      "company-overview": { foundedYear: "2016", teamSize: "8", licenseNumber: "PL-1" },
      "service-areas": { areasCovered: "Dallas, Plano", radius: "25" },
      booking: { instantBooking: false, workingDays: "Mon–Sat" },
    };
    for (const [section, body] of Object.entries(bodies)) {
      assert.equal((await api("GET", `/api/companies/${section}`, { token })).body.data, null, `${section} empty`);
      const saved = await api("PUT", `/api/companies/${section}`, { token, body });
      assert.equal(saved.status, 200, `${section}: ${JSON.stringify(saved.body)}`);
      const again = await api("PUT", `/api/companies/${section}`, { token, body });
      assert.equal(again.body.data._id, saved.body.data._id, `${section} keeps one document`);
    }
    const overview = await api("GET", "/api/companies/company-overview", { token });
    assert.equal(overview.body.data.foundedYear, 2016);
    assert.equal(overview.body.data.teamSize, 8);
  });
});

describe("security", () => {
  test("a company cannot read, change, or delete another company's items", async () => {
    const owner = await newCompany();
    const other = await newCompany();
    const { body } = await api("POST", "/api/companies/team", { token: owner.token, body: { name: "Private" } });
    const id = body.data._id;
    assert.equal((await api("GET", `/api/companies/team/${id}`, { token: other.token })).status, 404);
    assert.equal((await api("PUT", `/api/companies/team/${id}`, { token: other.token, body: { name: "Hacked" } })).status, 404);
    assert.equal((await api("DELETE", `/api/companies/team/${id}`, { token: other.token })).status, 404);
    assert.equal((await api("GET", "/api/companies/team", { token: other.token })).body.data.length, 0);
    assert.equal((await api("GET", `/api/companies/team/${id}`, { token: owner.token })).body.data.name, "Private");
  });

  test("server-owned fields in the body are ignored", async () => {
    const { token, companyId } = await newCompany();
    const victim = new mongoose.Types.ObjectId().toString();
    const forgedId = new mongoose.Types.ObjectId().toString();
    const res = await api("POST", "/api/companies/faqs", { token, body: { question: "Q", answer: "A", company: victim, _id: forgedId } });
    assert.equal(res.status, 201);
    assert.notEqual(res.body.data._id, forgedId);
    assert.equal(res.body.data.company, companyId);
    const gallery = await api("POST", "/api/companies/gallery", { token, body: { media: tinyPng, mediaKind: "video" } });
    assert.equal(gallery.body.data.mediaKind, "image", "derived field cannot be forged");
  });

  test("invalid ids return 400", async () => {
    const { token } = await newCompany();
    assert.equal((await api("GET", "/api/companies/services/not-an-id", { token })).status, 400);
    assert.equal((await api("GET", "/api/companies/services/public/not-an-id")).status, 400);
  });
});

describe("validation", () => {
  test("required fields, types, and ranges are enforced with field-level messages", async () => {
    const { token } = await newCompany();
    const missing = await api("POST", "/api/companies/services", { token, body: {} });
    assert.equal(missing.status, 400);
    assert.equal(missing.body.errors.name, "is required");

    const badReview = await api("POST", "/api/companies/reviews", { token, body: { customer: "A", review: "B", rating: 9 } });
    assert.equal(badReview.status, 400);
    assert.match(badReview.body.errors.rating, /at most 5/);

    const badTypes = await api("PUT", "/api/companies/booking", { token, body: { instantBooking: "yes", workingDays: 5 } });
    assert.equal(badTypes.status, 400);
    assert.ok(badTypes.body.errors.instantBooking && badTypes.body.errors.workingDays);

    const futureYear = await api("PUT", "/api/companies/company-overview", { token, body: { foundedYear: new Date().getFullYear() + 1 } });
    assert.equal(futureYear.status, 400);

    const badImage = await api("POST", "/api/companies/team", { token, body: { name: "X", photo: "javascript:alert(1)" } });
    assert.equal(badImage.status, 400);
    assert.ok(badImage.body.errors.photo);

    const badStatus = await api("POST", "/api/companies/blogs", { token, body: { title: "T", excerpt: "E", content: "C", status: "live" } });
    assert.equal(badStatus.status, 400);

    const emptyRequired = await api("PUT", "/api/companies/faqs/" + (await api("POST", "/api/companies/faqs", { token, body: { question: "Q", answer: "A" } })).body.data._id, { token, body: { question: "" } });
    assert.equal(emptyRequired.status, 400, "cannot blank a required field on update");
  });

  test("offer end date must not be before start date", async () => {
    const { token } = await newCompany();
    const res = await api("POST", "/api/companies/special-offers", { token, body: { title: "X", startDate: "2026-05-10", endDate: "2026-05-01" } });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.endDate);
  });

  test("item limits are enforced", async () => {
    const { token } = await newCompany();
    for (let i = 0; i < 50; i++) await api("POST", "/api/companies/faqs", { token, body: { question: `Q${i}`, answer: "A" } });
    assert.equal((await api("POST", "/api/companies/faqs", { token, body: { question: "one too many", answer: "A" } })).status, 409);
  });
});

describe("section behaviour", () => {
  test("services sync to the public listing (used by service pages)", async () => {
    const { token, listingId } = await newCompany();
    const a = await api("POST", "/api/companies/services", { token, body: { name: "Drain Cleaning" } });
    await api("POST", "/api/companies/services", { token, body: { name: "Water Heater" } });
    let listing = await api("GET", `/api/companies/public/${listingId}`);
    assert.deepEqual(listing.body.data.services, ["Drain Cleaning", "Water Heater"]);
    await api("DELETE", `/api/companies/services/${a.body.data._id}`, { token });
    listing = await api("GET", `/api/companies/public/${listingId}`);
    assert.deepEqual(listing.body.data.services, ["Water Heater"]);
  });

  test("service areas are parsed and synced to the listing", async () => {
    const { token, listingId } = await newCompany();
    const saved = await api("PUT", "/api/companies/service-areas", { token, body: { areasCovered: "Dallas, Plano, , Dallas, Irving" } });
    assert.deepEqual(saved.body.data.areas, ["Dallas", "Plano", "Irving"]);
    const listing = await api("GET", `/api/companies/public/${listingId}`);
    assert.deepEqual(listing.body.data.serviceAreas, ["Dallas", "Plano", "Irving"]);
  });

  test("blog slugs are unique per company and tags are parsed", async () => {
    const { token } = await newCompany();
    const post = { title: "Frozen Pipes!", excerpt: "E", content: "C", tags: "winter, pipes, winter" };
    const first = await api("POST", "/api/companies/blogs", { token, body: post });
    const second = await api("POST", "/api/companies/blogs", { token, body: post });
    assert.equal(first.body.data.slug, "frozen-pipes");
    assert.equal(second.body.data.slug, "frozen-pipes-2");
    assert.deepEqual(first.body.data.tags, ["winter", "pipes"]);
    assert.equal(first.body.data.status, "draft");
    const renamed = await api("PUT", `/api/companies/blogs/${first.body.data._id}`, { token, body: { title: "Frozen Pipes!" } });
    assert.equal(renamed.body.data.slug, "frozen-pipes", "editing keeps its own slug");
    const other = await newCompany();
    const otherPost = await api("POST", "/api/companies/blogs", { token: other.token, body: post });
    assert.equal(otherPost.body.data.slug, "frozen-pipes", "slugs are per company");
  });

  test("gallery detects videos and accepts bodies above the default 3 MB limit", async () => {
    const { token } = await newCompany();
    const video = `data:video/mp4;base64,${"A".repeat(4 * 1024 * 1024)}`;
    const res = await api("POST", "/api/companies/gallery", { token, body: { media: video } });
    assert.equal(res.status, 201, JSON.stringify(res.body).slice(0, 200));
    assert.equal(res.body.data.mediaKind, "video");
    // Other sections keep the 3 MB limit.
    assert.equal((await api("POST", "/api/companies/team", { token, body: { name: "X", bio: "A".repeat(4 * 1024 * 1024) } })).status, 413);
  });
});

describe("onboarding wizard", () => {
  test("seeds the Services and Gallery sections once, skipping invalid items", async () => {
    const { token } = await newCompany({ publish: false });
    const wizard = {
      formData: { companyName: "Seeded Co" },
      services: [{ name: "Drain cleaning", pricing: "$99", duration: "1 hour" }, { description: "no name, skipped" }],
      galleryImages: [{ url: "https://example.com/van.jpg", caption: "Our van" }, { url: "javascript:alert(1)", caption: "skipped" }],
      galleryVideos: [{ url: "https://example.com/tour.mp4", title: "Shop tour" }],
    };
    assert.equal((await api("POST", "/api/companies/onboarding", { token, body: wizard })).status, 201);

    const services = (await api("GET", "/api/companies/services", { token })).body.data;
    assert.deepEqual(services.map((s) => [s.name, s.price, s.duration]), [["Drain cleaning", "$99", "1 hour"]]);
    const gallery = (await api("GET", "/api/companies/gallery", { token })).body.data;
    assert.deepEqual(gallery.map((g) => [g.caption, g.mediaKind]), [["Our van", "image"], ["Shop tour", "video"]]);

    // The company edits its services in the dashboard, then re-submits the wizard.
    await api("PUT", `/api/companies/services/${services[0]._id}`, { token, body: { name: "Drain cleaning (edited)" } });
    await api("POST", "/api/companies/onboarding", { token, body: { ...wizard, services: [{ name: "Something else" }] } });
    const after = (await api("GET", "/api/companies/services", { token })).body.data;
    assert.deepEqual(after.map((s) => s.name), ["Drain cleaning (edited)"], "wizard never overwrites dashboard edits");
    assert.equal((await api("GET", "/api/companies/gallery", { token })).body.data.length, 2, "no duplicate gallery items");
  });
});

describe("review fixes", () => {
  test("impossible calendar dates and out-of-range years are rejected", async () => {
    const { token } = await newCompany();
    for (const date of ["2026-02-30", "2026-04-31", "2026-02-29", "0001-01-01"]) {
      const res = await api("POST", "/api/companies/special-offers", { token, body: { title: "X", startDate: date } });
      assert.equal(res.status, 400, date);
    }
    assert.equal((await api("POST", "/api/companies/special-offers", { token, body: { title: "Leap", startDate: "2028-02-29" } })).status, 201);
  });

  test("a partial update cannot put an offer's end date before its saved start date", async () => {
    const { token } = await newCompany();
    const { body } = await api("POST", "/api/companies/special-offers", { token, body: { title: "Spring", startDate: "2026-05-10", endDate: "2026-05-20" } });
    const res = await api("PATCH", `/api/companies/special-offers/${body.data._id}`, { token, body: { endDate: "2026-05-01" } });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.endDate);
    assert.equal((await api("PATCH", `/api/companies/special-offers/${body.data._id}`, { token, body: { endDate: "2026-05-30" } })).status, 200);
  });

  test("SVG uploads are rejected", async () => {
    const { token } = await newCompany();
    const res = await api("POST", "/api/companies/team", { token, body: { name: "X", photo: "data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+" } });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.photo);
  });

  test("clearing a field with a default falls back to it instead of null", async () => {
    const { token } = await newCompany();
    const { body } = await api("POST", "/api/companies/blogs", { token, body: { title: "T", excerpt: "E", content: "C", status: "published" } });
    const cleared = await api("PATCH", `/api/companies/blogs/${body.data._id}`, { token, body: { status: "" } });
    assert.equal(cleared.body.data.status, "draft");
    const offer = await api("POST", "/api/companies/special-offers", { token, body: { title: "O", active: null } });
    assert.equal(offer.body.data.active, true);
  });

  test("blogs: publishing a draft stamps a date, future dates are scheduled, published posts keep their date", async () => {
    const { token, listingId } = await newCompany();
    const draft = (await api("POST", "/api/companies/blogs", { token, body: { title: "Draft first", excerpt: "E", content: "C" } })).body.data;
    assert.equal(draft.publishDate, undefined);
    const published = (await api("PATCH", `/api/companies/blogs/${draft._id}`, { token, body: { status: "published" } })).body.data;
    assert.ok(published.publishDate, "publishing an existing draft sets a publish date");

    const kept = (await api("PATCH", `/api/companies/blogs/${draft._id}`, { token, body: { publishDate: "" } })).body.data;
    assert.equal(kept.publishDate, published.publishDate, "a published post cannot lose its date");

    await api("POST", "/api/companies/blogs", { token, body: { title: "Scheduled", excerpt: "E", content: "C", status: "published", publishDate: "2099-01-01" } });
    const titles = (await api("GET", `/api/companies/blogs/public/${listingId}`)).body.data.map((post) => post.title);
    assert.deepEqual(titles, ["Draft first"], "future-dated posts stay hidden until their date");
  });

  test("header profile: validated images, clearable fields, public endpoint, listing sync", async () => {
    const { token, listingId } = await newCompany();
    const bad = await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Acme", logo: "javascript:alert(1)" } });
    assert.equal(bad.status, 400);
    assert.ok(bad.body.errors.logo);

    await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Acme", ownerName: "Pat", logo: tinyPng } });
    const cleared = await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Acme Plumbing", ownerName: "" } });
    assert.equal(cleared.body.data.ownerName, null, "fields can be cleared");

    const pub = await api("GET", `/api/companies/header-profile/public/${listingId}`);
    assert.equal(pub.status, 200);
    assert.equal(pub.body.data.companyName, "Acme Plumbing");
    const listing = (await api("GET", `/api/companies/public/${listingId}`)).body.data;
    assert.equal(listing.companyName, "Acme Plumbing");
    assert.equal(listing.logo, tinyPng);
  });

  test("re-running the wizard keeps dashboard-managed listing fields", async () => {
    const { token, listingId } = await newCompany();
    await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Dashboard Name", logo: tinyPng } });
    await api("POST", "/api/companies/services", { token, body: { name: "Dashboard Service" } });
    await api("PUT", "/api/companies/service-areas", { token, body: { areasCovered: "Austin" } });

    const res = await api("POST", "/api/companies/onboarding", {
      token,
      body: { formData: { companyName: "Wizard Name", companyLogo: "https://example.com/wizard.png", serviceAreas: "Dallas" }, services: [{ name: "Wizard Service" }] },
    });
    assert.equal(res.status, 201);
    const listing = (await api("GET", `/api/companies/public/${listingId}`)).body.data;
    assert.equal(listing.companyName, "Dashboard Name");
    assert.equal(listing.logo, tinyPng);
    assert.deepEqual(listing.services, ["Dashboard Service"]);
    assert.deepEqual(listing.serviceAreas, ["Austin"]);
  });

  test("wizard rejects unsafe image URLs and handles symbol-only names", async () => {
    const { token } = await newCompany({ publish: false });
    const bad = await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Ok", companyLogo: "javascript:alert(1)" } } });
    assert.equal(bad.status, 400);
    assert.ok(bad.body.errors.companyLogo);
    const symbols = await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "★★★" } } });
    assert.equal(symbols.status, 201);
    assert.match(symbols.body.data.slug, /^company-[a-f0-9]{6}$/);
  });
});

describe("public endpoints", () => {
  test("only expose public content for published listings", async () => {
    const { token, listingId } = await newCompany();
    await api("POST", "/api/companies/blogs", { token, body: { title: "Draft", excerpt: "E", content: "C" } });
    await api("POST", "/api/companies/blogs", { token, body: { title: "Live", excerpt: "E", content: "C", status: "published" } });
    await api("POST", "/api/companies/previous-projects", { token, body: { title: "Hidden", service: "S", description: "D", visible: false } });
    await api("POST", "/api/companies/previous-projects", { token, body: { title: "Shown", service: "S", description: "D" } });
    await api("POST", "/api/companies/special-offers", { token, body: { title: "Expired", endDate: "2020-01-01" } });
    await api("POST", "/api/companies/special-offers", { token, body: { title: "Paused", active: false } });
    await api("POST", "/api/companies/special-offers", { token, body: { title: "Future", startDate: "2099-01-01" } });
    await api("POST", "/api/companies/special-offers", { token, body: { title: "Current", endDate: "2099-01-01" } });
    await api("PUT", "/api/companies/booking", { token, body: { workingDays: "Mon–Fri" } });

    const titles = async (section) => (await api("GET", `/api/companies/${section}/public/${listingId}`)).body.data.map((item) => item.title);
    assert.deepEqual(await titles("blogs"), ["Live"]);
    assert.deepEqual(await titles("previous-projects"), ["Shown"]);
    assert.deepEqual(await titles("special-offers"), ["Current"]);

    const booking = await api("GET", `/api/companies/booking/public/${listingId}`);
    assert.equal(booking.body.data.workingDays, "Mon–Fri");
    assert.equal(booking.body.data.company, undefined, "public data hides the company id");

    assert.equal((await api("GET", `/api/companies/blogs/public/${new mongoose.Types.ObjectId()}`)).status, 404);
  });
});
