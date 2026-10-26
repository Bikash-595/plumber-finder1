// Admin accounts (login-only) and the /api/admin APIs used by the separate admin app.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const run = promisify(execFile);
const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { resetAdminLoginRateLimit } = await import("../src/auth/admin/middleware/adminLoginRateLimit.js");

let api, stop, uri;
before(async () => ({ api, stop, uri } = await startTestServer()));
after(() => stop());
beforeEach(() => resetAdminLoginRateLimit());

let seq = 0;
async function newAdmin() {
  const email = `admin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  const { body } = await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } });
  return { email, token: body.token };
}
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;

describe("admin accounts", () => {
  test("login-only: no signup, Google, or Apple routes, and not part of the unified login", async () => {
    assert.equal((await api("POST", "/api/auth/admins/signup", { body: { name: "X", email: "x@example.com", password: "password123" } })).status, 404);
    assert.equal((await api("POST", "/api/auth/admins/google", { body: { credential: "x" } })).status, 404);
    assert.equal((await api("POST", "/api/auth/admins/apple", { body: { identityToken: "x" } })).status, 404);
    const { email } = await newAdmin();
    assert.equal((await api("POST", "/api/auth/login", { body: { email, password: "admin-password-1" } })).status, 401);
  });

  test("login, me, and wrong password", async () => {
    const { email, token } = await newAdmin();
    const me = await api("GET", "/api/auth/admins/me", { token });
    assert.equal(me.body.account.email, email);
    assert.equal(me.body.account.accountType, "admin");
    assert.equal(me.body.account.password, undefined);
    assert.equal((await api("POST", "/api/auth/admins/login", { body: { email, password: "wrong-password" } })).status, 401);
    assert.ok((await Admin.findOne({ email })).lastLoginAt, "last login recorded");
  });

  test("repeated failed logins are rate limited", async () => {
    const { email } = await newAdmin();
    for (let i = 0; i < 5; i++) assert.equal((await api("POST", "/api/auth/admins/login", { body: { email, password: "nope-nope" } })).status, 401);
    const locked = await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } });
    assert.equal(locked.status, 429, "even the right password waits out the lockout");
  });

  test("deactivated admins lose access immediately", async () => {
    const { email, token } = await newAdmin();
    await Admin.updateOne({ email }, { $set: { isActive: false } });
    assert.equal((await api("GET", "/api/admin/overview", { token })).status, 401);
    assert.equal((await api("GET", "/api/auth/admins/me", { token })).status, 401);
    assert.equal((await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).status, 401);
  });

  test("create-admin script creates, resets, and deactivates admins", async () => {
    const env = { ...process.env, MONGODB_URI: uri, ADMIN_PASSWORD: "script-password-1" };
    const script = new URL("../scripts/createAdmin.js", import.meta.url).pathname;
    const created = await run("node", [script, "--email", "script@example.com", "--name", "Script Admin"], { env });
    assert.match(created.stdout, /created/);
    assert.equal((await api("POST", "/api/auth/admins/login", { body: { email: "script@example.com", password: "script-password-1" } })).status, 200);

    await run("node", [script, "--email", "script@example.com"], { env: { ...env, ADMIN_PASSWORD: "script-password-2" } });
    assert.equal((await api("POST", "/api/auth/admins/login", { body: { email: "script@example.com", password: "script-password-2" } })).status, 200, "password reset");

    await run("node", [script, "--email", "script@example.com", "--deactivate"], { env });
    assert.equal((await api("POST", "/api/auth/admins/login", { body: { email: "script@example.com", password: "script-password-2" } })).status, 401);

    await assert.rejects(run("node", [script, "--email", "short@example.com"], { env: { ...env, ADMIN_PASSWORD: "short" } }), /Password must be/);
  });
});

describe("admin APIs", () => {
  test("need an admin token", async () => {
    const user = await signup("users", { name: "U", email: "u-admin-api@example.com" });
    const company = await signup("companies", { companyName: "C", email: "c-admin-api@example.com" });
    for (const path of ["overview", "users", "companies", "freelancers", "bookings", "registrations"]) {
      assert.equal((await api("GET", `/api/admin/${path}`)).status, 401, path);
      assert.equal((await api("GET", `/api/admin/${path}`, { token: user.token })).status, 403, `${path} (user)`);
      assert.equal((await api("GET", `/api/admin/${path}`, { token: company.token })).status, 403, `${path} (company)`);
    }
  });

  test("overview counts and recent registrations", async () => {
    const { token } = await newAdmin();
    await signup("users", { name: "Reg User", email: "reg-user@example.com" });
    await signup("freelancers", { name: "Reg Fl", email: "reg-fl@example.com" });
    const { data } = (await api("GET", "/api/admin/overview", { token })).body;
    assert.ok(data.totals.users >= 1 && data.totals.freelancers >= 1);
    assert.ok(data.newThisWeek.users >= 1);
    assert.ok(data.pendingApprovals.freelancers >= 1);
    const registrations = (await api("GET", "/api/admin/registrations?days=7", { token })).body.data;
    assert.ok(registrations.some((r) => r.email === "reg-user@example.com" && r.accountType === "user"));
    assert.ok(registrations.some((r) => r.email === "reg-fl@example.com" && r.accountType === "freelancer"));
  });

  test("user list: search, pagination, no secrets, regex-safe", async () => {
    const { token } = await newAdmin();
    for (let i = 0; i < 3; i++) await signup("users", { name: `Searchable ${i}`, email: `searchable${i}@example.com` });
    const page = await api("GET", "/api/admin/users?search=searchable&limit=2&page=1", { token });
    assert.equal(page.body.total, 3);
    assert.equal(page.body.data.length, 2);
    assert.equal(page.body.data[0].password, undefined);
    assert.equal((await api("GET", "/api/admin/users?search=searchable&limit=2&page=2", { token })).body.data.length, 1);
    const tricky = await api("GET", `/api/admin/users?search=${encodeURIComponent(".*(")}`, { token });
    assert.equal(tricky.status, 200);
    assert.equal(tricky.body.total, 0);
  });

  test("suspending a company hides its listing; approving restores it", async () => {
    const { token } = await newAdmin();
    const company = await signup("companies", { companyName: "Suspend Me", email: "suspend-me@example.com" });
    const listing = (await api("POST", "/api/companies/onboarding", { token: company.token, body: { formData: { companyName: "Suspend Me" } } })).body.data;

    const pending = (await api("GET", "/api/admin/companies?status=pending&search=suspend", { token })).body.data;
    assert.equal(pending[0].listing.isPublished, true);
    assert.equal((await api("PATCH", `/api/admin/companies/${company.account._id}/status`, { token, body: { status: "banned" } })).status, 400);

    await api("PATCH", `/api/admin/companies/${company.account._id}/status`, { token, body: { status: "suspended" } });
    assert.equal((await api("GET", `/api/companies/public/${listing._id}`)).status, 404, "hidden from the public site");
    await api("POST", "/api/companies/onboarding", { token: company.token, body: { formData: { companyName: "Suspend Me Again" } } });
    assert.equal((await api("GET", `/api/companies/public/${listing._id}`)).status, 404, "re-submitting the wizard does not undo a suspension");
    await api("PATCH", `/api/admin/companies/${company.account._id}/status`, { token, body: { status: "approved" } });
    assert.equal((await api("GET", `/api/companies/public/${listing._id}`)).status, 200);
    assert.equal((await api("PATCH", "/api/admin/companies/64b7f0c2a1b2c3d4e5f60718/status", { token, body: { status: "approved" } })).status, 404);
  });

  test("freelancer verification", async () => {
    const { token } = await newAdmin();
    const freelancer = await signup("freelancers", { name: "Verify Me", email: "verify-me@example.com" });
    const res = await api("PATCH", `/api/admin/freelancers/${freelancer.account._id}/verification`, { token, body: { verificationStatus: "verified" } });
    assert.equal(res.body.data.verificationStatus, "verified");
    assert.equal((await api("GET", "/api/admin/freelancers?status=verified&search=verify-me", { token })).body.total, 1);
  });

  test("bookings move forward only, and the customer is notified", async () => {
    const { token } = await newAdmin();
    const customer = await signup("users", { name: "Book Er", email: "booker@example.com" });
    const booking = (await api("POST", "/api/users/bookings", { token: customer.token, body: { providerType: "company", providerId: "1", providerName: "Demo", service: "Leak repair" } })).body.data;

    const listed = (await api("GET", "/api/admin/bookings?search=leak", { token })).body.data.find((b) => b._id === booking._id);
    assert.equal(listed.user.email, "booker@example.com");

    assert.equal((await api("PATCH", `/api/admin/bookings/${booking._id}/status`, { token, body: { status: "completed" } })).status, 409, "pending cannot jump to completed");
    assert.equal((await api("PATCH", `/api/admin/bookings/${booking._id}/status`, { token, body: { status: "scheduled" } })).body.data.status, "scheduled");
    assert.equal((await api("PATCH", `/api/admin/bookings/${booking._id}/status`, { token, body: { status: "completed" } })).body.data.status, "completed");
    assert.equal((await api("PATCH", `/api/admin/bookings/${booking._id}/status`, { token, body: { status: "cancelled" } })).status, 409, "completed is final");

    const notes = (await api("GET", "/api/users/notifications", { token: customer.token })).body.data.map((n) => n.title);
    assert.ok(notes.includes("Booking confirmed") && notes.includes("Job completed"));
    const summary = (await api("GET", "/api/users/dashboard", { token: customer.token })).body.data.counts;
    assert.equal(summary.completedBookings, 1);
  });
});
