import { Router } from "express";
import { addressesRouter } from "./addresses/routers/addressesRouter.js";
import { bookingsRouter } from "./bookings/routers/bookingsRouter.js";
import { cartRouter } from "./cart/routers/cartRouter.js";
import { checkoutRouter } from "./checkout/routers/checkoutRouter.js";
import { compareRouter } from "./compare/routers/compareRouter.js";
import { dashboardRouter } from "./dashboard/routers/dashboardRouter.js";
import { invoicesRouter } from "./invoices/routers/invoicesRouter.js";
import { notificationsRouter } from "./notifications/routers/notificationsRouter.js";
import { paymentMethodsRouter } from "./payment-methods/routers/paymentMethodsRouter.js";
import { profileRouter } from "./profile/routers/profileRouter.js";
import { savedRouter } from "./saved/routers/savedRouter.js";
import { securityRouter } from "./security/routers/securityRouter.js";
import { settingsRouter } from "./settings/routers/settingsRouter.js";

// Customer dashboard areas, each in its own folder. Mounted at /api/users; customer accounts only.
export const userSections = [
  { path: "/dashboard", router: dashboardRouter },
  { path: "/profile", router: profileRouter },
  { path: "/addresses", router: addressesRouter },
  { path: "/settings", router: settingsRouter },
  { path: "/security", router: securityRouter },
  { path: "/saved", router: savedRouter },
  { path: "/compare", router: compareRouter },
  { path: "/cart", router: cartRouter },
  { path: "/checkout", router: checkoutRouter },
  { path: "/bookings", router: bookingsRouter },
  { path: "/notifications", router: notificationsRouter },
  { path: "/invoices", router: invoicesRouter },
  { path: "/payment-methods", router: paymentMethodsRouter },
];

export const userRouter = Router();
for (const { path, router } of userSections) userRouter.use(path, router);
