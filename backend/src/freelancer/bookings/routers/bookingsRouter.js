import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";
import { createProviderBookingsRouter } from "../../../shared/bookings/providerBookings.js";

// Mounted at /api/freelancers/bookings: booking requests customers sent to this freelancer.
// GET / (?status, search, page) · GET /:id · PATCH /:id/accept | decline | complete | cancel
export const freelancerBookingsRouter = createProviderBookingsRouter("freelancer", requireAuth("freelancer"));
