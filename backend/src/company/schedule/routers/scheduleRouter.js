import { Router } from "express";
import { getSchedule } from "../controllers/scheduleController.js";
import { requireScheduleAccess } from "../middleware/scheduleAuth.js";

// Mounted at /api/companies/schedule.
export const companyScheduleRouter = Router();
companyScheduleRouter.use(requireScheduleAccess);
companyScheduleRouter.get("/", getSchedule);
