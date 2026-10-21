import { Router } from "express";
import { listBookings, setBookingStatus } from "../controllers/bookingsController.js";
import { requireBookingsAccess } from "../middleware/bookingsAuth.js";
import { validateBookingsStatus } from "../middleware/validateBookingsStatus.js";

// Mounted at /api/admin/bookings.
export const bookingsRouter = Router();
bookingsRouter.use(requireBookingsAccess);
bookingsRouter.get("/", listBookings);
bookingsRouter.patch("/:id/status", validateBookingsStatus, setBookingStatus);
