import { Router } from "express";
import { verifyProvider } from "../../shared/verifyProvider.js";
import { bookingsController } from "../controllers/bookingsController.js";
import { requireBookingsAccess } from "../middleware/bookingsAuth.js";
import { validateBookingRequest } from "../middleware/validateBookings.js";

// Mounted at /api/users/bookings.
export const bookingsRouter = Router();
bookingsRouter.use(requireBookingsAccess);
bookingsRouter.get("/", bookingsController.list);
bookingsRouter.post("/", validateBookingRequest, verifyProvider, bookingsController.create);
bookingsRouter.get("/:id", bookingsController.getOne);
bookingsRouter.patch("/:id/cancel", bookingsController.cancel);
