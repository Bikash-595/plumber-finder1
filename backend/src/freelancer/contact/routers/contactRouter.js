import { Router } from "express";
import { contactController } from "../controllers/contactController.js";
import { requireContactAccess } from "../middleware/contactAuth.js";
import { validateContact } from "../middleware/validateContact.js";

// Mounted at /api/freelancers/contact. The public profile reads these itself.
export const contactRouter = Router();
contactRouter.get("/", requireContactAccess, contactController.getMine);
contactRouter.put("/", requireContactAccess, validateContact, contactController.saveMine);
contactRouter.delete("/", requireContactAccess, contactController.deleteMine);
