import mongoose from "mongoose";
import { forProvider } from "../../../shared/bookings/bookingWorkflow.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { findPage, pageParams, textFilter } from "../../../user/shared/paginate.js";
import { toId } from "../../dashboard/services/metrics.js";
import { jobsConfig as config } from "../config/jobsConfig.js";
import { JobNote } from "../models/JobNote.js";

const scopeOf = (req) => ({ providerType: "company", providerAccount: toId(req.auth.sub) });
const accepted = { acceptedAt: { $exists: true } };

export const jobsController = {
  // GET /?stage=&q=&cursor= — accepted jobs (newest first) and how many are in each stage.
  list: async (req, res, next) => {
    try {
      const scope = scopeOf(req);
      const stage = config.stages.includes(req.query.stage) ? { status: req.query.stage } : {};
      const params = pageParams(req.query, { defaultLimit: 30, maxLimit: 60 });
      const [page, groups] = await Promise.all([
        findPage(UserBooking, { ...scope, ...accepted, ...stage, ...textFilter(req.query.q, ["reference", "customerName", "service", "address"]) }, params),
        params.cursor ? null : UserBooking.aggregate([{ $match: { ...scope, ...accepted } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);
      res.json({ ...page, data: page.data.map(forProvider), ...(groups ? { counts: Object.fromEntries(config.stages.map((name) => [name, groups.find((row) => row._id === name)?.count ?? 0])) } : {}) });
    } catch (error) { next(error); }
  },

  // GET /:id — one job with its private notes.
  getOne: async (req, res, next) => {
    try {
      const job = mongoose.isValidObjectId(req.params.id) ? await UserBooking.findOne({ ...scopeOf(req), _id: req.params.id }) : null;
      if (!job) return res.status(404).json({ message: "Job not found." });
      const notes = await JobNote.find({ ...scopeOf(req), booking: job._id }).sort({ createdAt: -1 }).limit(100).lean();
      res.json({ data: { ...forProvider(job), notes } });
    } catch (error) { next(error); }
  },

  // POST /:id/notes { body } — a private note on the job.
  addNote: async (req, res, next) => {
    try {
      const job = mongoose.isValidObjectId(req.params.id) ? await UserBooking.exists({ ...scopeOf(req), _id: req.params.id }) : null;
      if (!job) return res.status(404).json({ message: "Job not found." });
      if (await JobNote.countDocuments({ ...scopeOf(req), booking: job._id }) >= 100) return res.status(409).json({ message: "This job has the maximum of 100 notes." });
      const note = await JobNote.create({ ...scopeOf(req), booking: job._id, body: req.validated.body });
      res.status(201).json({ message: "Note added.", data: note });
    } catch (error) { next(error); }
  },

  // DELETE /:id/notes/:noteId
  removeNote: async (req, res, next) => {
    try {
      const note = mongoose.isValidObjectId(req.params.noteId) ? await JobNote.findOneAndDelete({ ...scopeOf(req), booking: req.params.id, _id: req.params.noteId }) : null;
      if (!note) return res.status(404).json({ message: "Note not found." });
      res.json({ message: "Note deleted." });
    } catch (error) { next(error); }
  },
};
