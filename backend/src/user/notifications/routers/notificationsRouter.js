import { Router } from "express";
import { notificationsController } from "../controllers/notificationsController.js";
import { requireNotificationsAccess } from "../middleware/notificationsAuth.js";

// Mounted at /api/users/notifications.
export const notificationsRouter = Router();
notificationsRouter.use(requireNotificationsAccess);
notificationsRouter.get("/", notificationsController.list);
notificationsRouter.post("/read-all", notificationsController.markAllRead);
notificationsRouter.patch("/:id/read", notificationsController.markRead);
notificationsRouter.delete("/:id", notificationsController.remove);
