import { Router } from "express";
import { blogsRouter } from "./blogs/routers/blogsRouter.js";
import { bookingRouter } from "./booking/routers/bookingRouter.js";
import { socialLinksRouter } from "./social-links/routers/socialLinksRouter.js";
import { faqsRouter } from "./faqs/routers/faqsRouter.js";
import { galleryRouter } from "./gallery/routers/galleryRouter.js";
import { headerProfileRouter } from "./header-profile/routers/headerProfileRouter.js";
import { freelancerListingRouter } from "./listing/routers/freelancerListingRouter.js";
import { openingHoursRouter } from "./opening-hours/routers/openingHoursRouter.js";
import { overviewRouter } from "./overview/routers/overviewRouter.js";
import { previousProjectsRouter } from "./previous-projects/routers/previousProjectsRouter.js";
import { reviewsRouter } from "./reviews/routers/reviewsRouter.js";
import { serviceAreasRouter } from "./service-areas/routers/serviceAreasRouter.js";
import { servicesRouter } from "./services/routers/servicesRouter.js";
import { specialOffersRouter } from "./special-offers/routers/specialOffersRouter.js";

// Freelancer profile sections, each in its own folder (config, models, middleware, controllers, routers).
// Mounted at /api/freelancers, e.g. /api/freelancers/services.
export const freelancerSections = [
  { path: "/header-profile", router: headerProfileRouter },
  { path: "/overview", router: overviewRouter },
  { path: "/services", router: servicesRouter },
  { path: "/gallery", router: galleryRouter },
  { path: "/previous-projects", router: previousProjectsRouter },
  { path: "/reviews", router: reviewsRouter },
  { path: "/faqs", router: faqsRouter },
  { path: "/service-areas", router: serviceAreasRouter },
  { path: "/blogs", router: blogsRouter },
  { path: "/booking", router: bookingRouter },
  { path: "/social-links", router: socialLinksRouter },
  { path: "/opening-hours", router: openingHoursRouter },
  { path: "/special-offers", router: specialOffersRouter },
];

export const freelancerRouter = Router();
for (const { path, router } of freelancerSections) freelancerRouter.use(path, router);
// Public directory: GET /api/freelancers/public and /api/freelancers/public/:id
freelancerRouter.use(freelancerListingRouter);
