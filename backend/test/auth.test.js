// Auth module tests: email rules, Google configuration, and Sign in with Apple against a fake Apple key server.
import { generateKeyPairSync } from "node:crypto";
import { createServer } from "node:http";
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { startTestServer } from "./helpers/testServer.js";

const { clearAppleKeyCache } = await import("../src/auth/apple/services/appleKeys.js");

const CLIENT_ID = "com.plumberfinder.web";
const makeKey = (kid) => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  return { kid, privateKey, jwk: { ...publicKey.export({ format: "jwk" }), kid, alg: "RS256", use: "sig" } };
};
const appleKey = makeKey("apple-key-1");
const impostorKey = makeKey("apple-key-1"); // same kid, different key

let api, stop, keyServer, keysUrl;
before(async () => {
  keyServer = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ keys: [appleKey.jwk] }));
  }).listen(0);
  keysUrl = `http://127.0.0.1:${keyServer.address().port}/auth/keys`;
  process.env.APPLE_KEYS_URL = keysUrl;
  process.env.APPLE_CLIENT_ID = `${CLIENT_ID}, com.plumberfinder.ios`;
  ({ api, stop } = await startTestServer());
});
after(async () => { await stop(); keyServer.close(); });
beforeEach(() => clearAppleKeyCache());

let seq = 0;
const uniqueEmail = () => `apple${++seq}@example.com`;
function appleToken(claims = {}, { key = appleKey, expiresIn = "10m", ...options } = {}) {
  return jwt.sign(
    { iss: "https://appleid.apple.com", aud: CLIENT_ID, sub: `apple-sub-${seq}`, email_verified: "true", ...claims },
    key.privateKey,
    { algorithm: "RS256", keyid: key.kid, expiresIn, ...options },
  );
}

describe("Sign in with Apple", () => {
  test("creates an account on first sign-in and returns the same account afterwards", async () => {
    const email = uniqueEmail();
    const identityToken = appleToken({ sub: "apple-new-user", email });
    const first = await api("POST", "/api/auth/users/apple", { body: { identityToken, name: { firstName: "Ana", lastName: "Lee" } } });
    assert.equal(first.status, 201, JSON.stringify(first.body));
    assert.equal(first.body.account.name, "Ana Lee");
    assert.equal(first.body.account.appleId, "apple-new-user");
    assert.equal(first.body.account.password, undefined);

    const again = await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ sub: "apple-new-user", email }) } });
    assert.equal(again.status, 200);
    assert.equal(again.body.account._id, first.body.account._id);

    const me = await api("GET", "/api/auth/users/me", { token: again.body.token });
    assert.equal(me.body.account.email, email);
  });

  test("uses the account's own name field (companyName) and accepts any configured client id", async () => {
    const identityToken = appleToken({ sub: "apple-company", email: uniqueEmail(), aud: "com.plumberfinder.ios" });
    const res = await api("POST", "/api/auth/companies/apple", { body: { identityToken, companyName: "Apple Pipes LLC", status: "approved" } });
    assert.equal(res.status, 201);
    assert.equal(res.body.account.companyName, "Apple Pipes LLC");
    assert.equal(res.body.account.status, "pending", "privileged fields are ignored");
  });

  test("links to an existing email/password account with the same email", async () => {
    const email = uniqueEmail();
    const signup = await api("POST", "/api/auth/users/signup", { body: { name: "Existing", email, password: "password123" } });
    const linked = await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ sub: "apple-link", email }) } });
    assert.equal(linked.status, 200);
    assert.equal(linked.body.account._id, signup.body.account._id);
    assert.equal(linked.body.account.appleId, "apple-link");
    assert.equal((await api("POST", "/api/auth/users/login", { body: { email, password: "password123" } })).status, 200, "password still works");
  });

  test("rejects tokens that fail verification", async () => {
    const email = uniqueEmail();
    const cases = {
      "wrong audience": appleToken({ email, aud: "com.someone.else" }),
      "wrong issuer": appleToken({ email, iss: "https://evil.example" }),
      expired: appleToken({ email }, { expiresIn: -10 }),
      "signed by another key": appleToken({ email }, { key: impostorKey }),
      "HS256 forgery": jwt.sign({ iss: "https://appleid.apple.com", aud: CLIENT_ID, sub: "x", email }, "secret", { algorithm: "HS256", keyid: appleKey.kid }),
      "not a JWT": "not-a-token",
    };
    for (const [name, identityToken] of Object.entries(cases)) {
      const res = await api("POST", "/api/auth/users/apple", { body: { identityToken } });
      assert.equal(res.status, 401, name);
    }
  });

  test("rejects unverified emails and mismatched nonces; accepts a matching nonce", async () => {
    assert.equal((await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ email: uniqueEmail(), email_verified: "false" }) } })).status, 401);
    const nonceToken = appleToken({ sub: "apple-nonce", email: uniqueEmail(), nonce: "abc123" });
    assert.equal((await api("POST", "/api/auth/users/apple", { body: { identityToken: nonceToken, nonce: "different" } })).status, 401);
    assert.equal((await api("POST", "/api/auth/users/apple", { body: { identityToken: nonceToken, nonce: "abc123" } })).status, 201);
  });

  test("tokens without an email work for known accounts only", async () => {
    const unknown = await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ sub: "apple-no-email" }) } });
    assert.equal(unknown.status, 400);
    await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ sub: "apple-returning", email: uniqueEmail() }) } });
    const returning = await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ sub: "apple-returning" }) } });
    assert.equal(returning.status, 200);
  });

  test("Apple-only accounts get a helpful message on password login", async () => {
    const email = uniqueEmail();
    await api("POST", "/api/auth/freelancers/apple", { body: { identityToken: appleToken({ sub: "apple-only", email }), name: "Fred" } });
    const typed = await api("POST", "/api/auth/freelancers/login", { body: { email, password: "whatever123" } });
    assert.equal(typed.status, 400);
    assert.match(typed.body.message, /Apple/);
    const unified = await api("POST", "/api/auth/login", { body: { email, password: "whatever123" } });
    assert.match(unified.body.message, /Apple/);
  });

  test("account types stay separate", async () => {
    const res = await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ sub: "apple-iso", email: uniqueEmail() }) } });
    assert.equal((await api("GET", "/api/auth/companies/me", { token: res.body.token })).status, 403);
  });

  test("input and configuration errors", async () => {
    assert.equal((await api("POST", "/api/auth/users/apple", { body: {} })).status, 400);
    assert.equal((await api("POST", "/api/auth/users/apple", { body: { identityToken: "x", name: 42 } })).status, 400);

    process.env.APPLE_KEYS_URL = "http://127.0.0.1:1/unreachable";
    clearAppleKeyCache();
    assert.equal((await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ email: uniqueEmail() }) } })).status, 503, "Apple keys unreachable");
    process.env.APPLE_KEYS_URL = keysUrl;

    const saved = process.env.APPLE_CLIENT_ID;
    process.env.APPLE_CLIENT_ID = "";
    assert.equal((await api("POST", "/api/auth/users/apple", { body: { identityToken: appleToken({ email: uniqueEmail() }) } })).status, 503, "not configured");
    process.env.APPLE_CLIENT_ID = saved;
  });
});

describe("Google sign-in", () => {
  test("answers 503 when the server has no Google client id", async () => {
    const saved = process.env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_ID = "";
    assert.equal((await api("POST", "/api/auth/users/google", { body: { credential: "x" } })).status, 503);
    process.env.GOOGLE_CLIENT_ID = saved;
    assert.equal((await api("POST", "/api/auth/users/google", { body: {} })).status, 400);
  });
});

describe("email signup and login", () => {
  test("validates email format and bcrypt's 72-byte password limit", async () => {
    assert.equal((await api("POST", "/api/auth/users/signup", { body: { name: "A", email: "not-an-email", password: "password123" } })).status, 400);
    const long = await api("POST", "/api/auth/users/signup", { body: { name: "A", email: uniqueEmail(), password: "é".repeat(40) } });
    assert.equal(long.status, 400, "80 bytes is over bcrypt's limit");
    assert.match(long.body.message, /72 bytes/);
  });

  test("login does not reveal whether an email is registered", async () => {
    const email = uniqueEmail();
    await api("POST", "/api/auth/companies/signup", { body: { companyName: "Co", email, password: "password123" } });
    const unknown = await api("POST", "/api/auth/companies/login", { body: { email: "nobody@example.com", password: "password123" } });
    const wrong = await api("POST", "/api/auth/companies/login", { body: { email, password: "wrong-password" } });
    assert.equal(unknown.status, 401);
    assert.equal(wrong.status, 401);
    assert.equal(unknown.body.message, wrong.body.message);
  });
});
