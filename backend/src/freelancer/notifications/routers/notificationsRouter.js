import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";
import { createNotificationsRouter } from "../../../shared/notifications/notificationsRouter.js";

// Mounted at /api/freelancers/notifications: this freelancer's inbox (new bookings, cancellations, admin decisions).
// GET / · GET /unread-count · PATCH /read-all · PATCH /:id/read · DELETE /:id
export const freelancerNotificationsRouter = createNotificationsRouter("freelancer", requireAuth("freelancer"));
