# OWASP Review — Authentication & API Layer

**Date:** 2026-11-04
**Scope:**
- `backend/src/auth/` — all 55 files: email, Google and Apple sign-in, admin login, verification codes, JWTs, sessions, models.
- **There is no `src/api` directory in this repo.** The closest equivalent is the client code that calls the API, and that's what was reviewed: [frontend/app/components/utils/apiClient.ts](frontend/app/components/utils/apiClient.ts), [admin/lib/adminApi.ts](admin/lib/adminApi.ts), the token storage in `auth.ts` / `adminAuth.ts`, and the two login pages that consume tokens and redirects.

The server's routes are spread across feature folders (`backend/src/company`, `user`, `admin`, …) and were covered in [SECURITY_AUDIT.md](SECURITY_AUDIT.md).

**Method:** manual code review mapped to the OWASP Top 10 (2021). Finding A07-1 was confirmed with real requests against a throwaway database. The open-redirect payload (A01-2) was checked with the browser's URL parser.

## Summary

| ID | Finding | OWASP category | Risk |
|----|---------|----------------|------|
| A07-1 | `verify-email` issues a login token with no code for verified accounts | A07 Identification & Authentication Failures | **Critical** (confirmed) |
| A07-2 | Pre-account takeover: social sign-in links to an unconfirmed account and keeps the attacker's password | A07 | **High** |
| A07-3 | Password reset doesn't sign out existing sessions | A07 | **High** |
| A01-1 | Suspended companies can still log in, and their tokens stay valid | A01 Broken Access Control | Medium |
| A01-2 | Open redirect after login via `?next=/\evil.com` | A01 Broken Access Control | Medium |
| A07-4 | Login rate limiter can be reset by flooding; no per-account limit | A07 | Medium |
| A07-5 | No rate limit on signup, verification, reset or social sign-in | A07 / A04 Insecure Design | Medium |
| A02-1 | 7-day bearer tokens readable by JavaScript (localStorage + non-HttpOnly cookie) | A02 Cryptographic Failures / A07 | Medium |
| A05-1 | Safety settings rely on `NODE_ENV=production` (fail-open if it's missing) | A05 Security Misconfiguration | Medium |
| A01-3 | Customer and admin tokens can't be revoked | A01 / A07 | Low |
| A07-6 | Account enumeration (login, forgot-password, signup) | A07 | Low |
| A07-7 | Signup overwrites an unconfirmed account's password | A04 Insecure Design | Low |
| A07-8 | Apple `nonce` is optional | A07 | Low |
| A05-2 | `APPLE_KEYS_URL` can be overridden in production | A05 | Low |
| A04-1 | Unbounded in-memory maps (admin limiter, MX cache) | A04 / DoS | Low |

**Not found:** injection (A03), mass assignment, data leaks of password hashes or tokens, weak password hashing (A02), JWT algorithm confusion, or broken Google/Apple token verification. See "What's done well" at the end.

---

## Critical

### A07-1. `POST /api/auth/verify-email` logs in without a code
**File:** [backend/src/auth/verification/controllers/verificationController.js:18](backend/src/auth/verification/controllers/verificationController.js#L18)

```js
if (record.emailVerified !== false) return sendAuthResponse(res, record); // already confirmed
```

For any account whose email is already confirmed (or that predates verification), this endpoint returns a valid access token for `{ email, accountType }`. No password and no code are needed.

**Confirmed:** sign up a company, then send `POST /api/auth/verify-email { email, accountType: "company" }` → `200` with that company's token.

**Impact:** takeover of any customer, company or freelancer account whose email is known. Business emails are shown publicly on profiles.

**Fix:**
```js
if (record.emailVerified !== false) return res.status(400).json({ message: "This email is already confirmed. Please log in." });
```
Add a regression test, and review `login_events` rows with `method: "verify-email"` for past misuse.

---

## High

### A07-2. Pre-account takeover through Google / Apple linking
**File:** [backend/src/auth/shared/services/socialAccounts.js:19-30](backend/src/auth/shared/services/socialAccounts.js#L19-L30)

How the attack works:
1. The attacker signs up with email and password, using the **victim's** email (for example `owner@victim-plumbing.com`). The account stays unconfirmed (`emailVerified: false`).
2. Later, the real owner clicks "Continue with Google". `findOrCreateSocialAccount` finds the account by email, links `googleId`, and sets `emailVerified = true`. **The attacker's password is kept.**
3. The attacker logs in with their password and gets into the now-confirmed account, including everything the owner adds afterwards.

**Fix:** when linking a provider to an account that has `emailVerified === false`, treat it as a new account. Clear `password`, reset the profile fields set at signup, and bump `tokenVersion` before linking:
```js
if (account.emailVerified === false) { account.password = undefined; account.tokenVersion = (account.tokenVersion ?? 0) + 1; }
```

### A07-3. Password reset leaves old sessions alive
**File:** [backend/src/auth/verification/controllers/verificationController.js:65](backend/src/auth/verification/controllers/verificationController.js#L65)

`resetPassword` changes the password but doesn't call `revokeSessions`, which the Settings → Change password flow does. An attacker who already holds a token keeps access for up to 7 days after the victim "secures" the account.

**Fix:** after `record.save()`, call `revokeSessions(account.accountType, record._id)` (for session-checked types) and set `passwordChangedAt`. Then return a token built from the updated record.

---

## Medium

### A01-1. Suspension isn't enforced on authentication
**Files:** [backend/src/auth/shared/middleware/requireAuth.js](backend/src/auth/shared/middleware/requireAuth.js), [backend/src/auth/email/controllers/createEmailAuthController.js](backend/src/auth/email/controllers/createEmailAuthController.js)

An admin setting a company to `suspended` only hides its listing. The company can still log in by password, Google or Apple, and existing tokens keep working. It keeps using the dashboard: messaging customers, sending quotes, and changing jobs. Freelancers have no suspension state at all (`verificationStatus` only), and they control their own `published` flag.

**Fix:**
- Reject login and social sign-in when `status === "suspended"`.
- Call `revokeSessions` when an admin suspends a company.
- Check the status in `currentTokenVersion`, for example by returning `null` for suspended accounts. It's already cached for 15 seconds.
- Add a `suspended` state for freelancers.

### A01-2. Open redirect after login
**Files:** [frontend/app/components/auth/LoginForm.tsx:25](frontend/app/components/auth/LoginForm.tsx#L25), [admin/app/login/page.tsx:18](admin/app/login/page.tsx#L18)

Both pages accept `next` if it starts with `/` and not `//`. But browsers treat `\` like `/`. `new URL("/\\evil.example", origin)` resolves to `https://evil.example/`, and Next's router does a full navigation for external URLs.

A phishing link like `https://plumberfinder…/login?next=/%5Cevil.example` lets the victim log in for real, then sends them to the attacker's look-alike page ("session expired, enter your password again").

**Fix:** resolve the URL and compare origins:
```ts
const safeNext = (next: string | null) => { try { const u = new URL(next ?? "", location.origin); return u.origin === location.origin ? u.pathname + u.search + u.hash : null; } catch { return null; } };
```

### A07-4. Login brute-force protection can be bypassed
**Files:** [backend/src/auth/shared/middleware/loginRateLimit.js:22](backend/src/auth/shared/middleware/loginRateLimit.js#L22), [backend/src/auth/admin/middleware/adminLoginRateLimit.js](backend/src/auth/admin/middleware/adminLoginRateLimit.js)

- After 100,000 entries the map is cleared **entirely**, which wipes every lockout. An attacker floods it with random emails, then continues guessing the target.
- The key is IP + email, so guessing one account from many IPs isn't limited.
- The limiters are in-process memory: they reset on restart and aren't shared between servers.

**Fix:** evict only expired entries. Add a per-account limit across all IPs (for example 50 failures per hour, then a slowdown or CAPTCHA) and a per-IP total limit. Use Redis (or the gateway) in production.

### A07-5. No rate limits on the other auth endpoints
**Files:** [backend/src/auth/verification/routers/verificationRouter.js](backend/src/auth/verification/routers/verificationRouter.js), [backend/src/auth/email/routers/createEmailAuthRouter.js](backend/src/auth/email/routers/createEmailAuthRouter.js), the `google` and `apple` routers.

`/signup`, `/verify-email`, `/resend-code`, `/password/forgot`, `/password/reset`, `/google` and `/apple` have no IP limit. The email codes themselves are well protected: 6 random digits, 5 tries, 5 sends per hour per email. But one IP can trigger unlimited emails to different addresses, plus DNS MX lookups and ZIP lookups. That costs money and hurts the reputation of the sending email domain.

**Fix:** a shared `authRateLimit` (for example 20 requests per 15 minutes per IP) on every `/api/auth/*` write route.

### A02-1. Long-lived tokens readable by JavaScript
**Files:** [frontend/app/components/utils/auth.ts:81-85](frontend/app/components/utils/auth.ts#L81-L85), [admin/lib/adminAuth.ts:26](admin/lib/adminAuth.ts#L26), [backend/src/auth/shared/config/jwtConfig.js](backend/src/auth/shared/config/jwtConfig.js)

The bearer token (7 days by default) is stored in `localStorage` and mirrored into a cookie that isn't `HttpOnly`. Any XSS anywhere on the site would expose it, and the admin token too. The API clients themselves are fine: they send the token only to `API_BASE_URL`, and a 401 or 403 signs the user out.

**Fix:** short-lived access tokens (15–60 minutes), plus a refresh token in an `HttpOnly; Secure; SameSite=Strict` cookie set by the API. For admins: the shortest lifetime, and a password re-prompt for sensitive actions.

### A05-1. Safety settings depend on `NODE_ENV`
**Files:** [backend/src/auth/verification/config/verificationConfig.js](backend/src/auth/verification/config/verificationConfig.js), [backend/src/auth/verification/services/mailer.js](backend/src/auth/verification/services/mailer.js), [backend/src/auth/verification/services/emailDeliverability.js](backend/src/auth/verification/services/emailDeliverability.js)

If production runs without `NODE_ENV=production`:
- `EMAIL_VERIFICATION=off` turns off email confirmation;
- `EMAIL_DOMAIN_CHECK=off` turns off the mail-domain check;
- with SMTP missing, verification and reset **codes are printed to the server log** instead of failing.

**Fix:** fail closed. Require an explicit `ALLOW_INSECURE_DEV_AUTH=1` to use any of these switches, refuse to start if it's set while `NODE_ENV=production`, and never log codes outside `NODE_ENV=development`.

---

## Low

- **A01-3. Tokens that can't be revoked.** [sessions.js:7](backend/src/auth/shared/services/sessions.js#L7) checks `tokenVersion` only for companies and freelancers. Customer tokens can't be revoked. Admins can be deactivated (`isActive` is checked on every request), but have no "sign out everywhere". **Fix:** add `tokenVersion` to `User` and `Admin`.
- **A07-6. Account enumeration.**
  - Login returns **400** "This account uses Google sign-in" instead of 401 for social-only accounts, and skips bcrypt when the email doesn't exist (a timing difference).
  - `/password/forgot` returns **429** on a second request only for real accounts.
  - Signup returns **409** for existing emails (common, and acceptable with rate limits).
  - **Fix:** use the same 401 message, and run a dummy `bcrypt.compare` when there's no account. Return the generic forgot-password response even when the cooldown applies.
- **A07-7. Signup overwrites unconfirmed accounts.** [createEmailAuthController.js:31-33](backend/src/auth/email/controllers/createEmailAuthController.js#L31-L33): anyone can re-sign-up an unconfirmed email and replace its password and name. They still can't confirm it without the inbox, but this enables A07-2 and lets an attacker block a real user's signup. **Fix:** fixed together with A07-2. Optionally, only allow the overwrite after the previous code has expired.
- **A07-8. Apple nonce is optional.** [verifyAppleIdentityToken.js](backend/src/auth/apple/services/verifyAppleIdentityToken.js) checks `nonce` only if the client sends one, so a leaked identity token can be replayed until it expires (about 10 minutes). **Fix:** require a server-issued nonce for web flows.
- **A05-2. `APPLE_KEYS_URL` override.** [appleConfig.js](backend/src/auth/apple/config/appleConfig.js): meant for tests, but it's honored in production too. Anyone who can set environment variables could point it at their own keys and forge Apple logins. **Fix:** ignore it when `NODE_ENV=production`.
- **A04-1. Maps that never shrink.** The admin login limiter's `failures` map and `emailDeliverability`'s `mxCache` have no size cap, so a flood of unique emails or domains grows memory. **Fix:** cap the size and evict expired entries.

---

## What's done well (checked, no issues found)

- **A03 Injection:**
  - Login, signup and verification inputs are type-checked as strings before reaching MongoDB, so `{ "$ne": null }` payloads are rejected.
  - Emails are trimmed, lowercased and length-limited.
  - No `eval`, shell or raw query building.
- **Mass assignment:** `pickProfile` copies only allow-listed fields. `role` and `accountType` are `immutable` in every model. `status` and `verificationStatus` are admin-only.
- **Data leaks:** passwords are `select: false`, and `publicAccount()` strips `password` and `tokenVersion`. Login errors don't reveal stack traces. Login history stores masked IPs and expires after 180 days.
- **A02 Crypto:**
  - Passwords: bcrypt with cost 12, and the 72-byte limit is enforced.
  - Email codes: generated with `crypto.randomInt`, stored as SHA-256 hashes, compared in constant time, expire after 10 minutes and are deleted by a TTL index.
  - JWT: `HS256` is pinned on verify, and a missing or placeholder `JWT_SECRET` stops startup.
- **Google sign-in:** `verifyIdToken` with the correct `audience`, and `email_verified` is required.
- **Apple sign-in:** RS256 only. The `alg` header is checked before key lookup. Keys come from Apple's JWKS with a refresh limit, and issuer, audience and expiry are verified.
- **Admin:** no signup or social login; separate stricter lockout (5 tries per 15 minutes); `isActive` is rechecked on every request, so deactivation takes effect immediately.
- **Headers:** `securityHeaders` sets `nosniff`, `DENY` framing, `default-src 'none'`, and HSTS in production.
- **API clients:** tokens are sent only as `Authorization` headers to the configured backend, never in URLs. A 401 clears the session and fully reloads the page, wiping cached data.

## Fix order

1. **Today:** A07-1 (one line), A07-2, A07-3. Add a regression test for each in `backend/test/`.
2. **This week:** A01-2 (open redirect), A01-1 (suspension), A07-5 and A07-4 (rate limits), A05-1.
3. **Next:** A02-1 (cookie-based refresh tokens), then the Low items.
