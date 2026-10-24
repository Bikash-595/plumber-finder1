// Email verification codes, Gmail/domain checks, ZIP codes, and password reset.
process.env.EMAIL_VERIFICATION = "on";
process.env.EMAIL_DOMAIN_CHECK = "off"; // DNS is checked separately below
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

let api, stop, devOutbox;
before(async () => {
  ({ api, stop } = await startTestServer());
  ({ devOutbox } = await import("../src/auth/verification/services/mailer.js"));
});
after(() => stop());

let seq = 0;
const newEmail = () => `verify.user${++seq}@gmail.com`;
const lastCode = (email) => {
  const mail = [...devOutbox].reverse().find((item) => item.to === email);
  return mail?.text.match(/\b(\d{6})\b/)?.[1];
};
const signupUser = (email, extra = {}) => api("POST", "/api/auth/users/signup", { body: { name: "Vera", email, password: "password123", zipCode: "78701", ...extra } });

describe("signup needs the emailed code", () => {
  test("signup sends a code instead of logging in; the code confirms the email and logs in", async () => {
    const email = newEmail();
    const res = await signupUser(email);
    assert.equal(res.status, 201);
    assert.equal(res.body.verificationRequired, true);
    assert.equal(res.body.token, undefined, "no token before the email is confirmed");
    const code = lastCode(email);
    assert.match(code, /^\d{6}$/);

    const login = await api("POST", "/api/auth/login", { body: { email, password: "password123" } });
    assert.equal(login.status, 403, "unconfirmed accounts can't log in");
    assert.equal(login.body.verificationRequired, true);

    const wrong = await api("POST", "/api/auth/verify-email", { body: { email, accountType: "user", code: code === "000000" ? "111111" : "000000" } });
    assert.equal(wrong.status, 400);
    assert.match(wrong.body.message, /incorrect/);

    const ok = await api("POST", "/api/auth/verify-email", { body: { email, accountType: "user", code } });
    assert.equal(ok.status, 200);
    assert.ok(ok.body.token);
    assert.equal(ok.body.account.emailVerified, true);
    assert.equal(ok.body.account.city, "Austin", "city comes from the ZIP lookup");
    assert.equal(ok.body.account.zipCode, "78701");
    assert.equal((await api("POST", "/api/auth/login", { body: { email, password: "password123" } })).status, 200);
  });

  test("codes are single-use, limited to 5 guesses, and resends have a cooldown", async () => {
    const email = newEmail();
    await signupUser(email);
    const code = lastCode(email);
    for (let i = 0; i < 5; i++) await api("POST", "/api/auth/verify-email", { body: { email, accountType: "user", code: "999999" === code ? "888888" : "999999" } });
    const locked = await api("POST", "/api/auth/verify-email", { body: { email, accountType: "user", code } });
    assert.equal(locked.status, 400, "even the right code fails after 5 wrong guesses");
    assert.match(locked.body.message, /Too many wrong attempts/);
    assert.equal((await api("POST", "/api/auth/resend-code", { body: { email, accountType: "user" } })).status, 429, "cooldown");
  });

  test("restarting an unfinished signup replaces the details; a confirmed email can't sign up again", async () => {
    const email = newEmail();
    await signupUser(email, { name: "First Try" });
    const again = await signupUser(email, { name: "Second Try", password: "newpassword9" });
    assert.equal(again.status, 201);
    const code = lastCode(email);
    const ok = await api("POST", "/api/auth/verify-email", { body: { email, accountType: "user", code } });
    assert.equal(ok.body.account.name, "Second Try");
    assert.equal((await api("POST", "/api/auth/login", { body: { email, password: "newpassword9" } })).status, 200);
    assert.equal((await signupUser(email)).status, 409);
  });

  test("companies and freelancers verify the same way", async () => {
    const email = newEmail();
    const res = await api("POST", "/api/auth/companies/signup", { body: { companyName: "Verify Co", email, password: "password123" } });
    assert.equal(res.body.verificationRequired, true);
    const ok = await api("POST", "/api/auth/verify-email", { body: { email, accountType: "company", code: lastCode(email) } });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.account.accountType, "company");
  });
});

describe("real email and ZIP checks", () => {
  test("invalid Gmail addresses are rejected before any account is created", async () => {
    for (const email of ["abc@gmail.com", "bad..dots@gmail.com", "under_score@gmail.com", ".start@gmail.com"]) {
      const res = await signupUser(email);
      assert.equal(res.status, 400, email);
      assert.equal(res.body.field, "email");
    }
  });

  test("customers need a real ZIP code; city and state come from the lookup, not the form", async () => {
    assert.equal((await signupUser(newEmail(), { zipCode: "" })).status, 400);
    assert.equal((await signupUser(newEmail(), { zipCode: "7870" })).status, 400);
    const missing = await signupUser(newEmail(), { zipCode: "00000" });
    assert.equal(missing.status, 400);
    assert.match(missing.body.message, /couldn't find that ZIP/);
    const email = newEmail();
    await signupUser(email, { city: "Fake City", state: "ZZ" });
    const ok = await api("POST", "/api/auth/verify-email", { body: { email, accountType: "user", code: lastCode(email) } });
    assert.deepEqual([ok.body.account.city, ok.body.account.state], ["Austin", "TX"]);
  });

  test("location lookups", async () => {
    assert.equal((await api("GET", "/api/location/zip/78701")).body.data.city, "Austin");
    assert.equal((await api("GET", "/api/location/zip/abc")).status, 400);
    assert.equal((await api("GET", "/api/location/zip/00000")).status, 404);
    assert.equal((await api("GET", "/api/location/reverse?lat=30.2672&lng=-97.7431")).body.data.zipCode, "78701");
    assert.equal((await api("GET", "/api/location/reverse?lat=200&lng=0")).status, 400);
  });

  test("the domain check rejects domains that can't receive email", async () => {
    const { emailDeliverabilityProblem } = await import("../src/auth/verification/services/emailDeliverability.js");
    process.env.EMAIL_DOMAIN_CHECK = "on";
    try {
      assert.match(await emailDeliverabilityProblem("someone@no-such-domain-plumberfinder-test.invalid"), /can't receive email/);
      assert.equal(await emailDeliverabilityProblem("real.person@gmail.com"), null);
    } finally {
      process.env.EMAIL_DOMAIN_CHECK = "off";
    }
  });
});

describe("Google / Apple accounts and password reset", () => {
  test("forgot password: a reset code sets a new password and confirms the email", async () => {
    const email = newEmail();
    await signupUser(email);
    const forgot = await api("POST", "/api/auth/password/forgot", { body: { email, accountType: "user" } });
    assert.equal(forgot.status, 200);
    const code = [...devOutbox].reverse().find((item) => item.to === email && /reset/i.test(item.subject)).text.match(/\b(\d{6})\b/)[1];
    assert.equal((await api("POST", "/api/auth/password/reset", { body: { email, accountType: "user", code, password: "short" } })).status, 400);
    const reset = await api("POST", "/api/auth/password/reset", { body: { email, accountType: "user", code, password: "brandnew123" } });
    assert.equal(reset.status, 200);
    assert.ok(reset.body.token);
    assert.equal((await api("POST", "/api/auth/login", { body: { email, password: "brandnew123" } })).status, 200);
    assert.equal((await api("POST", "/api/auth/password/reset", { body: { email, accountType: "user", code, password: "another123" } })).status, 400, "code is single-use");
  });

  test("forgot password doesn't reveal whether an account exists", async () => {
    const res = await api("POST", "/api/auth/password/forgot", { body: { email: "nobody.here@gmail.com", accountType: "user" } });
    assert.equal(res.status, 200);
    assert.ok(!devOutbox.some((item) => item.to === "nobody.here@gmail.com"));
  });
});
