// Deployment wiring: which browser origins may call the API (Vercel sites, previews, trailing slashes), the
// address put in links, and real CORS answers from the running app.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { allowedOrigins, frontendUrl, originMatcher, toOrigin } = await import("../src/config/urls.js");

const withEnv = (values, run) => {
  const saved = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  try { return run(); } finally { for (const [key, value] of Object.entries(saved)) value === undefined ? delete process.env[key] : (process.env[key] = value); }
};

describe("allowed origins", () => {
  test("addresses are cleaned: trailing slashes, paths, quotes, case", () => {
    assert.equal(toOrigin("https://Plumber.vercel.app/"), "https://plumber.vercel.app");
    assert.equal(toOrigin("https://plumber.vercel.app/login?x=1"), "https://plumber.vercel.app");
    withEnv({ FRONTEND_URL: ' "https://site.vercel.app/" , https://www.plumberfinder.com', ADMIN_URL: "https://admin.vercel.app/", CORS_ORIGIN: "" }, () => {
      assert.deepEqual(allowedOrigins(), ["https://site.vercel.app", "https://www.plumberfinder.com", "https://admin.vercel.app"]);
      assert.equal(frontendUrl(), "https://site.vercel.app", "links use the first site, without the slash");
    });
  });

  test("exact origins and one-label wildcards; everything else is refused", () => {
    const allowed = originMatcher(["https://site.vercel.app", "https://site-*.vercel.app"]);
    assert.ok(allowed("https://site.vercel.app"));
    assert.ok(allowed("https://site-git-main-team.vercel.app"), "Vercel preview deployment");
    assert.ok(!allowed("https://evil.vercel.app"));
    assert.ok(!allowed("https://site-x.evil.com.vercel.app"), "a wildcard never spans a dot");
    assert.ok(!allowed("https://site.vercel.app.evil.com"));
  });

  test("nothing set: the local apps", () => {
    withEnv({ FRONTEND_URL: "", ADMIN_URL: "", CORS_ORIGIN: "" }, () => assert.deepEqual(allowedOrigins(), ["http://localhost:3000", "http://localhost:3001"]));
  });
});

describe("CORS on the running API", () => {
  let stop, baseUrl;
  before(async () => { ({ stop, baseUrl } = await startTestServer()); });
  after(() => stop());

  test("an allowed site gets CORS headers (also on preflight); an unknown one doesn't", async () => {
    const url = `${baseUrl.replace(/\/api$/, "")}/api/search/suggestions?q=pl`;
    const ok = await fetch(url, { headers: { Origin: "http://localhost:3000" } });
    assert.equal(ok.headers.get("access-control-allow-origin"), "http://localhost:3000");
    const preflight = await fetch(url, { method: "OPTIONS", headers: { Origin: "http://localhost:3001", "Access-Control-Request-Method": "GET", "Access-Control-Request-Headers": "authorization,content-type" } });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-origin"), "http://localhost:3001");
    const refused = await fetch(url, { headers: { Origin: "https://evil.example.com" } });
    assert.equal(refused.headers.get("access-control-allow-origin"), null);
  });
});
