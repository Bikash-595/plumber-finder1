# Security, Logic & Performance Audit — plumber-finder

**Date:** 2026-11-04
**Scope:** `backend/` (Express 5 + Mongoose 8), `frontend/` (Next.js public site and dashboards), `admin/` (Next.js admin panel)
**Method:** Manual code review of authentication, authorization, input validation, payments, uploads, public endpoints and client rendering. The new findings were not checked by a separate pass yet. Dependency audit (`npm audit --omit=dev`) for all three apps. Finding C-1 was confirmed with a test that sends real requests to a throwaway database.

## Summary

| ID | Title | Area | Risk |
|----|-------|------|------|
| C-1 | `verify-email` logs anyone into any verified account without a code | Backend auth | **Critical** |
| H-1 | Password reset does not end existing sessions | Backend auth | High |
| H-2 | Public directory endpoints return every listing (no paging, inline base64 images) | Performance | High |
| M-1 | Onboarding wizard stores `website` and map URL without URL validation | Backend validation / XSS | Medium |
| M-2 | Login rate limiter can be reset by flooding it | Backend auth | Medium |
| M-3 | Verification and password-reset endpoints have no IP rate limit | Backend auth | Medium |
| M-4 | Activity tracking can be inflated and grows without limit | Backend / data integrity | Medium |
| M-5 | Auth tokens readable by JavaScript (localStorage + non-HttpOnly cookie) | Frontend | Medium |
| M-6 | Public frontend sends no security headers (CSP, clickjacking) | Frontend | Medium |
| M-7 | Stripe events can be applied out of order | Payments logic | Medium |
| M-8 | Booking creation has no rate limit | Backend | Medium |
| L-1 | Customer and admin tokens can't be revoked | Backend auth | Low |
| L-2 | Forgot-password reveals whether an account exists | Backend auth | Low |
| L-3 | "Max items" and "max jobs per day" checks race | Logic | Low |
| L-4 | In-memory rate limiters don't work across several servers | Ops | Low |
| L-5 | No global Mongoose `sanitizeFilter` | Hardening | Low |
| L-6 | Unanchored case-insensitive regex searches and deep `skip` paging | Performance | Low |
| L-7 | Profile images accept any `http://` URL | Hardening | Low |
| L-8 | Public profile returns full gallery media (base64 videos) | Performance | Low |
| I-1 | Small cleanups | Info | Info |

**Fix first:** C-1. It's a one-line logic error, and it lets anyone who knows an email address take over that account.

---

## Critical

### C-1. `POST /api/auth/verify-email` returns a login token without a code

**File:** [backend/src/auth/verification/controllers/verificationController.js:18](backend/src/auth/verification/controllers/verificationController.js#L18)

```js
if (record.emailVerified !== false) return sendAuthResponse(res, record); // already confirmed
```

If the account's email is already verified, or the account was created before verification existed (`emailVerified` is undefined), the handler returns a fresh access token **before checking any code**. The request only needs `{ email, accountType }`.

**Impact:** anyone who knows a company's, freelancer's or customer's email gets full access to that account. Business emails are public on their profiles, so this is account takeover at scale. Admin accounts aren't affected because they aren't in `accountTypes`.

**Proof (throwaway test database):** sign up a company, then `POST /api/auth/verify-email { email, accountType: "company" }` with no code. The response is `200` with a valid `token` for that account.

**Fix:** never issue a token from this endpoint unless a code was checked:

```js
if (record.emailVerified !== false) return res.status(400).json({ message: "This email is already confirmed. Please log in." });
```

Then add a regression test to `backend/test` that calls `verify-email` without a code on a verified account and expects no `token`. Also check the logs (`LoginEvent` with method `verify-email`) for misuse.

---

## High

### H-1. Password reset does not end existing sessions

**File:** [backend/src/auth/verification/controllers/verificationController.js:65](backend/src/auth/verification/controllers/verificationController.js#L65)

`resetPassword` sets the new password but never bumps `tokenVersion`. A password change in Settings does (`revokeSessions`), but a reset doesn't. People usually reset a password *because* someone else has access, and the attacker's tokens stay valid for up to 7 days (`JWT_EXPIRES_IN`).

**Fix:** after saving, call `revokeSessions(accountType, record._id)` when `sessionChecked(accountType)`, and set `passwordChangedAt`. Then issue the new token from the updated record.

### H-2. Public directory endpoints are unbounded

**Files:** [backend/src/company/listing/controllers/companyListingController.js:7](backend/src/company/listing/controllers/companyListingController.js#L7), [backend/src/freelancer/listing/controllers/freelancerListingController.js:7](backend/src/freelancer/listing/controllers/freelancerListingController.js#L7)

`GET /api/companies/public` and `GET /api/freelancers/public` load **every** published listing. `cardSummaries` then runs about 15 `$in` queries over all of their ids. Logos and cover images are stored as base64 data URLs (up to about 1.3 MB each) and are returned inline for every listing.

**Impact:** response size and memory grow with the number of providers. At a few thousand listings this is tens or hundreds of MB per request and an easy DoS. It won't reach the 10M-user target.

**Fix:**
- Add cursor paging (`limit` ≤ 50) and filters (city/state/service, plus a `2dsphere` index for "near me").
- Return image **URLs**, not data URLs. Move uploads to object storage (S3/R2/GCS) or a `/media/:id` endpoint that streams with cache headers. Until then, `.select("-logo -coverImage")` on lists and send a thumbnail URL.
- Cache the first page (for example 60 s in memory or a CDN, `Cache-Control: public, s-maxage=60`).

---

## Medium

### M-1. Onboarding wizard stores `website` and map URL as free text

**Files:** [backend/src/company/onboarding/controllers/companyOnboardingController.js:131](backend/src/company/onboarding/controllers/companyOnboardingController.js#L131) (also lines 135–136), rendered at [frontend/app/components/plumber/ProfileHeader.tsx:623](frontend/app/components/plumber/ProfileHeader.tsx#L623)

The Contact section checks `website` against `^https?://`, but the onboarding wizard (`cleanFields`) only checks length. Its value is copied to `CompanyListing.website` and rendered as `<a href={plumber.website}>`. `googleMapsIntegration` (stored as `mapUrl`) is handled the same way.

React 19 blocks `javascript:` URLs, which prevents the classic stored XSS. The page still relies on the framework for that, though, and other link schemes and the admin views aren't covered.

**Fix:** reuse the Contact config's `website` pattern in the wizard's field list (`https?://` only), and validate `googleMapsIntegration` against an allow-list of Google Maps hosts. On the frontend, add a `safeExternalUrl()` helper that returns `undefined` unless `new URL(v).protocol` is `https:` or `http:`, and use it for every provider-supplied `href` and `src`.

### M-2. Login rate limiter can be reset by flooding

**File:** [backend/src/auth/shared/middleware/loginRateLimit.js:22](backend/src/auth/shared/middleware/loginRateLimit.js#L22)

When the map holds more than 100,000 entries it calls `failures.clear()`, which wipes **everyone's** lockout. An attacker can send 100k failed logins with random emails, then continue guessing the real target. The limit is also per IP + email, so guessing one account from many IPs isn't limited. The admin limiter ([adminLoginRateLimit.js:5](backend/src/auth/admin/middleware/adminLoginRateLimit.js#L5)) has no size cap at all, so its memory keeps growing.

**Fix:** evict only expired entries (as `reviews/middleware/rateLimit.js` does), add a per-IP total cap, and add a per-account cap across all IPs (for example 50 per hour). Move these limits to Redis or the load balancer for production.

### M-3. Verification endpoints have no IP rate limit

**File:** [backend/src/auth/verification/routers/verificationRouter.js](backend/src/auth/verification/routers/verificationRouter.js)

Codes have good per-email limits: 5 attempts per code, 5 sends per hour, and a 60 s cooldown. But one IP can call `/password/forgot` and `/resend-code` for any number of different addresses, which sends email to strangers (cost, spam reputation).

**Fix:** add `rateLimit({ windowMs: 15 * 60_000, max: 20 })` per IP on all four routes.

### M-4. Activity tracking can be inflated and has no retention

**File:** [backend/src/activity/activityRouter.js:10](backend/src/activity/activityRouter.js#L10)

`POST /api/activity` is anonymous and has no rate limit. Dedupe uses a `visitorId` the client chooses, so sending a new random id each time records a new view every time. This distorts provider analytics and lead "interest signals", and with no TTL index `profile_activities` grows without limit.

**Fix:** per-IP rate limit (for example 60 per minute). Dedupe guests on a hash of IP + user agent + day, not the client id alone. Add a TTL index (for example 400 days) or roll old rows into daily counters.

### M-5. Auth tokens readable by JavaScript

**Files:** [frontend/app/components/utils/auth.ts:81-85](frontend/app/components/utils/auth.ts#L81-L85), [admin/lib/adminAuth.ts:26](admin/lib/adminAuth.ts#L26)

The access token (valid 7 days) is stored in `localStorage` and also mirrored into a cookie that isn't `HttpOnly`. Any XSS bug would let an attacker steal the token. The admin token is also in `localStorage`.

**Fix (in steps):**
1. Shorten `JWT_EXPIRES_IN` (for example 1 h) and add a refresh token kept in an `HttpOnly; Secure; SameSite=Strict` cookie set by the API.
2. Have the API set the session cookie itself so `proxy.ts` can read it server-side, and stop exposing the token to scripts.
3. Admin: shortest lifetime, and re-authentication for sensitive actions.

### M-6. Public frontend sends no security headers

**File:** [frontend/next.config.ts](frontend/next.config.ts)

The admin app sets headers but the public site doesn't. With no `Content-Security-Policy` or `frame-ancestors`, dashboard pages can be framed (clickjacking) and there's no second line of defense against XSS.

**Fix:** add `async headers()` with `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a CSP (start in `Content-Security-Policy-Report-Only`; Next needs nonces for inline scripts).

### M-7. Stripe events can be applied out of order

**File:** [backend/src/premium/controllers/webhookController.js](backend/src/premium/controllers/webhookController.js)

The signature check is correct (HMAC, timing-safe compare, 5-minute window), and each event is applied once. But Stripe doesn't guarantee delivery order. `applyStripeSubscription` writes whatever arrives, so a delayed `customer.subscription.updated` (`past_due`) arriving after a newer `active` event can wrongly remove a paid badge, or the reverse.

**Fix:** for subscription events, re-fetch the subscription from Stripe (`getSubscription(object.id)`) before applying it. Or store the `event.created` timestamp on the subscription and ignore older events.

### M-8. Booking creation has no rate limit

**File:** [backend/src/user/bookings/routers/bookingsRouter.js](backend/src/user/bookings/routers/bookingsRouter.js)

A signed-in customer can create unlimited booking requests. Each one notifies the provider and admins, and can fill a provider's `maxJobsPerDay` with fake requests.

**Fix:** `rateLimit({ windowMs: 60 * 60_000, max: 10 })` per account on `POST /`, plus a cap on open (pending) requests per customer per provider.

---

## Low

### L-1. Customer and admin tokens can't be revoked
[backend/src/auth/shared/services/sessions.js:7](backend/src/auth/shared/services/sessions.js#L7): only company and freelancer tokens check `tokenVersion`. A stolen customer token works until it expires. Admins can be disabled with `isActive`, but there's no "sign out everywhere". **Fix:** add `tokenVersion` to `User` and `Admin` and register them in `models`.

### L-2. Forgot-password reveals whether an account exists
[verificationController.js:47](backend/src/auth/verification/controllers/verificationController.js#L47): `issueCode` only runs for existing accounts, so a second request within 60 s returns `429` only for real accounts. Response time also differs because email is only sent for them. **Fix:** catch `CodeLimitError` and return the same generic `200`, and send the email in the background.

### L-3. Race conditions on limits
- [createCollectionController.js:29](backend/src/shared/profileSections/createCollectionController.js#L29): `countDocuments` then `create` isn't atomic, so parallel requests can go past `maxItems`.
- [checkAvailability.js:34](backend/src/company/availability/services/checkAvailability.js#L34): `maxJobsPerDay` has the same check-then-insert gap.

Both have low impact. If they become a problem, use a per-owner counter document updated with `$inc` and a condition.

### L-4. In-memory rate limiters
Login, admin, review, message and premium limiters live in each server's memory. Behind several instances, or after a restart, they reset. Use Redis or the load balancer's rate limiting in production, and make sure `TRUST_PROXY` is set so `req.ip` is the real client IP.

### L-5. No global query sanitising
The controllers type-check inputs well (login emails, ObjectIds, `cleanFields`). As defense in depth, set `mongoose.set("sanitizeFilter", true)` in [backend/src/config/database.js](backend/src/config/database.js) so that any future `find({ field: req.body.x })` can't receive `{ $ne: null }`.

### L-6. Search and paging performance
`searchFilter` ([admin/shared/listQuery.js](backend/src/admin/shared/listQuery.js)) and `textFilter` ([user/shared/paginate.js](backend/src/user/shared/paginate.js)) use unanchored, case-insensitive regexes. These can't use indexes and scan the whole collection. Admin lists use `skip`, which gets slower on deep pages. **Fix:** MongoDB text or Atlas Search indexes for search, and cursor paging for admin lists (the user area already does this).

### L-7. Image fields accept any `http://` URL
[validateFields.js:8](backend/src/shared/profileSections/validateFields.js#L8): image fields accept `http://` links to any host. These cause mixed-content warnings, and an image hosted elsewhere can log visitors' IPs. **Fix:** require `https://`, and ideally only your own media host.

### L-8. Public profile returns full gallery media
`fullProfile` returns every gallery item, including uploaded base64 videos (up to 6 MB each), in one JSON response. **Fix:** return thumbnails and URLs only, and stream the media separately (same storage change as H-2).

---

## Info / cleanups

- **I-1.** [frontend/next.config.ts](frontend/next.config.ts) lists `randomuser.me` and `images.unsplash.com` several times; remove the duplicates. `dangerouslyAllowSVG` is safe as configured (sandbox CSP plus `attachment`), but remove it if SVGs aren't needed.
- `frontend/proxy.ts` decodes the session cookie **without verifying it**. That's fine for redirects only, because every API call is verified on the server. Keep it that way: never trust `proxy.ts` claims for data access.
- The provider blog page ([frontend/app/(public)/plumber/[id]/blog/[slug]/page.tsx](frontend/app/(public)/plumber/[id]/blog/[slug]/page.tsx)) renders `post.content` with `dangerouslySetInnerHTML`. It's safe today only because the mapper `textToArticleHtml` escapes everything. Add a comment or a type such as `SafeHtml` so nobody passes raw content later.
- A lot of commented-out legacy code (for example in `ProfileHeader.tsx` and `PlumberFinderFooter.tsx`) makes the code harder to review; delete it.

---

## What was checked and looks good

- **Secrets:** no `.env`, API keys, Stripe secrets or database credentials are tracked in git. `JWT_SECRET` is required at startup, and the placeholder value is rejected.
- **Passwords:** bcrypt with cost 12 on all account types, with the 72-byte limit enforced. Hashes are never returned (`select: false` plus `publicAccount`).
- **JWT:** HS256 algorithm pinned on verify. Company and freelancer sessions can be revoked.
- **Google / Apple sign-in:** ID tokens are verified with the right audience and issuer, and a verified email is required.
- **Authorization:** every admin route goes through `requireActiveAdmin`. Profile sections, bookings, jobs, quotes, customers and messages are all scoped to the signed-in owner, and no cross-account read was found.
- **Prices and coupons:** worked out on the server (`quoteBooking`), never taken from the browser.
- **Uploads:** only PNG/JPEG/WebP/GIF images and MP4/WebM/MOV video are accepted (SVG is excluded), with per-field size limits and a body size limit on each route.
- **Email codes:** 6 digits from `crypto.randomInt`, stored as SHA-256 hashes, compared in constant time, 10-minute expiry, 5 attempts.
- **Stripe webhook:** raw body, HMAC-SHA256, timing-safe compare, 5-minute replay window, each event applied once.
- **Regex input** is escaped before use. JSON-LD output escapes `<`. Blog text is HTML-escaped.
- **API headers:** `nosniff`, `DENY` framing, `default-src 'none'` CSP, HSTS in production, `x-powered-by` off. CORS is limited to the frontend and admin origins.
- **Dependencies:** `npm audit --omit=dev` reports **0 known vulnerabilities** in `backend/`, `frontend/` and `admin/` (checked 2026-11-04).

## Recommended order

1. **Today:** C-1 (one line plus a test), H-1.
2. **This week:** M-1, M-2, M-3, M-8, M-6.
3. **Before scaling:** H-2 and L-8 (paging, media storage), M-4, M-7, M-5, L-4.
4. **Ongoing:** the remaining Low items, and `npm audit` in CI.
