import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";
import { createProviderBookingsRouter } from "../../../shared/bookings/providerBookings.js";

// Mounted at /api/companies/bookings: booking requests customers sent to this company.
// GET / (?status, search, page) · GET /:id · PATCH /:id/accept | decline | complete | cancel
export const companyBookingsRouter = createProviderBookingsRouter("company", requireAuth("company"));
