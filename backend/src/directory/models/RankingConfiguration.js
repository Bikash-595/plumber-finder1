import mongoose from "mongoose";

// The admin's ranking settings (one document, key "default"). Each save keeps who changed what in `history`.
const exclusionSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, trim: true, maxlength: 300 },
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
  history: {
    type: [{ at: Date, admin: mongoose.Schema.Types.ObjectId, adminName: String, changes: [String], _id: false }],
    default: [],
  },
}, { timestamps: true, collection: "directory_ranking_configuration" });

export const RankingConfiguration = mongoose.model("RankingConfiguration", rankingConfigurationSchema);
