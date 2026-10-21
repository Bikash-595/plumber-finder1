import { Router } from "express";
import { blogsRouter } from "./blogs/routers/blogsRouter.js";
import { bookingRouter } from "./booking/routers/bookingRouter.js";
import { companyOverviewRouter } from "./company-overview/routers/companyOverviewRouter.js";
import { faqsRouter } from "./faqs/routers/faqsRouter.js";
import { galleryRouter } from "./gallery/routers/galleryRouter.js";
import { headerProfileRouter } from "./header-profile/routers/headerProfileRouter.js";
import { previousProjectsRouter } from "./previous-projects/routers/previousProjectsRouter.js";
import { reviewsRouter } from "./reviews/routers/reviewsRouter.js";
import { serviceAreasRouter } from "./service-areas/routers/serviceAreasRouter.js";
import { servicesRouter } from "./services/routers/servicesRouter.js";
import { specialOffersRouter } from "./special-offers/routers/specialOffersRouter.js";
import { teamRouter } from "./team/routers/teamRouter.js";

// Business-profile sections, each in its own folder (config, models, middleware, controllers, routers).
// Mounted at /api/companies, e.g. /api/companies/services.
export const companySections = [
  { path: "/header-profile", router: headerProfileRouter },
  { path: "/company-overview", router: companyOverviewRouter },
  { path: "/services", router: servicesRouter },
  { path: "/gallery", router: galleryRouter },
  { path: "/previous-projects", router: previousProjectsRouter },
  { path: "/reviews", router: reviewsRouter },
  { path: "/team", router: teamRouter },
  { path: "/faqs", router: faqsRouter },
  { path: "/service-areas", router: serviceAreasRouter },
  { path: "/blogs", router: blogsRouter },
  { path: "/booking", router: bookingRouter },
  { path: "/special-offers", router: specialOffersRouter },
];

export const companySectionsRouter = Router();
for (const { path, router } of companySections) companySectionsRouter.use(path, router);
