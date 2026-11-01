import { createMessagesRouter } from "../../../shared/messages/router.js";
import { requireUser } from "../../shared/requireUser.js";

// Mounted at /api/users/messages — the customer's conversations with plumbers they booked.
export const messagesRouter = createMessagesRouter("customer", requireUser);
