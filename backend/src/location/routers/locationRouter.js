import { Router } from "express";
import { lookupPlace, lookupZip, reverseLookup } from "../controllers/locationController.js";
import { listCities, listStates } from "../../directory/controllers/directoryController.js";

// Mounted at /api/location (public; used by the signup form).
export const locationRouter = Router();
locationRouter.get("/zip/:zip", lookupZip);
locationRouter.get("/reverse", reverseLookup);
locationRouter.get("/place", lookupPlace);
// The 50 states + DC and their cities, with how many providers are listed (directory pages and search).
locationRouter.get("/states", listStates);
locationRouter.get("/states/:state/cities", listCities);
