import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";
import { createNotificationsRouter } from "../../../shared/notifications/notificationsRouter.js";

// Mounted at /api/companies/notifications: this company's inbox (new bookings, cancellations, admin decisions).
// GET / · GET /unread-count · PATCH /read-all · PATCH /:id/read · DELETE /:id
export const companyNotificationsRouter = createNotificationsRouter("company", requireAuth("company"));
