import { Router } from "express";
import { bookingController } from "../controllers/bookingController.js";
import { requireFreelancerBookingAccess } from "../middleware/bookingAuth.js";
import { validateBooking } from "../middleware/validateBooking.js";

export const bookingRouter = Router();

// Public: shown on a published freelancer profile (by public listing id).
bookingRouter.get("/public/:listingId", bookingController.getPublic);

// Signed-in freelancer: read and save its own booking settings.
bookingRouter.get("/", requireFreelancerBookingAccess, bookingController.getMine);
bookingRouter.put("/", requireFreelancerBookingAccess, validateBooking, bookingController.saveMine);
bookingRouter.post("/", requireFreelancerBookingAccess, validateBooking, bookingController.saveMine);
