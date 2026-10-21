import { Router } from "express";
import { paymentMethodsController } from "../controllers/paymentMethodsController.js";
import { requirePaymentMethodsAccess } from "../middleware/paymentMethodsAuth.js";
import { validatePaymentMethodCreate, validatePaymentMethodUpdate } from "../middleware/validatePaymentMethods.js";

// Mounted at /api/users/payment-methods.
export const paymentMethodsRouter = Router();
paymentMethodsRouter.use(requirePaymentMethodsAccess);
paymentMethodsRouter.get("/", paymentMethodsController.list);
paymentMethodsRouter.post("/", validatePaymentMethodCreate, paymentMethodsController.create);
paymentMethodsRouter.patch("/:id", validatePaymentMethodUpdate, paymentMethodsController.update);
paymentMethodsRouter.delete("/:id", paymentMethodsController.remove);
