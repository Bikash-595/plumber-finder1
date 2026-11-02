import { Router } from "express";
import { jobsController } from "../controllers/jobsController.js";
import { requireJobsAccess } from "../middleware/jobsAuth.js";
import { validateNote } from "../middleware/validateNote.js";

// Mounted at /api/companies/jobs. Moving a job uses /api/companies/bookings/:id/start|complete|cancel.
export const companyJobsRouter = Router();
companyJobsRouter.use(requireJobsAccess);
companyJobsRouter.get("/", jobsController.list);
companyJobsRouter.get("/team", jobsController.team);
companyJobsRouter.get("/:id", jobsController.getOne);
companyJobsRouter.patch("/:id/assign", jobsController.assign);
companyJobsRouter.post("/:id/notes", validateNote, jobsController.addNote);
companyJobsRouter.delete("/:id/notes/:noteId", jobsController.removeNote);
