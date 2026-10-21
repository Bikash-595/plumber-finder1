import { Router } from "express";
import { bookingsRouter } from "./bookings/routers/bookingsRouter.js";
import { companiesRouter } from "./companies/routers/companiesRouter.js";
import { freelancersRouter } from "./freelancers/routers/freelancersRouter.js";
import { overviewRouter } from "./overview/routers/overviewRouter.js";
import { registrationsRouter } from "./registrations/routers/registrationsRouter.js";
import { usersRouter } from "./users/routers/usersRouter.js";

// Admin app APIs, each in its own folder. Mounted at /api/admin; active admin accounts only.
export const adminSections = [
  { path: "/overview", router: overviewRouter },
  { path: "/users", router: usersRouter },
  { path: "/companies", router: companiesRouter },
  { path: "/freelancers", router: freelancersRouter },
  { path: "/bookings", router: bookingsRouter },
  { path: "/registrations", router: registrationsRouter },
];

export const adminRouter = Router();
for (const { path, router } of adminSections) adminRouter.use(path, router);
