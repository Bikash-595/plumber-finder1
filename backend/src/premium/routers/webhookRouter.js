import { Router } from "express";
import { stripeWebhook } from "../controllers/webhookController.js";

// Mounted at /api/premium/webhook with a raw (unparsed) body, which the signature check needs (see app.js).
export const premiumWebhookRouter = Router();
premiumWebhookRouter.post("/stripe", stripeWebhook);
