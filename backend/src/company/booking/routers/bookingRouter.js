import { Router } from "express";
import { bookingController } from "../controllers/bookingController.js";
import { requireCompanyBookingAccess } from "../middleware/bookingAuth.js";
import { validateBooking } from "../middleware/validateBooking.js";

export const bookingRouter = Router();

// Public: shown on a published company profile (by public listing id).
bookingRouter.get("/public/:listingId", bookingController.getPublic);

// Signed-in company: read and save its own booking settings.
bookingRouter.get("/", requireCompanyBookingAccess, bookingController.getMine);
bookingRouter.put("/", requireCompanyBookingAccess, validateBooking, bookingController.saveMine);
bookingRouter.post("/", requireCompanyBookingAccess, validateBooking, bookingController.saveMine);
bookingRouter.delete("/", requireCompanyBookingAccess, bookingController.deleteMine);
