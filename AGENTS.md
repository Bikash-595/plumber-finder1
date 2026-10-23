# AI Agent Guide for plumber-finder

## What this repo is
- Three apps: `frontend/` (public site + customer/company/freelancer dashboards), `admin/` (separate admin panel, port 3001), and `backend/` (Express + MongoDB API)
- A Next.js app using the App Router (`app/` directory)
- Built with Next 16.2.2, React 19 RC, TypeScript 5, Tailwind CSS 4, ESLint 9
- Primary package manager is npm (`package-lock.json` exists), but yarn/pnpm/bun are acceptable for local use
- Key shared modules live in `packages/api-client` and `packages/shared`

## Key code structure
- `app/` contains the main route tree and nested layouts
- Route group folders like `app/(dashboard)` and `app/(public)` are Next.js route groups, not public URL segments
- Each dashboard area has its own `layout.tsx` and route children
- `components/` holds shared UI components organized by feature area

## Primary commands
- From the project root: `npm run dev` starts backend (3300), frontend (3000), and admin (3001) together; `npm run dev:backend` / `dev:frontend` / `dev:admin` start one; `npm run install:all` installs all three; `npm test` runs the backend tests
- Inside `frontend/` or `admin/`:
- `npm run dev` — start development server
- `npm run build` — compile for production
- `npm run start` — run production build
- `npm run lint` — run ESLint

## Important conventions
- Preserve App Router patterns and route group structure when modifying pages
- Keep component placement aligned with feature folders under `components/`
- Use the existing `packages/` packages for shared client/backend code
- `next.config.ts` includes external image host patterns and experimental static generation settings

## What agents should not do without confirmation
- Reorganize top-level route groups such as `(dashboard)` or `(public)`
- Replace the current Next.js App Router structure with Pages Router code
- Assume all files under `app/` are regular URL segments (some folders are route groups)

## Helpful context
- The current user-facing app lives in `app/`
- Dashboard experiences are grouped under `app/(dashboard)/company-dashboard`, `app/(dashboard)/dashboard`, and `app/(dashboard)/freelancer`
- The admin panel is NOT in `frontend/` — it is the separate `admin/` app; admin APIs are in `backend/src/admin/`
- Static assets are under `public/images`
- There is no existing `AGENTS.md` or `.github/copilot-instructions.md` in this repository yet
