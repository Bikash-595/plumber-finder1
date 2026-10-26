import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { companyListingRouter } from "./company/listing/routers/companyListingRouter.js";
import { companyOnboardingRouter } from "./company/onboarding/routers/companyOnboardingRouter.js";
import { companySections, companySectionsRouter } from "./company/companySectionsRouter.js";
import { authRouter } from "./auth/authRouter.js";
import { freelancerRouter, freelancerSections } from "./freelancer/freelancerRouter.js";
import { publicBlogsRouter } from "./blogs/routers/publicBlogsRouter.js";
import { locationRouter } from "./location/routers/locationRouter.js";
import { userRouter, userSections } from "./user/userRouter.js";
import { adminRouter, adminSections } from "./admin/adminRouter.js";

export const app = express();

const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:3000";
// The admin panel is a separate app on its own origin.
const adminUrl = process.env.ADMIN_URL || "http://localhost:3001";

app.use(cors({ origin: [...frontendUrl.split(","), ...adminUrl.split(",")].map((origin) => origin.trim()).filter(Boolean) }));
// Gallery items may be videos and header profiles carry several cover photos, so those routes accept larger bodies.
const largeBodyPaths = ["/api/companies/gallery", "/api/freelancers/gallery", "/api/companies/header-profile", "/api/freelancers/header-profile"];
const jsonDefault = express.json({ limit: "3mb" });
const jsonLarge = express.json({ limit: "8mb" });
app.use((req, res, next) => (largeBodyPaths.some((path) => req.path.startsWith(path)) ? jsonLarge : jsonDefault)(req, res, next));

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

app.use("/api/auth", authRouter);
app.use("/api/companies", companySectionsRouter);
app.use("/api/companies/onboarding", companyOnboardingRouter);
app.use("/api/companies", companyListingRouter);
app.use("/api/freelancers", freelancerRouter);
app.use("/api/blogs", publicBlogsRouter);
app.use("/api/location", locationRouter);
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

  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});
