import { Router } from "express";
import { rateLimit } from "../../reviews/middleware/rateLimit.js";
import { createMessagesController } from "./controller.js";

/** Messages router for one side ("customer", "company", "freelancer"); `auth` signs in that account type. */
export function createMessagesRouter(side, auth) {
  const controller = createMessagesController(side);
  const limitSending = rateLimit({ windowMs: 60 * 1000, max: 30, message: "You're sending messages too fast. Please slow down." });
  const router = Router();
  router.use(auth);
  router.get("/", controller.list);
  router.post("/", controller.open);
  router.get("/:id", controller.thread);
  router.post("/:id", limitSending, controller.send);
  router.patch("/:id/read", controller.read);
  return router;
}
