import { Router } from "express";
import { getSchedule } from "../../../company/schedule/controllers/scheduleController.js";
import { requireScheduleAccess } from "../middleware/scheduleAuth.js";

// Mounted at /api/freelancers/schedule.
export const freelancerScheduleRouter = Router();
freelancerScheduleRouter.use(requireScheduleAccess);
freelancerScheduleRouter.get("/", getSchedule);
