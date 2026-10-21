import { requireAuth } from "../../auth/shared/middleware/requireAuth.js";

// Every /api/users route belongs to a signed-in customer ("user" account type).
export const requireUser = requireAuth("user");
