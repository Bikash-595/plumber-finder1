import { Router } from "express";
import { getHeaderProfile, saveHeaderProfile } from "../controllers/headerProfileController.js";
import { requireCompanyHeaderProfileAccess } from "../middleware/headerProfileAuth.js";

export const headerProfileRouter = Router();
headerProfileRouter.use(requireCompanyHeaderProfileAccess);
headerProfileRouter.get("/", getHeaderProfile);
headerProfileRouter.put("/", saveHeaderProfile);
headerProfileRouter.post("/", saveHeaderProfile);
