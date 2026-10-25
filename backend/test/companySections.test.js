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
    const { body: user } = await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: "U", email: "u-sections@example.com", password: "password123" } });
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

describe("onboarding wizard steps", () => {
  test("each step is saved to the database and loads back to resume the wizard", async () => {
    const { token } = await newCompany({ publish: false });
    const empty = (await api("GET", "/api/companies/onboarding", { token })).body.data;
    assert.deepEqual([empty.completedSteps, empty.listing, empty.submittedAt], [[], null, null]);

    const step1 = await api("PUT", "/api/companies/onboarding/steps/company-information", { token, body: { formData: { companyName: "  Step Co ", tagline: "Fast", contactPerson: "not in this step" } } });
    assert.equal(step1.status, 200);
    assert.equal(step1.body.listing, null, "nothing is published before the final submit");
    await api("PUT", "/api/companies/onboarding/steps/contact", { token, body: { formData: { primaryPhone: "555-0100", email: "hi@step.co" } } });
    await api("PUT", "/api/companies/onboarding/steps/location", { token, body: { formData: { headquarters: "NYC" }, locations: [{ city: "Albany", state: "NY", evil: "dropped" }] } });

    const saved = (await api("GET", "/api/companies/onboarding", { token })).body.data;
    assert.equal(saved.formData.companyName, "Step Co");
    assert.equal(saved.formData.tagline, "Fast");
    assert.equal(saved.formData.contactPerson, "", "fields from other steps are ignored");
    assert.equal(saved.formData.primaryPhone, "555-0100");
    assert.equal(saved.locations[0].city, "Albany");
    assert.equal(saved.locations[0].evil, undefined);
    assert.deepEqual(saved.completedSteps, ["company-information", "contact", "location"]);
    assert.equal((await api("GET", "/api/companies/public?search=Step%20Co")).body.data?.some?.((l) => l.companyName === "Step Co") ?? false, false);
  });

  test("validates each step", async () => {
    const { token } = await newCompany({ publish: false });
    assert.equal((await api("PUT", "/api/companies/onboarding/steps/company-information", { token, body: { formData: { companyName: "  " } } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/onboarding/steps/company-information", { token, body: { formData: { companyName: { $gt: "" } } } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/onboarding/steps/branding", { token, body: { formData: { companyLogo: "javascript:alert(1)" } } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/onboarding/steps/services", { token, body: { services: "nope" } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/onboarding/steps/nope", { token, body: {} })).status, 404);
    assert.equal((await api("PUT", "/api/companies/onboarding/steps/contact", { body: {} })).status, 401);
  });

  test("after publishing, editing any step updates the live listing directly", async () => {
    const { token } = await newCompany({ publish: false });
    await api("PUT", "/api/companies/onboarding/steps/company-information", { token, body: { formData: { companyName: "Live Co", tagline: "Old tagline" } } });
    await api("PUT", "/api/companies/onboarding/steps/contact", { token, body: { formData: { primaryPhone: "555-0001" } } });
    const draft = (await api("GET", "/api/companies/onboarding", { token })).body.data;
    const published = await api("POST", "/api/companies/onboarding", { token, body: draft });
    assert.equal(published.status, 201);
    const listingId = published.body.data._id;

    const loaded = (await api("GET", "/api/companies/onboarding", { token })).body.data;
    assert.ok(loaded.submittedAt);
    assert.equal(loaded.listing._id, listingId);
    assert.equal(loaded.completedSteps.length, 8);

    const edit = await api("PUT", "/api/companies/onboarding/steps/company-information", { token, body: { formData: { companyName: "Live Co", tagline: "New tagline" } } });
    assert.equal(edit.status, 200);
    assert.equal(edit.body.listing.tagline, "New tagline");
    await api("PUT", "/api/companies/onboarding/steps/contact", { token, body: { formData: { primaryPhone: "555-0002" } } });
    const pub = (await api("GET", `/api/companies/public/${listingId}`)).body.data;
    assert.equal(pub.tagline, "New tagline");
    assert.equal(pub.phone, "555-0002");
  });

  test("a listing published before step saves existed can still be loaded and edited", async () => {
    const { token } = await newCompany({ publish: false });
    const { CompanyOnboardingDraft } = await import("../src/company/onboarding/models/CompanyOnboardingDraft.js");
    const res = await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Legacy Co", tagline: "Since 1990", primaryPhone: "555-0003", companyHistory: "Long" }, services: [{ name: "Drains" }] } });
    await CompanyOnboardingDraft.deleteOne({ company: res.body.data.company });

    const loaded = (await api("GET", "/api/companies/onboarding", { token })).body.data;
    assert.equal(loaded.formData.companyName, "Legacy Co");
    assert.equal(loaded.formData.primaryPhone, "555-0003");
    assert.equal(loaded.formData.companyHistory, "Long");
    assert.equal(loaded.services[0].name, "Drains");
    assert.ok(loaded.submittedAt);

    const edit = await api("PUT", "/api/companies/onboarding/steps/contact", { token, body: { formData: { primaryPhone: "555-0004" } } });
    assert.equal(edit.body.listing.phone, "555-0004");
    assert.equal(edit.body.listing.tagline, "Since 1990", "other steps keep their saved values");
  });
});

describe("opening hours, deleting, and the public profile", () => {
  const week = [
    { day: "Monday", isOpen: true, opensAt: "08:00", closesAt: "18:00" },
    { day: "saturday", isOpen: "true", opensAt: "09:00", closesAt: "13:00" },
    { day: "sunday", isOpen: false, opensAt: "10:00", closesAt: "12:00" },
  ];

  test("weekly opening hours are validated, saved in day order, and published", async () => {
    const { token, listingId } = await newCompany();
    const bad = [
      [{ day: "funday", isOpen: true, opensAt: "08:00", closesAt: "18:00" }],
      [{ day: "monday", isOpen: true, opensAt: "8am", closesAt: "18:00" }],
      [{ day: "monday", isOpen: true, opensAt: "08:00", closesAt: "08:00" }],
      [{ day: "monday", isOpen: false }, { day: "monday", isOpen: false }],
    ];
    for (const weeklyHours of bad) assert.equal((await api("PUT", "/api/companies/onboarding/steps/operations", { token, body: { weeklyHours } })).status, 400, JSON.stringify(weeklyHours));

    const res = await api("PUT", "/api/companies/onboarding/steps/operations", { token, body: { formData: { emergencyHours: "24/7 by phone" }, weeklyHours: [...week].reverse() } });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.data.weeklyHours, [
      { day: "monday", isOpen: true, opensAt: "08:00", closesAt: "18:00" },
      { day: "saturday", isOpen: true, opensAt: "09:00", closesAt: "13:00" },
      { day: "sunday", isOpen: false, opensAt: "", closesAt: "" },
    ]);
    const profile = (await api("GET", `/api/companies/public/${listingId}/profile`)).body.data;
    assert.equal(profile.hours.weeklyHours.length, 3);
    assert.equal(profile.hours.emergencyHours, "24/7 by phone");
    const card = (await api("GET", "/api/companies/public")).body.data.find((item) => item._id === listingId);
    assert.equal(card.weeklyHours[0].opensAt, "08:00");
  });

  test("the public profile includes every public section, and nothing private", async () => {
    const { token, listingId } = await newCompany();
    await api("PUT", "/api/companies/onboarding/steps/business-profile", { token, body: { formData: { companyHistory: "Since 1999", taxIdentificationNumber: "SECRET-TAX", yearEstablished: "1999" } } });
    await api("POST", "/api/companies/team", { token, body: { name: "Sam", role: "Lead", specialties: "Drains, Heaters", experienceYears: 12, certificates: ["Master Plumber"] } });
    await api("POST", "/api/companies/reviews", { token, body: { customer: "Ann", rating: 5, review: "Great" } });
    await api("POST", "/api/companies/reviews", { token, body: { customer: "Bob", rating: 4, review: "Good" } });
    await api("POST", "/api/companies/blogs", { token, body: { title: "Live post", excerpt: "E", content: "C", status: "published" } });
    await api("POST", "/api/companies/blogs", { token, body: { title: "Draft post", excerpt: "E", content: "C" } });
    await api("POST", "/api/companies/previous-projects", { token, body: { title: "Shown", service: "Repipe", description: "D" } });
    await api("POST", "/api/companies/previous-projects", { token, body: { title: "Hidden", service: "Repipe", description: "D", visible: false } });
    await api("POST", "/api/companies/special-offers", { token, body: { title: "Spring", discount: "10% off", promoCode: "spring10" } });
    await api("POST", "/api/companies/faqs", { token, body: { question: "Q?", answer: "A" } });

    const res = await api("GET", `/api/companies/public/${listingId}/profile`);
    assert.equal(res.status, 200);
    const p = res.body.data;
    assert.deepEqual(p.team.map((m) => [m.name, m.specialties, m.experienceYears, m.certificates]), [["Sam", ["Drains", "Heaters"], 12, ["Master Plumber"]]]);
    assert.deepEqual([p.rating, p.reviewCount], [4.5, 2]);
    assert.deepEqual(p.blogs.map((b) => b.title), ["Live post"]);
    assert.deepEqual(p.projects.map((b) => b.title), ["Shown"]);
    assert.deepEqual([p.offer.discount, p.offer.promoCode], ["10% off", "SPRING10"]);
    assert.equal(p.faqs.length, 1);
    assert.equal(p.about.companyHistory, "Since 1999");
    assert.equal(p.established, 1999);
    assert.equal(p.company, undefined);
    assert.ok(!JSON.stringify(p).includes("SECRET-TAX"), "tax numbers are never public");
    assert.equal((await api("GET", "/api/companies/public/000000000000000000000000/profile")).status, 404);
    assert.equal((await api("GET", "/api/companies/public/not-an-id/profile")).status, 404, "treated as an unknown slug");
  });

  test("a step can be cleared, and the whole listing can be deleted", async () => {
    const { token, listingId } = await newCompany();
    await api("PUT", "/api/companies/onboarding/steps/contact", { token, body: { formData: { primaryPhone: "555-0100" } } });
    assert.equal((await api("GET", `/api/companies/public/${listingId}`)).body.data.phone, "555-0100");

    const cleared = await api("DELETE", "/api/companies/onboarding/steps/contact", { token });
    assert.equal(cleared.status, 200);
    assert.equal(cleared.body.data.formData.primaryPhone, "");
    assert.ok(!cleared.body.data.completedSteps.includes("contact"));
    assert.ok(!(await api("GET", `/api/companies/public/${listingId}`)).body.data.phone, "live listing updated");
    assert.equal((await api("DELETE", "/api/companies/onboarding/steps/company-information", { token })).status, 400, "name can't be cleared while live");
    assert.equal((await api("DELETE", "/api/companies/onboarding/steps/nope", { token })).status, 404);

    const removed = await api("DELETE", "/api/companies/onboarding", { token });
    assert.equal(removed.status, 200);
    assert.equal(removed.body.data.deleted, true);
    assert.equal((await api("GET", `/api/companies/public/${listingId}`)).status, 404);
    const after = (await api("GET", "/api/companies/onboarding", { token })).body.data;
    assert.deepEqual([after.listing, after.submittedAt, after.completedSteps], [null, null, []]);
    assert.equal((await api("DELETE", "/api/companies/onboarding", {})).status, 401);
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
    assert.match(symbols.body.data.slug, /^company(-\d+)?$/);
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

describe("clean company URLs and record deletes", () => {
  const signup = async (name) => (await api("POST", "/api/auth/companies/signup", { body: { companyName: name, email: `${name.replace(/\W/g, "").toLowerCase()}${++seq}@example.com`, password: "password123" } })).body.token;

  test("saving the Company Profile creates a public listing with a clean, unique slug", async () => {
    const first = await signup("Abc Plumbing");
    const second = await signup("Abc Plumbing Two");
    const one = await api("PUT", "/api/companies/header-profile", { token: first, body: { companyName: "ABC Plumbing!" } });
    assert.equal(one.status, 200);
    await api("PUT", "/api/companies/header-profile", { token: second, body: { companyName: "abc plumbing" } });
    const cards = (await api("GET", "/api/companies/public")).body.data;
    const slugs = cards.filter((card) => /^abc plumbing/i.test(card.companyName)).map((card) => card.slug).sort();
    assert.deepEqual(slugs, ["abc-plumbing", "abc-plumbing-2"]);

    const bySlug = await api("GET", "/api/companies/public/abc-plumbing/profile");
    assert.equal(bySlug.status, 200);
    assert.equal(bySlug.body.data.companyName, "ABC Plumbing!");
    assert.equal((await api("GET", `/api/companies/public/${bySlug.body.data._id}/profile`)).body.data.slug, "abc-plumbing");
    assert.equal((await api("GET", "/api/companies/public/no-such-company/profile")).status, 404);
  });

  test("renaming keeps the old slug working and reserved", async () => {
    const token = await signup("Rename Me");
    await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Old Name Plumbing" } });
    await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Old Name Plumbing" } });
    assert.equal((await api("GET", "/api/companies/public/old-name-plumbing/profile")).body.data.slug, "old-name-plumbing", "unchanged name keeps its slug");
    await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "New Name Plumbing" } });
    const viaOld = await api("GET", "/api/companies/public/old-name-plumbing/profile");
    assert.equal(viaOld.status, 200);
    assert.equal(viaOld.body.data.slug, "new-name-plumbing", "old links resolve to the current slug");
    const other = await signup("Squatter");
    await api("PUT", "/api/companies/header-profile", { token: other, body: { companyName: "Old Name Plumbing" } });
    const squatter = (await api("GET", "/api/companies/public")).body.data.find((card) => card.companyName === "Old Name Plumbing" && card.slug !== "new-name-plumbing");
    assert.equal(squatter.slug, "old-name-plumbing-2", "old slugs are not reused by other companies");
  });

  test("the wizard also uses clean slugs", async () => {
    const token = await signup("Wizard Slug");
    const res = await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Wizard Slug Plumbing" } } });
    assert.equal(res.body.data.slug, "wizard-slug-plumbing");
  });

  test("single-record sections can be deleted", async () => {
    const token = await signup("Delete Records");
    await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Delete Records Co" } });
    await api("PUT", "/api/companies/service-areas", { token, body: { areasCovered: "Austin, Dallas" } });
    await api("PUT", "/api/companies/company-overview", { token, body: { teamSize: 5 } });
    await api("PUT", "/api/companies/booking", { token, body: { workingDays: "Mon–Fri" } });
    let card = (await api("GET", "/api/companies/public")).body.data.find((item) => item.companyName === "Delete Records Co");
    assert.deepEqual(card.serviceAreas, ["Austin", "Dallas"]);

    for (const section of ["service-areas", "company-overview", "booking"]) {
      const res = await api("DELETE", `/api/companies/${section}`, { token });
      assert.equal(res.status, 200, section);
      assert.equal((await api("GET", `/api/companies/${section}`, { token })).body.data, null, section);
      assert.equal((await api("DELETE", `/api/companies/${section}`, { token })).status, 404, `${section} twice`);
    }
    card = (await api("GET", "/api/companies/public")).body.data.find((item) => item.companyName === "Delete Records Co");
    assert.deepEqual(card.serviceAreas, [], "listing areas cleared");
    assert.equal((await api("DELETE", "/api/companies/booking", {})).status, 401);

    // Deleting the profile removes a listing that only the profile created.
    assert.equal((await api("DELETE", "/api/companies/header-profile", { token })).status, 200);
    assert.ok(!(await api("GET", "/api/companies/public")).body.data.some((item) => item.companyName === "Delete Records Co"));
  });
});

describe("service areas with services, card details, and the public blog feed", () => {
  test("areas list their services; coordinates and areas reach the listing card", async () => {
    const { token, listingId } = await newCompany();
    assert.equal((await api("PUT", "/api/companies/service-areas", { token, body: { latitude: 30.2 } })).status, 400, "latitude needs longitude");
    assert.equal((await api("PUT", "/api/companies/service-areas", { token, body: { latitude: 120, longitude: 0 } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/service-areas", { token, body: { areaDetails: [{ services: ["Drains"] }] } })).status, 400, "area name required");
    for (const name of ["Drains", "Water heaters"]) await api("POST", "/api/companies/services", { token, body: { name } });
    const res = await api("PUT", "/api/companies/service-areas", { token, body: { branchLocation: "Austin, TX", latitude: 30.2672, longitude: -97.7431, areaDetails: [{ name: "Austin", services: "Drains, Water heaters" }, { name: "Round Rock", services: [] }, { name: "austin", services: [] }] } });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.data.areaDetails.map(({ name, services }) => ({ name, services })), [{ name: "Austin", services: ["Drains", "Water heaters"] }, { name: "Round Rock", services: [] }], "duplicate names are dropped");
    assert.equal(res.body.data.areasCovered, "Austin, Round Rock");

    await api("POST", "/api/companies/team", { token, body: { name: "Sam", role: "Lead" } });
    await api("POST", "/api/companies/blogs", { token, body: { title: "Post A", excerpt: "E", content: "C", status: "published" } });
    await api("POST", "/api/companies/blogs", { token, body: { title: "Draft B", excerpt: "E", content: "C" } });
    const card = (await api("GET", "/api/companies/public")).body.data.find((item) => item._id === listingId);
    assert.deepEqual(card.coordinates, { lat: 30.2672, lng: -97.7431 });
    assert.deepEqual(card.serviceAreas, ["Austin", "Round Rock"]);
    assert.equal(card.location, "Austin, TX", "base location fills an empty listing location");
    assert.equal(card.blogCount, 1);
    assert.deepEqual(card.teamPreview, [{ name: "Sam", role: "Lead" }]);
    const profile = (await api("GET", `/api/companies/public/${listingId}/profile`)).body.data;
    assert.equal(profile.serviceArea.areaDetails[0].services.length, 2);

    // Old clients that only send the text still work.
    const text = await api("PUT", "/api/companies/service-areas", { token, body: { areasCovered: "Dallas, Plano" } });
    assert.deepEqual(text.body.data.areaDetails.map(({ name, services }) => ({ name, services })), [{ name: "Dallas", services: [] }, { name: "Plano", services: [] }]);
  });

  test("GET /api/blogs lists published posts from published companies and freelancers", async () => {
    const { token } = await newCompany();
    await api("POST", "/api/companies/blogs", { token, body: { title: "Feed Post", excerpt: "Short", content: "word ".repeat(450), status: "published" } });
    await api("POST", "/api/companies/blogs", { token, body: { title: "Hidden Draft", excerpt: "E", content: "C" } });
    const { body: fl } = await api("POST", "/api/auth/freelancers/signup", { body: { name: "Feed Fran", email: `feedfran${++seq}@example.com`, password: "password123" } });
    await api("PUT", "/api/freelancers/header-profile", { token: fl.token, body: { displayName: "Feed Fran" } });
    await api("POST", "/api/freelancers/blogs", { token: fl.token, body: { title: "Freelancer Feed Post", excerpt: "E", content: "C", status: "published" } });

    const feed = (await api("GET", "/api/blogs")).body.data;
    const post = feed.find((item) => item.title === "Feed Post");
    assert.ok(post);
    assert.equal(post.content, undefined, "article text is not sent");
    assert.equal(post.readTime, 2);
    assert.equal(post.provider.type, "company");
    assert.ok(post.provider.slug);
    assert.ok(!feed.some((item) => item.title === "Hidden Draft"));
    assert.equal(feed.find((item) => item.title === "Freelancer Feed Post")?.provider.name, "Feed Fran");
  });
});

describe("social links and up-to-date area services", () => {
  test("social links are validated and shown on the public profile", async () => {
    const { token, listingId } = await newCompany();
    assert.equal((await api("PUT", "/api/companies/social-links", { body: {} })).status, 401);
    assert.equal((await api("PUT", "/api/companies/social-links", { token, body: { facebook: "javascript:alert(1)" } })).status, 400);
    assert.equal((await api("PUT", "/api/companies/social-links", { token, body: { instagram: "instagram.com/me" } })).status, 400, "needs a full https link");
    const res = await api("PUT", "/api/companies/social-links", { token, body: { facebook: "https://facebook.com/abc", twitter: "https://x.com/abc", youtube: "https://youtube.com/@abc", company: "000000000000000000000000" } });
    assert.equal(res.status, 200);
    const profile = (await api("GET", `/api/companies/public/${listingId}/profile`)).body.data;
    assert.deepEqual(profile.socialLinks, { facebook: "https://facebook.com/abc", twitter: "https://x.com/abc", youtube: "https://youtube.com/@abc" });
    assert.equal((await api("DELETE", "/api/companies/social-links", { token })).status, 200);
    assert.deepEqual((await api("GET", `/api/companies/public/${listingId}/profile`)).body.data.socialLinks, {});
  });

  test("renamed or deleted services drop out of the areas on the public profile", async () => {
    const { token, listingId } = await newCompany();
    const drains = (await api("POST", "/api/companies/services", { token, body: { name: "Drains" } })).body.data;
    await api("POST", "/api/companies/services", { token, body: { name: "Heaters" } });
    await api("PUT", "/api/companies/service-areas", { token, body: { areaDetails: [{ name: "Austin", services: ["Drains", "Heaters"] }] } });
    await api("PUT", `/api/companies/services/${drains._id}`, { token, body: { name: "Drain Cleaning" } });
    const area = (await api("GET", `/api/companies/public/${listingId}/profile`)).body.data.serviceArea.areaDetails[0];
    assert.deepEqual(area.services, ["Heaters"]);
  });

  test("freelancers have social links too", async () => {
    const { body } = await api("POST", "/api/auth/freelancers/signup", { body: { name: "Social Fran", email: `socialfran${++seq}@example.com`, password: "password123" } });
    await api("PUT", "/api/freelancers/header-profile", { token: body.token, body: { displayName: "Social Fran" } });
    await api("PUT", "/api/freelancers/social-links", { token: body.token, body: { linkedin: "https://linkedin.com/in/fran" } });
    const listing = (await api("GET", "/api/freelancers/public")).body.data.find((item) => item.displayName === "Social Fran");
    assert.equal((await api("GET", `/api/freelancers/public/${listing._id}/profile`)).body.data.socialLinks.linkedin, "https://linkedin.com/in/fran");
  });
});

describe("service-area radius and map coordinates", () => {
  test("each area keeps its own radius and services, and gets real coordinates when saved", async () => {
    const { token, listingId } = await newCompany();
    for (const name of ["Drains", "Heaters"]) await api("POST", "/api/companies/services", { token, body: { name } });
    const res = await api("PUT", "/api/companies/service-areas", { token, body: {
      branchLocation: "Austin, TX", radius: 25,
      areaDetails: [
        { name: "Round Rock", services: ["Drains"], radius: 10 },
        { name: "Los Angeles, CA", services: [], radius: 40 },
        { name: "Nowhere Town", services: ["Heaters"] },
        { name: "Pinned", services: [], latitude: 31.1, longitude: -98.2 },
      ],
    } });
    assert.equal(res.status, 200);
    const [rr, la, nowhere, pinned] = res.body.data.areaDetails;
    assert.deepEqual([rr.radius, rr.services, rr.latitude], [10, ["Drains"], 30.1], "uses the base location's state");
    assert.equal(la.radius, 40);
    assert.equal(la.latitude, 30 + "Los Angeles".length / 100, "an area with its own state is looked up there");
    assert.equal(nowhere.latitude, undefined, "unknown places are saved without coordinates");
    assert.deepEqual([pinned.latitude, pinned.longitude], [31.1, -98.2], "given coordinates are kept");
    assert.equal((await api("PUT", "/api/companies/service-areas", { token, body: { areaDetails: [{ name: "X", radius: 900 }] } })).status, 400);

    const profile = (await api("GET", `/api/companies/public/${listingId}/profile`)).body.data;
    assert.equal(profile.serviceArea.radius, 25);
    assert.equal(profile.serviceArea.areaDetails[0].radius, 10);
    assert.ok(Number.isFinite(profile.serviceArea.areaDetails[0].latitude));
  });

  test("an area's own address decides where its map is centred", async () => {
    const { token } = await newCompany();
    const res = await api("PUT", "/api/companies/service-areas", { token, body: { branchLocation: "Austin, TX", areaDetails: [
      { name: "North Branch", address: "100 Main St, Round Rock, TX", radius: 8 },
      { name: "Cedar Park", address: "Unknown address" },
    ] } });
    assert.equal(res.status, 200);
    const [north, cedar] = res.body.data.areaDetails;
    assert.deepEqual([north.address, north.latitude, north.longitude, north.radius], ["100 Main St, Round Rock, TX", 30.5, -97.5, 8]);
    assert.equal(cedar.latitude, 30 + "Cedar Park".length / 100, "falls back to the area name when the address isn't found");
    assert.equal((await api("GET", "/api/location/place?address=100%20Main%20St%2C%20Austin%2C%20TX")).body.data.latitude, 30.5);
  });

  test("GET /api/location/place finds a city's centre", async () => {
    assert.equal((await api("GET", "/api/location/place?name=Round%20Rock&state=TX")).body.data.stateCode, "TX");
    assert.equal((await api("GET", "/api/location/place?name=Los%20Angeles,%20CA")).status, 200, "state inside the name");
    assert.equal((await api("GET", "/api/location/place?name=Nowhere&state=TX")).status, 404);
    assert.equal((await api("GET", "/api/location/place")).status, 400);
  });
});
