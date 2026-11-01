import { requireAuth } from "../../../auth/shared/middleware/requireAuth.js";
import { createMessagesRouter } from "../../../shared/messages/router.js";

// Mounted at /api/freelancers/messages — conversations with customers who booked the freelancer.
export const freelancerMessagesRouter = createMessagesRouter("freelancer", requireAuth("freelancer"));
