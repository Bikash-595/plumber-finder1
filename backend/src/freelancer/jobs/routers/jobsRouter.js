import { Router } from "express";
import { jobsController } from "../../../company/jobs/controllers/jobsController.js";
import { validateNote } from "../../../company/jobs/middleware/validateNote.js";
import { requireJobsAccess } from "../middleware/jobsAuth.js";

// Mounted at /api/freelancers/jobs: accepted jobs and private notes. (Freelancers work alone, so there's
// no team assignment.) Moving a job uses /api/freelancers/bookings/:id/start|complete|cancel.
export const freelancerJobsRouter = Router();
freelancerJobsRouter.use(requireJobsAccess);
freelancerJobsRouter.get("/", jobsController.list);
freelancerJobsRouter.get("/:id", jobsController.getOne);
freelancerJobsRouter.post("/:id/notes", validateNote, jobsController.addNote);
freelancerJobsRouter.delete("/:id/notes/:noteId", jobsController.removeNote);
