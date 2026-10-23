import mongoose from "mongoose";
// Everything the company typed into the Add Company wizard, saved step by step so the
// wizard can be resumed and edited later. `submittedAt` is set once the listing is published.
const companyOnboardingDraftSchema = new mongoose.Schema({ company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", unique: true, required: true }, formData: { type: mongoose.Schema.Types.Mixed, default: {} }, services: { type: [mongoose.Schema.Types.Mixed], default: [] }, locations: { type: [mongoose.Schema.Types.Mixed], default: [] }, galleryImages: { type: [mongoose.Schema.Types.Mixed], default: [] }, galleryVideos: { type: [mongoose.Schema.Types.Mixed], default: [] }, weeklyHours: { type: [mongoose.Schema.Types.Mixed], default: [] }, completedSteps: { type: [String], default: [] }, submittedAt: Date }, { timestamps: true, minimize: false });
export const CompanyOnboardingDraft = mongoose.model("CompanyOnboardingDraft", companyOnboardingDraftSchema);
