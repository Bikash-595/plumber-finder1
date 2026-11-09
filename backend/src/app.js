import cors from "cors";
import { publicReviewsRouter } from "./reviews/routers/publicReviewsRouter.js";
import { bookingQuoteRouter } from "./shared/bookings/bookingQuote.js";
import { activityRouter } from "./activity/activityRouter.js";
import express from "express";
import { securityHeaders } from "./auth/shared/middleware/securityHeaders.js";
import mongoose from "mongoose";
import { isDatabaseUnavailable, requireDatabase, sendDatabaseUnavailable } from "./config/databaseAvailability.js";
import { companyListingRouter } from "./company/listing/routers/companyListingRouter.js";
import { companyOnboardingRouter } from "./company/onboarding/routers/companyOnboardingRouter.js";
import { companySections, companySectionsRouter } from "./company/companySectionsRouter.js";
import { authRouter } from "./auth/authRouter.js";
import { freelancerRouter, freelancerSections } from "./freelancer/freelancerRouter.js";
import { publicBlogsRouter } from "./blogs/routers/publicBlogsRouter.js";
import { locationRouter } from "./location/routers/locationRouter.js";
import { userRouter, userSections } from "./user/userRouter.js";
import { adminRouter, adminSections } from "./admin/adminRouter.js";
import { premiumWebhookRouter } from "./premium/routers/webhookRouter.js";
import { mediaRouter } from "./media/mediaRouter.js";
import { directoryRouter, searchRouter } from "./directory/routers/directoryRouter.js";
import { invalidateDirectories } from "./shared/business/directoryCache.js";
import { invalidateProfiles } from "./shared/business/profileCache.js";
import { allowedOrigins, originMatcher } from "./config/urls.js";

export const app = express();
app.disable("x-powered-by");
// Behind a load balancer / reverse proxy, rate limits must see the real client IP, not the proxy's (or every
// visitor shares one limit). TRUST_PROXY sets it ("1" = one hop); on Render, which always sits behind one proxy,
// it is one hop unless set otherwise.
const trustProxy = process.env.TRUST_PROXY ?? (process.env.RENDER ? "1" : "");
if (trustProxy) app.set("trust proxy", /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);
app.use(securityHeaders);

// The public site and the admin panel are separate apps on their own origins (config/urls.js).
const isAllowedOrigin = originMatcher();
const refused = new Set();
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin (server-side rendering, health checks, curl) aren't cross-origin browser calls.
    if (!origin || isAllowedOrigin(origin)) return callback(null, true);
    if (!refused.has(origin) && refused.size < 50) {
      refused.add(origin);
      console.warn(`CORS: refused ${origin}. Allowed: ${allowedOrigins().join(", ")} — add it to FRONTEND_URL, ADMIN_URL or CORS_ORIGIN.`);
    }
    return callback(null, false);
  },
  maxAge: 600,
}));
// Gallery items may be videos; header profiles and services carry several photos, so those routes accept larger bodies.
const largeBodyPaths = ["/api/companies/gallery", "/api/freelancers/gallery", "/api/companies/header-profile", "/api/freelancers/header-profile", "/api/users/reviews"];
// Services carry up to 8 photos and an uploaded clip (the services config caps their total size).
const mediaBodyPaths = ["/api/companies/services", "/api/freelancers/services"];
const jsonDefault = express.json({ limit: "3mb" });
const jsonLarge = express.json({ limit: "8mb" });
const jsonMedia = express.json({ limit: "15mb" });
// The Stripe webhook is checked against its exact bytes, so it gets the raw body (and is mounted before JSON parsing).
// While the database is down or the server is restarting, API calls answer 503 (health checks still answer).
app.use("/api", requireDatabase);
app.use("/api/premium/webhook", express.raw({ type: "application/json", limit: "1mb" }), premiumWebhookRouter);
app.use((req, res, next) => (mediaBodyPaths.some((path) => req.path.startsWith(path)) ? jsonMedia : largeBodyPaths.some((path) => req.path.startsWith(path)) ? jsonLarge : jsonDefault)(req, res, next));

app.get("/health", (_req, res) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? "ok" : "unavailable",
    service: "plumber-finder-backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api", (_req, res) => {
  res.json({
    message: "Plumber Finder API is running.",
    endpoints: ["GET /health", "POST /api/auth/login", "POST /api/auth/users/signup", "POST /api/auth/companies/signup", "POST /api/auth/freelancers/signup", "POST /api/auth/{users|companies|freelancers}/{login|google|apple}", "GET /api/companies/public", "GET /api/companies/public/:id", "GET /api/companies/public/:id/profile", ...companySections.map(({ path }) => `/api/companies${path}`), "GET /api/freelancers/public", "GET /api/freelancers/public/:id", "GET /api/freelancers/public/:id/profile", "GET /api/blogs", ...freelancerSections.map(({ path }) => `/api/freelancers${path}`), ...userSections.map(({ path }) => `/api/users${path}`), "POST /api/auth/admins/login", ...adminSections.map(({ path }) => `/api/admin${path}`)],
  });
});

// Public directories and profiles are cached (shared/business/directoryCache.js, profileCache.js). A successful
// change by a company or freelancer ends the directories and that owner's profile; a change by an admin, a
// customer's review, or a Stripe event can touch anyone's, so it ends them all.
const publicWriters = /^\/api\/(companies|freelancers|admin|users\/reviews|premium)\b/;
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD" && publicWriters.test(req.path)) {
    res.on("finish", () => {
      if (res.statusCode >= 400) return;
      invalidateDirectories();
      const { accountType, sub } = req.auth ?? {};
      invalidateProfiles(accountType === "company" || accountType === "freelancer" ? `${accountType}:${sub}` : undefined);
    });
  }
  next();
});

// Uploaded pictures as cacheable image files (public pages link to them instead of embedding them).
app.use("/api/media", mediaRouter);
app.use("/api/auth", authRouter);
app.use("/api/companies", companySectionsRouter);
app.use("/api/companies/onboarding", companyOnboardingRouter);
app.use("/api/companies", companyListingRouter);
app.use("/api/freelancers", freelancerRouter);
app.use("/api/blogs", publicBlogsRouter);
// Profile visits, project views, and contact clicks from the public site (admins see them per plumber).
app.use("/api/activity", activityRouter);
// Price of a booking with a coupon code (shown in the booking form before sending).
app.use("/api/booking-quote", bookingQuoteRouter);
// Public reviews on profiles (stats, lists, company Google reviews, reporting). Writing, managing and moderating
// reviews live in each area: /api/users/reviews, /api/companies/reviews, /api/freelancers/reviews, /api/admin/reviews.
app.use("/api/reviews", publicReviewsRouter);
app.use("/api/location", locationRouter);
// Top 10 / Top 50 directory pages, natural-language search and suggestions (src/directory).
app.use("/api/directory", directoryRouter);
app.use("/api/search", searchRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

app.use((error, _req, res, _next) => {
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: error.path === "_id" ? "Invalid resource id." : `Invalid value for ${error.path}.` });
  }
  if (error instanceof mongoose.Error.ValidationError) return res.status(400).json({ message: "Validation failed.", details: error.errors });
  if (error?.code === 11000) return res.status(409).json({ message: "A record with this value already exists." });
  // Client errors raised by express.json (malformed JSON, body too large) or by our own code.
  if (error?.type === "entity.parse.failed") return res.status(400).json({ message: "Request body is not valid JSON." });
  if (error?.status >= 400 && error.status < 500) return res.status(error.status).json({ message: error.message });
  // Our own service errors (e.g. "Apple sign-in is not configured") opt in with `expose: true`.
  if (error?.expose && error.status >= 500 && error.status < 600) return res.status(error.status).json({ message: error.message });

  // The database went away mid-request (a restart or a lost connection): "try again", not a 500 and a stack trace.
  if (isDatabaseUnavailable(error)) return sendDatabaseUnavailable(res, error);
  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});
