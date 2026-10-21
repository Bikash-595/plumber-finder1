# Plumber Finder Admin

The admin panel is a **separate Next.js app** from the public site (`../frontend`). It talks to the same backend (`../backend`) through the admin-only API at `/api/admin/*`.

## Run locally

```bash
cp .env.example .env        # NEXT_PUBLIC_BACKEND_URL, defaults to http://localhost:3300/api
npm install
npm run dev                 # http://localhost:3001
```

The backend allows the admin origin through `ADMIN_URL` (default `http://localhost:3001`; comma-separate several origins in production).

## Admin accounts

There is no public signup. Create (or reset) an admin from the backend folder:

```bash
cd ../backend
npm run create-admin -- --email you@example.com --name "Your Name"   # asks for the password
npm run create-admin -- --email you@example.com --deactivate          # revoke access
```

Sign in at `/login`. Failed logins are rate limited (5 per 15 minutes per email + IP), and deactivated admins are signed out on their next request.

## What is live

| Page | Data |
| --- | --- |
| Overview (`/`) | Totals, new signups this week, pending approvals, bookings by status, invoice totals |
| Users | Customer accounts (search, pagination, linked Google/Apple, booking counts) |
| Companies | Approve / suspend / reinstate — suspending hides the public listing |
| Freelancers | Verify / reject / revoke verification |
| Bookings | Schedule → complete, or cancel (customers are notified) |
| Pending approvals | Companies and freelancers waiting for a decision |
| New registrations | Latest signups across all account types |

The other sidebar pages (payments, reviews, categories, marketing, …) are placeholders until their backend endpoints exist.

## Structure

- `app/login` — sign-in page
- `app/(panel)` — every page behind the admin guard (layout with sidebar/navbar)
- `components/` — panel UI (`AdminGuard`, `AdminData` table/filter helpers, sidebar, navbar)
- `lib/adminAuth.ts` — admin session (stored separately from public-site sessions)
- `lib/adminApi.ts` — typed calls to `/api/admin/*`
