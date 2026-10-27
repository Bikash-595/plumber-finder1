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
| Header profile | `/api/companies/header-profile` | single record (creates/updates the public listing and its URL slug). `coverImages` (up to 8 cover photos, shown as a slideshow; `coverImage` follows the first) — `tagline` and `bio` (up to 600 characters) become the listing's tagline and description — shown at the top of the profile and on cards; when cleared, the Add Company wizard's tagline/short description are used |
| Company overview | `/api/companies/company-overview` | single record |
| Service areas | `/api/companies/service-areas` | single record: base location + `latitude`/`longitude` (for distances), `radius`, and `areaDetails` — `[{ name, services: [...] }]`, the services offered in each area (syncs listing `serviceAreas`) |
| Booking settings | `/api/companies/booking` | single record |
| Opening hours | `/api/companies/opening-hours` | single record: `weeklyHours` (one row per weekday: `day`, `isOpen`, `opensAt`, `closesAt` as HH:MM; validated by `src/shared/openingHours.js`), `availability24x7`, `dailyHours`, `emergencyHours`, `holidayHours`, `specialClosures`. Shown on the profile and cards in place of the wizard's hours; deleting it falls back to the wizard's hours |
| Social links | `/api/companies/social-links` | single record: `facebook`, `instagram`, `twitter`, `linkedin`, `youtube`, `tiktok` (full https links; shown as icons in the profile header) |
| Services | `/api/companies/services` | list (syncs listing `services`): `name`, `category` (Repairs, Installation, Drains & Sewer, …), `description`, `priceType` (`fixed`, `from`, `hourly`, `quote`, `free`) + `priceAmount` — the shown `price` ("From $89", "$95/hr", "Free quote") is set from them; older services keep their free-text `price` — `duration`, `includes` (up to 12 "what's included" items), `warranty`, `emergency`, `featured`, `image`. Shared with freelancers in `src/shared/profileSections/servicesSection.js` |
| Gallery | `/api/companies/gallery` | list (8 MB body limit for videos) |
| Previous projects | `/api/companies/previous-projects` | list |
| Reviews | `/api/companies/reviews` | list |
| Team | `/api/companies/team` | list |
| FAQs | `/api/companies/faqs` | list |
| Blogs | `/api/companies/blogs` | list (unique slug per company) |
| Special offers | `/api/companies/special-offers` | list: `title`, `description`, `startDate`/`endDate`, `image`, `active`, and `coupons` — up to 20 codes per offer, each `{ code, discountType: percent\|amount\|free\|other, discountValue, label, appliesTo, minSpend, terms }` with its own discount (codes unique within an offer). Only active offers within their dates are public. Cards get `offer: { title, discount: "Up to 15% off", promoCode, couponCount, offerCount }`; the profile gets every offer with its `coupons` (each with a `discount` label). Older offers' `discount`/`promoCode` show as one coupon. Shared with freelancers in `src/shared/profileSections/specialOffersSection.js` |

Company token required (Bearer):

- Single record: `GET /`, `PUT /` (or `POST /`) — create or update the company's record; `DELETE /` — delete it.
- List: `GET /`, `POST /`, `GET /:id`, `PUT|PATCH /:id` (partial update), `DELETE /:id`.

Public (no token), by public listing id: `GET /api/companies/<section>/public/:listingId`. Only public content is returned — published blogs, visible projects, and active offers within their dates.

Validation errors return `400` with field-level messages, e.g. `{ "message": "...", "errors": { "rating": "must be at most 5" } }`. Fields not listed in a section config (such as `company` or `_id`) are ignored.

## Company URLs

Every company listing has a clean, unique `slug` used for its public page `/company/<slug>` (e.g. `abc-plumbing`, then `abc-plumbing-2` for the next company with the same name). The slug follows the Company Profile name (or the wizard's name if there is no profile). After a rename, the old slug is kept in `previousSlugs`: it still resolves, so old links redirect to the new URL, and other companies can't take it. Saving the Company Profile creates the listing if the company hasn't used the Add Company wizard; deleting the profile removes a listing that only the profile created.

## Freelancer profile sections

Freelancers get the same section structure as companies under `src/freelancer/<section>/` (`config/`, `models/`, `middleware/`, `controllers/`, `routers/`), mounted by `src/freelancer/freelancerRouter.js` at `/api/freelancers`. Sections: `header-profile`, `overview`, `service-areas`, `booking`, `opening-hours`, `social-links` (single records), `services`, `gallery`, `previous-projects`, `reviews`, `faqs`, `blogs`, `special-offers` (lists). There is no team section — a freelancer works alone.

- **Short bio:** `bio` on `/api/freelancers/header-profile` (up to 600 characters) is shown at the top of the profile and on cards (`headerBio` in the public listing); the Overview `bio` stays the longer About text.
- **Opening hours:** `GET`/`PUT /api/freelancers/opening-hours` — `weeklyHours` (one row per weekday, same rules as the company wizard, validated by `src/shared/openingHours.js`) plus `availability24x7`, `dailyHours`, `emergencyHours`, `holidayHours`, `specialClosures`; `DELETE` clears them. Companies and freelancers share the config, validation and public shape in `src/shared/profileSections/openingHoursSection.js`.
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

## Bookings between customers and plumbers

A customer books a company or freelancer from its profile (`POST /api/users/bookings`) or through cart checkout. Each booking gets a reference (`BK-7F3K2Q`), a snapshot of who booked it, and `providerAccount` — the company/freelancer account that owns the listing (null for the site's sample plumbers, which only admins can answer). The rules live in `src/shared/bookings/bookingWorkflow.js`:

| From | Plumber | Customer | Admin |
|---|---|---|---|
| `pending` (waiting for the plumber) | accept → `scheduled`, decline → `declined` | cancel | confirm, decline, cancel |
| `scheduled` (confirmed) | complete, cancel | cancel | complete, cancel |

Declining or cancelling (by the plumber or an admin) needs a reason, shown to the customer. Every change is added to the booking's `history` and announced: in-app notifications for the customer, the plumber, and admins, plus a best-effort email to the plumber for a new request and to the customer when it's accepted, declined, or cancelled. The plumber sees the customer's phone, email, and address only after accepting.

- **Coupon codes:** `POST /api/booking-quote` `{ providerType, providerId, service, couponCode? }` (anyone) returns the service's price from the plumber's Services section and, for a code, the discount: the code must be in one of the plumber's current offers (active, within its dates), match its "applies to" service, and meet its minimum spend. A percentage comes off the price, an amount comes off up to the price, and "free" codes show their label; with no set price, the percentage comes off the final price. Creating a booking with `couponCode` re-checks it on the server and stores `couponCode`, `couponLabel`, `originalPrice`, `discountAmount`, and `price` (the total) — prices sent by the browser are ignored; an invalid code stops the booking (400). Sample plumbers' codes are kept as given (`src/shared/bookings/bookingQuote.js`).
- Plumber's inbox: `/api/companies/bookings` and `/api/freelancers/bookings` — `GET /` (`?status=&search=&page=`, with `counts` per status), `GET /:id`, `PATCH /:id/accept` `{ scheduledDate?, timeSlot?, note? }` (a date is required if the customer gave none), `PATCH /:id/decline` `{ reason }`, `PATCH /:id/complete` `{ note? }`, `PATCH /:id/cancel` `{ reason }`.
- Customer: `PATCH /api/users/bookings/:id/cancel` `{ reason? }`.
- Admin: `GET /api/admin/bookings` (with `counts`), `GET /api/admin/bookings/:id` (customer, plumber, history), `PATCH /api/admin/bookings/:id/status` `{ status, note?, scheduledDate?, timeSlot? }`.
- Notifications for companies, freelancers, and admins (`src/shared/notifications`, collection `account_notifications`): `/api/companies/notifications`, `/api/freelancers/notifications`, `/api/admin/notifications` — `GET /` (with `unread`), `GET /unread-count`, `PATCH /read-all`, `PATCH /:id/read`, `DELETE /:id`. A new request's notification has `actionRequired: true` until the booking is answered. Admin notifications are shared by all admins.

## Blogs: FAQs, Plumber Finder's own posts, likes and comments

- **FAQs:** company, freelancer, and Plumber Finder posts take `faqs` — up to 15 `{ question, answer }` (`src/shared/profileSections/blogFaqs.js`), shown under the article with FAQPage structured data.
- **Plumber Finder's posts** (`platform_blogs`): admins manage them at `/api/admin/blogs` (`GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`; drafts, scheduled dates, unique slugs). Published ones are in `GET /api/blogs` (provider `platform`) and at `GET /api/blogs/platform/:slug`; the site shows them at `/blogs/<slug>`.
- **Likes, dislikes, comments** (`src/blogs/engagement`), for posts identified as `company/<id>`, `freelancer/<id>`, `platform/<id>`, or `demo/<plumber id>--<slug>` (the site's sample posts). Anyone can read; any signed-in account (customer, company, freelancer, admin — shown as "Plumber Finder") can take part:
  - `GET /api/blogs/posts/:type/:id/engagement` — likes, dislikes, comment count, and the reader's own reaction
  - `PUT /api/blogs/posts/:type/:id/reaction` `{ reaction: "like" | "dislike" | "none" }`
  - `GET /api/blogs/posts/:type/:id/comments?sort=newest|top|oldest&page=` — top-level comments, each with its replies
  - `POST /api/blogs/posts/:type/:id/comments` `{ body, parentId? }` — `parentId` may be a comment or a reply; replies stay in the top comment's thread and record who they answer (`replyTo`)
  - `PATCH /api/blogs/comments/:id` `{ body }` (author only, marked edited) · `DELETE /api/blogs/comments/:id` (author, the post's author, or an admin; a comment with replies becomes "[deleted]" and keeps its thread)
  - `PUT /api/blogs/comments/:id/reaction` `{ reaction }`
  
  - `POST /api/blogs/posts/:type/:id/view` `{ visitorId? }` — counts a read; `GET /api/blogs/stats/mine` — the signed-in author's posts with views, readers, likes, comments, and totals (admins: Plumber Finder's posts plus `site` totals by author type)

  **Views and readers** (`src/blogs/engagement/views.js`): a view is one opening of a post; the same reader opening it again within 30 minutes counts once. Readers are different people — accounts when signed in, otherwise the browser's anonymous `visitorId`. The post's author and bots aren't counted. Totals are kept per post (`blog_post_stats`) and shown on articles, in the blog feed and profiles (`views`), and in the dashboards.

  One reaction per account per post/comment (unique indexes); comment counters change by the difference from the account's previous reaction, so repeated or simultaneous clicks never double count. The post's author is notified of new comments and each person of replies to them (never of their own).

## Plumber activity (admin)

Everything people do with a company or freelancer is stored in `profile_activity` (`src/activity`): profile visits, project views, blog reads, compare and save, Call/Email/Website clicks, shares, and bookings — who (customer, company, freelancer, admin, or a guest's anonymous browser id), which plumber, what (the project, post, or booking), and when.

- The site sends page events: `POST /api/activity` `{ providerType, providerId, event: profile_view | project_view | call_click | email_click | website_click | share, target?, visitorId? }`. Bookings, blog reads, compares, and saves are recorded by the server when they happen.
- Visits and clicks count once per person per 30 minutes (a unique key per 30-minute window, so simultaneous requests can't double count). Plumbers' own visits and bots aren't counted.
- Admin (`/api/admin/activity`): `GET /providers?type=&search=&sort=views|visitors|bookings|customers|recent&page=` — every plumber with visits, unique visitors, project views, blog reads, compares, saves, contact clicks, bookings (waiting/accepted/declined/cancelled), customers and repeat customers, plus totals; `GET /providers/:type/:id` — the same for one plumber with the last 30 days, `customerList` (who booked, how many times, first/last, outcome), `bookingList`, and the activity timeline with names; `GET /recent?event=&page=` — everything, newest first.
- The plumber's own `GET /api/companies/bookings` (and freelancers') includes `customers: { total, repeat }`.

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
