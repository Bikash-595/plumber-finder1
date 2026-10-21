// Every /api/admin route needs an active admin account.
export { requireActiveAdmin as requireAdmin } from "../../auth/admin/middleware/requireActiveAdmin.js";
