import { Router } from "express";
import { listRegistrations } from "../controllers/registrationsController.js";
import { requireRegistrationsAccess } from "../middleware/registrationsAuth.js";

// Mounted at /api/admin/registrations.
export const registrationsRouter = Router();
registrationsRouter.get("/", requireRegistrationsAccess, listRegistrations);
