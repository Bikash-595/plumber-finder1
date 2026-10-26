import { Router } from "express";
import { createNotificationsController } from "./notificationsController.js";

/** Router for one account type's inbox; `auth` is that account type's sign-in middleware. */
export function createNotificationsRouter(recipientType, auth) {
  const controller = createNotificationsController(recipientType);
  const router = Router();
  router.use(auth);
  router.get("/", controller.list);
  router.get("/unread-count", controller.unreadCount);
  router.patch("/read-all", controller.markAllRead);
  router.patch("/:id/read", controller.markRead);
  router.delete("/:id", controller.remove);
  return router;
}
