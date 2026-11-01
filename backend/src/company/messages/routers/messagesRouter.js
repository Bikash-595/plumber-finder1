import { createMessagesRouter } from "../../../shared/messages/router.js";
import { requireMessagesAccess } from "../middleware/messagesAuth.js";

// Mounted at /api/companies/messages: GET / · POST / { bookingId } · GET /:id · POST /:id { body } · PATCH /:id/read
export const companyMessagesRouter = createMessagesRouter("company", requireMessagesAccess);
