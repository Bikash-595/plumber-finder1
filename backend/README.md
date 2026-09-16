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
- `GET`, `POST /api/plumbers`
- `GET`, `PATCH`, `DELETE /api/plumbers/:id`
- `GET`, `POST /api/bookings`
- `PATCH /api/bookings/:id`

## Authentication

Each account type has its own model, controller, and router. Replace `{type}` with `users`, `companies`, or `freelancers`:

- `POST /api/auth/{type}/signup` — email/password registration
- `POST /api/auth/{type}/login` — email/password login
- `POST /api/auth/{type}/google` — Google Identity credential login/registration
- `GET /api/auth/{type}/me` — current account (Bearer token required)

`users` and `freelancers` require `name`, `email`, and `password` to sign up. `companies` requires `companyName`, `email`, and `password`. Google requests send the Google Identity Services `credential` (ID token), which is verified by the server before an account is created.

## Google sign-in setup

1. In Google Cloud Console, create an OAuth 2.0 credential with application type **Web application**.
2. Add every frontend origin exactly, for example `http://localhost:3000` for development and `https://app.example.com` in production. Do not add `/api` to these origins.
3. Set the issued client ID, ending in `.apps.googleusercontent.com`, as both `frontend/NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `backend/GOOGLE_CLIENT_ID`.
4. Set `FRONTEND_URL` to the same comma-separated frontend origins and restart both services after changing environment files.

The client secret is not used by this ID-token flow and must never be exposed through `NEXT_PUBLIC_*` variables.

`GET /api/plumbers` accepts `page`, `limit`, `q`, `service`, `area`, and `available=true` query parameters.
