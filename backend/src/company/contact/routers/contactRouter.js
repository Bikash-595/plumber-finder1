import { Router } from "express";
import { contactController } from "../controllers/contactController.js";
import { requireCompanyContactAccess } from "../middleware/contactAuth.js";
import { validateContact } from "../middleware/validateContact.js";

export const contactRouter = Router();

// Signed-in company: read, save, and delete its contact details. The public profile reads them itself.
contactRouter.get("/", requireCompanyContactAccess, contactController.getMine);
contactRouter.put("/", requireCompanyContactAccess, validateContact, contactController.saveMine);
contactRouter.delete("/", requireCompanyContactAccess, contactController.deleteMine);
