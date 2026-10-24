// Integration tests: real Express app + a throwaway local mongod.
// Run with `npm test` (requires the `mongod` binary on PATH).
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { startTestServer } from "./helpers/testServer.js";

const { Company } = await import("../src/auth/company/models/Company.js");
const { CompanyBranding } = await import("../src/company/onboarding/models/CompanyBranding.js");
const { Freelancer } = await import("../src/auth/freelancer/models/Freelancer.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());

let seq = 0;
const email = () => `user${++seq}@example.com`;

describe("auth", () => {
  test("user signup, login (typed and unified) and /me round-trip", async () => {
    const e = email();
    const signup = await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: "Ann", email: e.toUpperCase(), password: "password123" } });
    assert.equal(signup.status, 201);
    assert.equal(signup.body.account.email, e);
    assert.equal(signup.body.account.password, undefined);

    const typed = await api("POST", "/api/auth/users/login", { body: { email: e, password: "password123" } });
    assert.equal(typed.status, 200);
    const unified = await api("POST", "/api/auth/login", { body: { email: e, password: "password123" } });
    assert.equal(unified.status, 200);
    assert.equal(unified.body.account.accountType, "user");

    const me = await api("GET", "/api/auth/users/me", { token: unified.body.token });
    assert.equal(me.status, 200);
    assert.equal(me.body.account.email, e);
  });

  test("wrong password and duplicate email are rejected", async () => {
    const e = email();
    await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: "Bob", email: e, password: "password123" } });
    assert.equal((await api("POST", "/api/auth/login", { body: { email: e, password: "nope-nope" } })).status, 401);
    assert.equal((await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: "Bob", email: e, password: "password123" } })).status, 409);
  });

  test("a token for one account type cannot read another type's /me", async () => {
    const { body } = await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: "Cat", email: email(), password: "password123" } });
    assert.equal((await api("GET", "/api/auth/companies/me", { token: body.token })).status, 403);
    assert.equal((await api("GET", "/api/auth/users/me", { token: "garbage" })).status, 401);
  });

  test("signup ignores privileged fields (no mass assignment)", async () => {
    const forgedId = new mongoose.Types.ObjectId().toString();
    const company = await api("POST", "/api/auth/companies/signup", {
      body: { companyName: "Acme", email: email(), password: "password123", status: "approved", googleId: "forged", _id: forgedId },
    });
    assert.equal(company.status, 201);
    const saved = await Company.findById(company.body.account._id).lean();
    assert.equal(saved.status, "pending");
    assert.equal(saved.googleId, undefined);
    assert.notEqual(String(saved._id), forgedId);

    const freelancer = await api("POST", "/api/auth/freelancers/signup", {
      body: { name: "Fay", email: email(), password: "password123", verificationStatus: "verified" },
    });
    assert.equal(freelancer.status, 201);
    assert.equal((await Freelancer.findById(freelancer.body.account._id).lean()).verificationStatus, "pending");
  });

  test("non-string credentials return 400, not 500", async () => {
    assert.equal((await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: "X", email: ["a@b.c"], password: "password123" } })).status, 400);
    assert.equal((await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: "X", email: email(), password: ["password123"] } })).status, 400);
    assert.equal((await api("POST", "/api/auth/users/signup", { body: { zipCode: "78701", name: ["X"], email: email(), password: "password123" } })).status, 400);
  });

  test("invalid Google credential returns 401, not 500", async () => {
    const res = await api("POST", "/api/auth/users/google", { body: { credential: "not-a-real-token" } });
    assert.equal(res.status, 401);
  });

  test("malformed JSON returns 400 and oversize body returns 413", async () => {
    assert.equal((await api("POST", "/api/auth/login", { raw: "{bad json" })).status, 400);
    assert.equal((await api("POST", "/api/auth/login", { raw: JSON.stringify({ email: "x".repeat(4 * 1024 * 1024) }) })).status, 413);
  });
});

describe("company listing", () => {
  const signupCompany = async () => (await api("POST", "/api/auth/companies/signup", { body: { companyName: "Pipe Co", email: email(), password: "password123" } })).body;

  test("onboarding publishes a listing that is publicly fetchable by id", async () => {
    const { token } = await signupCompany();
    const res = await api("POST", "/api/companies/onboarding", {
      token,
      body: { formData: { companyName: "Pipe Co", tagline: "Fast", serviceAreas: "Dallas, Plano", companyLogo: "https://x/logo.png" }, services: [{ name: "Drain cleaning" }, {}], locations: [{ city: "Dallas", state: "TX" }] },
    });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.data.serviceAreas, ["Dallas", "Plano"]);
    assert.deepEqual(res.body.data.services, ["Drain cleaning"]);

    const list = await api("GET", "/api/companies/public");
    assert.equal(list.status, 200);
    assert.ok(list.body.data.some((item) => item._id === res.body.data._id));

    const one = await api("GET", `/api/companies/public/${res.body.data._id}`);
    assert.equal(one.status, 200);
    assert.equal(one.body.data.companyName, "Pipe Co");
    assert.equal((await api("GET", `/api/companies/public/${new mongoose.Types.ObjectId()}`)).status, 404);
    assert.equal((await api("GET", "/api/companies/public/not-an-id")).status, 400);
  });

  test("onboarding cannot reassign the owning company via formData", async () => {
    const { token, account } = await signupCompany();
    const victim = new mongoose.Types.ObjectId().toString();
    const res = await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Sneaky", company: victim, seoTitle: "SEO" } } });
    assert.equal(res.status, 201);
    const branding = await CompanyBranding.findOne({ company: account._id }).lean();
    assert.ok(branding, "branding should stay owned by the authenticated company");
    assert.equal(branding.seoTitle, "SEO");
    assert.equal(await CompanyBranding.exists({ company: victim }), null);
  });

  test("onboarding rejects malformed payloads with 400", async () => {
    const { token } = await signupCompany();
    assert.equal((await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: 5 } } })).status, 400);
    assert.equal((await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Ok" }, services: "nope" } })).status, 400);
    assert.equal((await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Ok" }, services: [null] } })).status, 400);
    assert.equal((await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Ok", serviceAreas: 5 } } })).status, 400);
  });

  test("onboarding requires a company token", async () => {
    assert.equal((await api("POST", "/api/companies/onboarding", { body: {} })).status, 401);
  });
});

describe("header profile", () => {
  test("save then load round-trips and syncs the listing name", async () => {
    const { token } = (await api("POST", "/api/auth/companies/signup", { body: { companyName: "Hdr", email: email(), password: "password123" } })).body;
    await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: "Hdr" } } });
    const saved = await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Hdr Renamed", yearsInBusiness: "12" } });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.data.yearsInBusiness, 12);
    const loaded = await api("GET", "/api/companies/header-profile", { token });
    assert.equal(loaded.body.data.companyName, "Hdr Renamed");
    const list = await api("GET", "/api/companies/public");
    assert.ok(list.body.data.some((item) => item.companyName === "Hdr Renamed"));
  });

  test("invalid input returns 400 with a useful message", async () => {
    const { token } = (await api("POST", "/api/auth/companies/signup", { body: { companyName: "Hdr2", email: email(), password: "password123" } })).body;
    assert.equal((await api("PUT", "/api/companies/header-profile", { token, body: { companyName: 42 } })).status, 400);
    const badYears = await api("PUT", "/api/companies/header-profile", { token, body: { companyName: "Ok", yearsInBusiness: "abc" } });
    assert.equal(badYears.status, 400);
    assert.match(badYears.body.errors.yearsInBusiness, /number/);
  });
});
