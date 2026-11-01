import { Router } from "express";
import { companyAnalyticsRouter } from "./analytics/routers/analyticsRouter.js";
import { blogsRouter } from "./blogs/routers/blogsRouter.js";
import { companyCustomersRouter } from "./customers/routers/customersRouter.js";
import { companyJobsRouter } from "./jobs/routers/jobsRouter.js";
import { companyLeadsRouter } from "./leads/routers/leadsRouter.js";
import { companyMessagesRouter } from "./messages/routers/messagesRouter.js";
import { companyScheduleRouter } from "./schedule/routers/scheduleRouter.js";
import { companyDashboardRouter } from "./dashboard/routers/dashboardRouter.js";
import { companySettingsRouter } from "./settings/routers/settingsRouter.js";
import { bookingRouter } from "./booking/routers/bookingRouter.js";
import { companyBookingsRouter } from "./bookings/routers/bookingsRouter.js";
import { companyNotificationsRouter } from "./notifications/routers/notificationsRouter.js";
import { socialLinksRouter } from "./social-links/routers/socialLinksRouter.js";
import { openingHoursRouter } from "./opening-hours/routers/openingHoursRouter.js";
import { companyOverviewRouter } from "./company-overview/routers/companyOverviewRouter.js";
import { faqsRouter } from "./faqs/routers/faqsRouter.js";
import { galleryRouter } from "./gallery/routers/galleryRouter.js";
import { headerProfileRouter } from "./header-profile/routers/headerProfileRouter.js";
import { previousProjectsRouter } from "./previous-projects/routers/previousProjectsRouter.js";
import { companyReviewsRouter } from "./reviews/routers/reviewsRouter.js";
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
  // Customers' PlumberFinder reviews (read, reply, report) and the Google Business Profile.
  { path: "/reviews", router: companyReviewsRouter },
  { path: "/team", router: teamRouter },
  { path: "/faqs", router: faqsRouter },
  { path: "/service-areas", router: serviceAreasRouter },
  { path: "/blogs", router: blogsRouter },
  { path: "/booking", router: bookingRouter },
  { path: "/social-links", router: socialLinksRouter },
  { path: "/opening-hours", router: openingHoursRouter },
  { path: "/special-offers", router: specialOffersRouter },
  // Booking requests from customers (accept / decline) and the company's notifications.
  { path: "/bookings", router: companyBookingsRouter },
  { path: "/notifications", router: companyNotificationsRouter },
  // The dashboard home (summary + profile strength), analytics, and account settings.
  { path: "/dashboard", router: companyDashboardRouter },
  { path: "/analytics", router: companyAnalyticsRouter },
  { path: "/settings", router: companySettingsRouter },
  // Operations: leads, jobs, the calendar, customers, and messages with customers.
  { path: "/leads", router: companyLeadsRouter },
  { path: "/jobs", router: companyJobsRouter },
  { path: "/schedule", router: companyScheduleRouter },
  { path: "/customers", router: companyCustomersRouter },
  { path: "/messages", router: companyMessagesRouter },
];

export const companySectionsRouter = Router();
for (const { path, router } of companySections) companySectionsRouter.use(path, router);
