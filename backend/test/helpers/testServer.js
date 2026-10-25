// Shared integration-test harness: starts a throwaway local mongod and the Express app.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import mongoose from "mongoose";

process.env.JWT_SECRET ||= "test-secret-that-is-long-enough-for-tests";
process.env.GOOGLE_CLIENT_ID ||= "123456789012-test.apps.googleusercontent.com";
// Most tests sign up and log in directly with made-up emails; the verification tests switch this back on.
process.env.EMAIL_VERIFICATION ||= "off";
process.env.EMAIL_DOMAIN_CHECK ||= "off";
process.env.NODE_ENV ||= "test";

const freePort = () => new Promise((resolve) => {
  const srv = createServer().listen(0, () => { const { port } = srv.address(); srv.close(() => resolve(port)); });
});

export async function startTestServer() {
  const { app } = await import("../../src/app.js");
  // ZIP lookups are answered offline: 5-digit codes starting with 0 don't exist, every other one is Austin, TX.
  const { placeLookup } = await import("../../src/location/services/placeLookup.js");
  placeLookup.zip = async (zipCode) => (zipCode.startsWith("0") ? null : { zipCode, city: "Austin", state: "Texas", stateCode: "TX", latitude: 30.2672, longitude: -97.7431 });
  // Cities: "Nowhere" can't be found; anything else gets coordinates derived from its name length.
  placeLookup.city = async (name, stateCode) => (/nowhere/i.test(name) || !stateCode ? null : { name, stateCode, latitude: 30 + name.length / 100, longitude: -97 - name.length / 100 });
  // Addresses: anything mentioning "Main St" is found at a fixed point; others aren't.
  placeLookup.search = async (query) => (/main st/i.test(query) ? { name: query, latitude: 30.5, longitude: -97.5 } : null);
  placeLookup.reverse = async (latitude, longitude) => ({ zipCode: "78701", city: "Austin", state: "Texas", stateCode: "TX", latitude: Number(latitude), longitude: Number(longitude), street: "" });
  const dbPath = mkdtempSync(path.join(tmpdir(), "plumber-test-db-"));
  const mongoPort = await freePort();
  const mongod = spawn("mongod", ["--dbpath", dbPath, "--port", String(mongoPort), "--bind_ip", "127.0.0.1", "--quiet"], { stdio: "ignore" });
  const uri = `mongodb://127.0.0.1:${mongoPort}/plumber-test`;
  for (let attempt = 0; ; attempt++) {
    try { await mongoose.connect(uri, { serverSelectionTimeoutMS: 500 }); break; } catch (error) {
      if (attempt > 40) throw error;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  await mongoose.connection.syncIndexes();
  const server = app.listen(0);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const api = async (method, url, { body, token, raw } = {}) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(baseUrl + url, { method, headers, body: raw ?? (body === undefined ? undefined : JSON.stringify(body)) });
    const text = await res.text();
    let json; try { json = JSON.parse(text); } catch { json = text; }
    return { status: res.status, body: json };
  };

  const stop = async () => {
    server.close();
    await mongoose.disconnect();
    mongod.kill();
    await new Promise((r) => mongod.once("exit", r));
    rmSync(dbPath, { recursive: true, force: true });
  };

  return { api, stop, uri };
}
