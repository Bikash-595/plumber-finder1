import { Router } from "express";
import { activityRouter } from "./activity/activityRouter.js";
import { adminReviewsRouter } from "../reviews/reviews.js";
import { blogsRouter } from "./blogs/routers/blogsRouter.js";
import { bookingsRouter } from "./bookings/routers/bookingsRouter.js";
import { notificationsRouter } from "./notifications/routers/notificationsRouter.js";
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
  { path: "/notifications", router: notificationsRouter },
  { path: "/blogs", router: blogsRouter },
  { path: "/activity", router: activityRouter },
  { path: "/reviews", router: adminReviewsRouter },
];

export const adminRouter = Router();
for (const { path, router } of adminSections) adminRouter.use(path, router);
