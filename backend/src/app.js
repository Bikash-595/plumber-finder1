import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { companyAuthRouter } from "./company/routers/companyAuthRouter.js";
import { companyListingRouter } from "./company/routers/companyListingRouter.js";
import { headerProfileRouter } from "./company/header-profile/routers/headerProfileRouter.js";
import { authRouter } from "./routes/authRoutes.js";
import { freelancerAuthRouter } from "./freelancer/routers/freelancerAuthRouter.js";
import { userAuthRouter } from "./user/routers/userAuthRouter.js";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000" }));
app.use(express.json({ limit: "3mb" }));

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
    endpoints: ["GET /health", "POST /api/auth/login", "POST /api/auth/users/signup", "POST /api/auth/companies/signup", "POST /api/auth/freelancers/signup"],
  });
});

app.use("/api/auth", authRouter);
app.use("/api/companies/header-profile", headerProfileRouter);
app.use("/api/companies", companyListingRouter);
app.use("/api/auth/users", userAuthRouter);
app.use("/api/auth/companies", companyAuthRouter);
app.use("/api/auth/freelancers", freelancerAuthRouter);

app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

app.use((error, _req, res, _next) => {
  if (error instanceof mongoose.Error.CastError) return res.status(400).json({ message: "Invalid resource id." });
  if (error instanceof mongoose.Error.ValidationError) return res.status(400).json({ message: "Validation failed.", details: error.errors });
  if (error?.code === 11000) return res.status(409).json({ message: "A record with this value already exists." });

  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});
