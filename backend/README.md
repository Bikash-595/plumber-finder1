# Plumber Finder API

This backend uses **Node.js, Express, and MongoDB (Mongoose)**.

## Run locally

1. Install and start MongoDB locally, or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env`, then set `MONGODB_URI`, `JWT_SECRET`, and `GOOGLE_CLIENT_ID`.
3. Install dependencies and start the API:

```bash
npm install
npm run dev
```

The development command intentionally starts without Node's file watcher, which avoids `EMFILE: too many open files, watch` when the Next.js app is also running. Restart the backend after backend source changes.

The API runs at `http://localhost:3300` by default. The frontend API client already defaults to `http://localhost:3300/api`.

## Endpoints

- `GET /health` — verifies API and database connectivity
- `POST /api/auth/login` — email/password login that detects the account type
- `GET /api/companies/public` — all published company listings, each with card details (average rating and review count, verified, years in business, team size, team preview (names and roles), published blog count, current offer, emergency service, weekly hours, base `coordinates`)
- `GET /api/blogs` — every published blog post from published companies and freelancers, newest first (without the article text; with `readTime` and the author's `provider` id/slug/name)
- `GET /api/companies/public/:id` — one published company listing
- `GET /api/companies/public/:idOrSlug/profile` — a published company's full public profile, by listing id or URL slug (an old slug from before a rename also works; the response's `slug` is the current one): the listing plus services, gallery, team, visible projects, reviews (with average rating), FAQs, published blogs, current offers, booking settings, opening hours, branches, and the public parts of the wizard (mission, history, ...). Registration and tax numbers are never included.
- `GET /api/companies/onboarding` — the signed-in company's saved Add Company wizard data (company token)
- `PUT /api/companies/onboarding/steps/:stepId` — save one wizard step (company token)
- `POST /api/companies/onboarding` — submit the whole wizard and create/update the listing (company token)
- `DELETE /api/companies/onboarding/steps/:stepId` — clear one step's saved answers; on a live listing the change is published (Company Information can't be cleared while live)
- `DELETE /api/companies/onboarding` — delete the listing and everything the wizard saved; Business Profile sections (team, blogs, ...) are kept
- `GET`, `PUT /api/companies/header-profile` — signed-in company's header profile (company token)

## Company business-profile sections

Everything company-related lives in feature folders under `src/company/`:

- `account/` — the `Company` account model and company signup/login/Google/me (`/api/auth/companies`).
- `listing/` — the public `CompanyListing` model and `GET /api/companies/public[/:id]`.
- `onboarding/` — the Add Company wizard and the wizard-only models (branding, contact, locations, operations, profile, plus `CompanyOnboardingDraft`). Each of the 8 steps (`config/onboardingSteps.js`: `company-information`, `business-profile`, `branding`, `gallery`, `contact`, `location`, `operations`, `services`) is saved to the database with `PUT /steps/:stepId`, and `GET /` loads it back so the wizard resumes where the company left off. The Business Hours step also saves `weeklyHours` — one row per weekday `{ day, isOpen, opensAt, closesAt }` in 24-hour `HH:MM` (a closing time before the opening time means open past midnight). `POST /` publishes the listing; after that, saving any step updates the live listing immediately. The wizard seeds the Services and Gallery sections once, and never overwrites listing fields managed by the dashboard sections (header profile name/logo/cover, services, service areas).
- One folder per business-profile section (below), each with `config/` (allowed fields and limits), `models/`, `middleware/` (company-only access + validation), `controllers/`, and `routers/`.
- `shared/` — validation and controller factories used by every section; all sections are mounted by `companySectionsRouter.js`.

| Section | Path | Type |
| --- | --- | --- |
| Header profile | `/api/companies/header-profile` | single record (creates/updates the public listing and its URL slug) |
| Company overview | `/api/companies/company-overview` | single record |
| Service areas | `/api/companies/service-areas` | single record: base location + `latitude`/`longitude` (for distances), `radius`, and `areaDetails` — `[{ name, services: [...] }]`, the services offered in each area (syncs listing `serviceAreas`) |
| Booking settings | `/api/companies/booking` | single record |
| Social links | `/api/companies/social-links` | single record: `facebook`, `instagram`, `twitter`, `linkedin`, `youtube`, `tiktok` (full https links; shown as icons in the profile header) |
| Services | `/api/companies/services` | list (syncs listing `services`) |
| Gallery | `/api/companies/gallery` | list (8 MB body limit for videos) |
| Previous projects | `/api/companies/previous-projects` | list |
| Reviews | `/api/companies/reviews` | list |
| Team | `/api/companies/team` | list |
| FAQs | `/api/companies/faqs` | list |
| Blogs | `/api/companies/blogs` | list (unique slug per company) |
| Special offers | `/api/companies/special-offers` | list |

Company token required (Bearer):

- Single record: `GET /`, `PUT /` (or `POST /`) — create or update the company's record; `DELETE /` — delete it.
- List: `GET /`, `POST /`, `GET /:id`, `PUT|PATCH /:id` (partial update), `DELETE /:id`.

Public (no token), by public listing id: `GET /api/companies/<section>/public/:listingId`. Only public content is returned — published blogs, visible projects, and active offers within their dates.

Validation errors return `400` with field-level messages, e.g. `{ "message": "...", "errors": { "rating": "must be at most 5" } }`. Fields not listed in a section config (such as `company` or `_id`) are ignored.

## Company URLs

Every company listing has a clean, unique `slug` used for its public page `/company/<slug>` (e.g. `abc-plumbing`, then `abc-plumbing-2` for the next company with the same name). The slug follows the Company Profile name (or the wizard's name if there is no profile). After a rename, the old slug is kept in `previousSlugs`: it still resolves, so old links redirect to the new URL, and other companies can't take it. Saving the Company Profile creates the listing if the company hasn't used the Add Company wizard; deleting the profile removes a listing that only the profile created.

## Freelancer profile sections

Freelancers get the same section structure as companies under `src/freelancer/<section>/` (`config/`, `models/`, `middleware/`, `controllers/`, `routers/`), mounted by `src/freelancer/freelancerRouter.js` at `/api/freelancers`. Sections: `header-profile`, `overview`, `service-areas`, `booking`, `opening-hours`, `social-links` (single records), `services`, `gallery`, `previous-projects`, `reviews`, `faqs`, `blogs`, `special-offers` (lists). There is no team section — a freelancer works alone.

- **Opening hours:** `GET`/`PUT /api/freelancers/opening-hours` — `weeklyHours` (one row per weekday, same rules as the company wizard, validated by `src/shared/openingHours.js`) plus `availability24x7`, `emergencyHours`, `holidayHours`, `specialClosures`.
- **Removing the listing:** `DELETE /api/freelancers/header-profile` deletes the header profile and the public listing; other sections are kept, and saving the header profile again re-lists the freelancer.
- **Public profile:** `GET /api/freelancers/public` includes card details (rating, verified, specialties, current offer, emergency, weekly hours); `GET /api/freelancers/public/:id/profile` returns everything public in one response, like the company profile endpoint.

- **Registering publicly:** saving the header profile creates/updates the freelancer's public listing (`GET /api/freelancers/public`, `GET /api/freelancers/public/:id`). Its `published` flag hides or shows the freelancer; services and service areas sync to the listing.
- Same rules as companies: freelancer token required (company/user tokens get `403`), every query scoped to the signed-in freelancer, field-level validation, and public read endpoints at `GET /api/freelancers/<section>/public/:listingId`.

The section controllers, validator, and public filters (published blogs, visible projects, current offers — `publicFilters.js`) are shared by companies and freelancers in `src/shared/profileSections/` (the owner field is `company` or `freelancer`); `src/company/shared/` and `src/freelancer/shared/` hold thin wrappers that set the owner.

## Customer (user) dashboard

Customer features live in `src/user/<area>/` (same `config/`, `controllers/`, `middleware/`, `models/`, `routers/` layout), mounted by `src/user/userRouter.js` at `/api/users`. Every route requires a customer token (company/freelancer tokens get `403`) and only touches the signed-in customer's data.

| Area | Endpoints |
| --- | --- |
| Dashboard | `GET /dashboard` — counts (cart, saved, compare, bookings, unread notifications, pending invoices), upcoming bookings, recent activity |
| Profile | `GET`, `PUT /profile` — name, phone, address, photo (email cannot be changed here) |
| Settings | `GET`, `PUT /settings` — notification and privacy preferences (defaults until saved) |
| Security | `GET /security` (sign-in methods), `POST /security/password` — change, or set a first password for Google/Apple accounts |
| Saved | `GET`, `POST /saved`, `DELETE /saved/:id`, `DELETE /saved/provider/:providerType/:providerId` |
| Compare | same as saved, up to 3 plumbers |
| Cart | `GET`/`DELETE /cart`, `POST /cart/items`, `PATCH`/`DELETE /cart/items/:id`, `POST`/`DELETE /cart/promo` — totals, promo discounts, and tax are calculated on the server |
| Checkout | `POST /checkout` — one booking per cart line + a pending invoice, then empties the cart (no card is charged) |
| Bookings | `GET /bookings?status=`, `POST /bookings`, `GET /bookings/:id`, `PATCH /bookings/:id/cancel` — customers cannot schedule or complete bookings |
| Notifications | `GET /notifications?unread=true`, `PATCH /:id/read`, `POST /read-all`, `DELETE /:id` — created by the server (bookings, checkout) |
| Invoices | `GET /invoices`, `GET /invoices/:id` (read-only) |
| Payment methods | `GET`, `POST`, `PATCH /:id`, `DELETE /:id` — brand, last 4 digits, and expiry only; full card numbers are never stored; one default; expired cards rejected |

Items point at a plumber with `providerType` (`company`/`freelancer`) and `providerId`. Real listing ids must exist and be published; the site's built-in sample plumbers (ids like `"1"`) are accepted.

## Admin

The admin panel is a separate app in `../admin`. Admin APIs live in `src/admin/<area>/` (mounted at `/api/admin` by `src/admin/adminRouter.js`) and require an **active admin** token:

| Area | Endpoints |
| --- | --- |
| Overview | `GET /overview` |
| Users | `GET /users?search=&page=&limit=` |
| Companies | `GET /companies?status=&search=&page=`, `PATCH /companies/:id/status` (`pending`/`approved`/`suspended`; suspended hides the listing, also on wizard re-submits) |
| Freelancers | `GET /freelancers?status=&search=&page=`, `PATCH /freelancers/:id/verification` |
| Bookings | `GET /bookings?status=&search=&page=`, `PATCH /bookings/:id/status` (pending → scheduled → completed; cancel from pending/scheduled; customer notified) |
| Registrations | `GET /registrations?days=30` |

Admin accounts (`src/auth/admin/`) can only log in (`POST /api/auth/admins/login`, `GET /api/auth/admins/me`) — no signup, Google, or Apple. Create or reset one with `npm run create-admin -- --email you@example.com --name "Your Name"` (password from `ADMIN_PASSWORD` or a hidden prompt); add `--deactivate` to revoke access. Failed admin logins are rate limited (5 per 15 minutes per email + IP, in memory).

Set `ADMIN_URL` to the admin app origin(s) for CORS (default `http://localhost:3001`).

## Authentication

All authentication lives in `src/auth/`:

```
auth/
  authRouter.js        mounts everything at /api/auth
  accountTypes.js      list of account types (used by the unified login)
  email/               normal signup + sign-in (and POST /api/auth/login)
  google/              Sign in with Google
  apple/               Sign in with Apple
  user/  company/  freelancer/   each account type: config, model, controller, router
  shared/              access tokens, requireAuth middleware, account linking
```

Each folder uses `config/`, `controllers/`, `middleware/`, `routers/` (plus `services/` or `models/` where needed). Every account type gets every sign-in method. Replace `{type}` with `users`, `companies`, or `freelancers`:

- `POST /api/auth/login` — email/password login that detects the account type
- `POST /api/auth/{type}/signup` — email/password registration
- `POST /api/auth/{type}/login` — email/password login
- `POST /api/auth/{type}/google` — Google sign-in/registration (body: `credential`)
- `POST /api/auth/{type}/apple` — Apple sign-in/registration (body: `identityToken`, optional `nonce` and `name`)
- `GET /api/auth/{type}/me` — current account (Bearer token required)

`users` and `freelancers` require `name`, `email`, and `password` to sign up; `companies` requires `companyName`. Passwords must be 8–72 bytes (bcrypt's limit). Google and Apple tokens are verified by the server; a verified email links to an existing account with the same email, otherwise a new account is created. Requests return `201` when a new account was created and `200` for an existing one.

## Email verification and password reset

New email/password accounts get a 6-digit code by email and can't log in until it is entered (Google and Apple accounts are already verified by the provider). Accounts created before this existed are treated as verified.

- `POST /api/auth/{type}/signup` → `201 { verificationRequired: true, email }` (no token yet). Gmail addresses must follow Gmail's rules, and the email domain must have mail servers (MX records).
- `POST /api/auth/verify-email` `{ email, accountType, code }` → token. `accountType` is `user`, `company`, or `freelancer`.
- `POST /api/auth/resend-code` `{ email, accountType }` — at most once a minute, 5 per hour.
- Logging in with the right password but an unconfirmed email → `403 { verificationRequired: true }` and a fresh code.
- `POST /api/auth/password/forgot` `{ email, accountType }` and `POST /api/auth/password/reset` `{ email, accountType, code, password }`.

Codes expire after 10 minutes, are stored hashed, and are discarded after 5 wrong guesses. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM` (see `.env.example`; Gmail needs an App Password). Without them, development prints the code in the server console and production refuses to sign up (`503`).

Customer signup also needs a real US ZIP code: `GET /api/location/zip/:zip` (Zippopotam.us) fills the city and state, and `GET /api/location/reverse?lat=&lng=` (OpenStreetMap) finds the ZIP code for "Use my location". The server looks the ZIP up again on signup, so the saved city/state always match it.

## Apple sign-in setup

1. In the Apple Developer portal, create a **Services ID** (e.g. `com.plumberfinder.web`), enable Sign in with Apple, and register your domain and Return URL.
2. Set `APPLE_CLIENT_ID` in `backend/.env` to that Services ID (comma-separate an iOS bundle ID if apps share this API).
3. Set `NEXT_PUBLIC_APPLE_CLIENT_ID` (same Services ID) and `NEXT_PUBLIC_APPLE_REDIRECT_URI` (the Return URL) in `frontend/.env`. The "Continue with Apple" button appears once both are set.

Apple only works on a registered HTTPS domain, not `localhost`. The server verifies the token against Apple's published keys (cached, refreshed on key rotation), the issuer, audience, expiry, nonce, and verified email. Until `APPLE_CLIENT_ID` is set, the endpoint answers `503`.

## Google sign-in setup

1. In Google Cloud Console, create an OAuth 2.0 credential with application type **Web application**.
2. Add every frontend origin exactly, for example `http://localhost:3000` for development and `https://app.example.com` in production. Do not add `/api` to these origins.
3. Set the issued client ID, ending in `.apps.googleusercontent.com`, as both `frontend/NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `backend/GOOGLE_CLIENT_ID`.
4. Set `FRONTEND_URL` to the same comma-separated frontend origins and restart both services after changing environment files.

The client secret is not used by this ID-token flow and must never be exposed through `NEXT_PUBLIC_*` variables.

## Tests

`npm test` runs API integration tests against a throwaway local `mongod` (the MongoDB server binary must be on your PATH).
