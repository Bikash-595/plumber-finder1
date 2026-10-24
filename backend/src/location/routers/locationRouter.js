import { Router } from "express";
import { lookupZip, reverseLookup } from "../controllers/locationController.js";

// Mounted at /api/location (public; used by the signup form).
export const locationRouter = Router();
locationRouter.get("/zip/:zip", lookupZip);
locationRouter.get("/reverse", reverseLookup);
