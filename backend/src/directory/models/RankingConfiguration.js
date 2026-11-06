import mongoose from "mongoose";

// The admin's ranking settings (one document, key "default"). Each save keeps who changed what in `history`.
const exclusionSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, trim: true, maxlength: 300 },
}, { _id: false });

const placementSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true },
  kind: { type: String, enum: ["featured", "sponsored"], default: "sponsored" },
  stateCode: { type: String, default: null },
  citySlug: { type: String, default: null },
  until: { type: Date, default: null },
  note: { type: String, trim: true, maxlength: 300 },
}, { _id: false });

const templateSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 320 },
  showMap: Boolean,
  showFaq: Boolean,
}, { _id: false });

const rankingConfigurationSchema = new mongoose.Schema({
  key: { type: String, default: "default", unique: true },
  weights: {
    rating: Number, verified: Number, jobs: Number, relevance: Number, completeness: Number, engagement: Number,
  },
  ratingConfidenceReviews: Number,
  jobsForFullScore: Number,
  engagementForFullScore: Number,
  newBusinessDays: Number,
  newBusinessPenalty: Number,
  minimumQualifyingCompanies: Number,
  defaultResultLimit: Number,
  sponsoredSlots: Number,
  exclusions: { type: [exclusionSchema], default: [] },
  placements: { type: [placementSchema], default: [] },
  templates: { usa: templateSchema, state: templateSchema, city: templateSchema },
  history: {
    type: [{ at: Date, admin: mongoose.Schema.Types.ObjectId, adminName: String, changes: [String], _id: false }],
    default: [],
  },
}, { timestamps: true, collection: "directory_ranking_configuration" });

export const RankingConfiguration = mongoose.model("RankingConfiguration", rankingConfigurationSchema);
