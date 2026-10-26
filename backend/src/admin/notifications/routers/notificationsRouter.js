import { createNotificationsRouter } from "../../../shared/notifications/notificationsRouter.js";
import { requireAdmin } from "../../shared/requireAdmin.js";

// Mounted at /api/admin/notifications: one inbox shared by all admins (new bookings and every status change).
export const notificationsRouter = createNotificationsRouter("admin", requireAdmin);
