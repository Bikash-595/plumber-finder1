import { Router } from "express";
import { verifyProvider } from "../../shared/verifyProvider.js";
import { cartController } from "../controllers/cartController.js";
import { requireCartAccess } from "../middleware/cartAuth.js";
import { validateCartItem, validateCartQuantity, validatePromoCode } from "../middleware/validateCart.js";

// Mounted at /api/users/cart. Every response returns the whole cart with server-calculated totals.
export const cartRouter = Router();
cartRouter.use(requireCartAccess);
cartRouter.get("/", cartController.get);
cartRouter.delete("/", cartController.clear);
cartRouter.post("/items", validateCartItem, verifyProvider, cartController.addItem);
cartRouter.patch("/items/:id", validateCartQuantity, cartController.updateQuantity);
cartRouter.delete("/items/:id", cartController.removeItem);
cartRouter.post("/promo", validatePromoCode, cartController.applyPromo);
cartRouter.delete("/promo", cartController.removePromo);
