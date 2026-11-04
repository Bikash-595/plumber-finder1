import { Router } from "express";
import { blogsRouter } from "./blogs/routers/blogsRouter.js";
import { bookingRouter } from "./booking/routers/bookingRouter.js";
import { freelancerBookingsRouter } from "./bookings/routers/bookingsRouter.js";
import { freelancerMessagesRouter } from "./messages/routers/messagesRouter.js";
import { freelancerNotificationsRouter } from "./notifications/routers/notificationsRouter.js";
import { socialLinksRouter } from "./social-links/routers/socialLinksRouter.js";
import { faqsRouter } from "./faqs/routers/faqsRouter.js";
import { galleryRouter } from "./gallery/routers/galleryRouter.js";
import { headerProfileRouter } from "./header-profile/routers/headerProfileRouter.js";
import { freelancerListingRouter } from "./listing/routers/freelancerListingRouter.js";
import { openingHoursRouter } from "./opening-hours/routers/openingHoursRouter.js";
import { overviewRouter } from "./overview/routers/overviewRouter.js";
import { previousProjectsRouter } from "./previous-projects/routers/previousProjectsRouter.js";
import { freelancerReviewsRouter } from "./reviews/routers/reviewsRouter.js";
import { serviceAreasRouter } from "./service-areas/routers/serviceAreasRouter.js";
import { servicesRouter } from "./services/routers/servicesRouter.js";
import { specialOffersRouter } from "./special-offers/routers/specialOffersRouter.js";
import { contactRouter } from "./contact/routers/contactRouter.js";
import { locationRouter } from "./location/routers/locationRouter.js";
import { verificationRouter } from "./verification/routers/verificationRouter.js";
import { freelancerDashboardRouter } from "./dashboard/routers/dashboardRouter.js";
import { freelancerAnalyticsRouter } from "./analytics/routers/analyticsRouter.js";
import { freelancerSettingsRouter } from "./settings/routers/settingsRouter.js";
import { freelancerLeadsRouter } from "./leads/routers/leadsRouter.js";
import { freelancerJobsRouter } from "./jobs/routers/jobsRouter.js";
import { freelancerScheduleRouter } from "./schedule/routers/scheduleRouter.js";
import { freelancerCustomersRouter } from "./customers/routers/customersRouter.js";
import { freelancerQuotesRouter } from "./quotes/routers/quotesRouter.js";
import { freelancerAvailabilityRouter } from "./availability/routers/availabilityRouter.js";
import { freelancerSavedRepliesRouter } from "./saved-replies/routers/savedRepliesRouter.js";
import { freelancerPremiumRouter } from "./premium/routers/premiumRouter.js";
import { seoRouter } from "./seo/routers/seoRouter.js";

// Freelancer profile sections, each in its own folder (config, models, middleware, controllers, routers).
// Mounted at /api/freelancers, e.g. /api/freelancers/services.
export const freelancerSections = [
  { path: "/header-profile", router: headerProfileRouter },
  { path: "/overview", router: overviewRouter },
  { path: "/services", router: servicesRouter },
  { path: "/gallery", router: galleryRouter },
  { path: "/previous-projects", router: previousProjectsRouter },
  // Customers' PlumberFinder reviews (read, reply, report).
  { path: "/reviews", router: freelancerReviewsRouter },
  { path: "/faqs", router: faqsRouter },
  { path: "/service-areas", router: serviceAreasRouter },
  { path: "/blogs", router: blogsRouter },
  { path: "/booking", router: bookingRouter },
  { path: "/social-links", router: socialLinksRouter },
  { path: "/opening-hours", router: openingHoursRouter },
  { path: "/special-offers", router: specialOffersRouter },
  // Booking requests from customers (accept / decline) and the freelancer's notifications.
  { path: "/bookings", router: freelancerBookingsRouter },
  { path: "/notifications", router: freelancerNotificationsRouter },
  { path: "/messages", router: freelancerMessagesRouter },
  { path: "/contact", router: contactRouter },
  { path: "/location", router: locationRouter },
  { path: "/verification", router: verificationRouter },
  { path: "/seo", router: seoRouter },
  // The same business tools as companies: dashboard, analytics, settings, operations and growth.
  { path: "/dashboard", router: freelancerDashboardRouter },
  { path: "/analytics", router: freelancerAnalyticsRouter },
  { path: "/settings", router: freelancerSettingsRouter },
  { path: "/leads", router: freelancerLeadsRouter },
  { path: "/jobs", router: freelancerJobsRouter },
  { path: "/schedule", router: freelancerScheduleRouter },
  { path: "/customers", router: freelancerCustomersRouter },
  { path: "/quotes", router: freelancerQuotesRouter },
  { path: "/availability", router: freelancerAvailabilityRouter },
  { path: "/saved-replies", router: freelancerSavedRepliesRouter },
  // Premium plans (badge, top position): src/premium.
  { path: "/premium", router: freelancerPremiumRouter },
];

export const freelancerRouter = Router();
for (const { path, router } of freelancerSections) freelancerRouter.use(path, router);
// Public directory: GET /api/freelancers/public and /api/freelancers/public/:id
freelancerRouter.use(freelancerListingRouter);
