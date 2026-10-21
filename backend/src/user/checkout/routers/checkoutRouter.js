import { Router } from "express";
import { checkout } from "../controllers/checkoutController.js";
import { requireCheckoutAccess } from "../middleware/checkoutAuth.js";
import { validateCheckout } from "../middleware/validateCheckout.js";

// Mounted at /api/users/checkout.
export const checkoutRouter = Router();
checkoutRouter.post("/", requireCheckoutAccess, validateCheckout, checkout);
