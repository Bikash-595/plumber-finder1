import mongoose from "mongoose";

const companyProjectSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  client: { type: String, trim: true, maxlength: 150 },
  location: { type: String, trim: true, maxlength: 150 },
  service: { type: String, required: true, trim: true, maxlength: 150 },
  completedDate: { type: Date },
  duration: { type: String, trim: true, maxlength: 60 },
  budget: { type: String, trim: true, maxlength: 60 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  challenge: { type: String, trim: true, maxlength: 3000 },
  solution: { type: String, trim: true, maxlength: 3000 },
  results: { type: String, trim: true, maxlength: 3000 },
  beforeImage: { type: String },
  afterImage: { type: String },
  testimonial: { type: String, trim: true, maxlength: 2000 },
  rating: { type: Number, min: 0, max: 5 },
  visible: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_projects" });

export const CompanyProject = mongoose.model("CompanyProject", companyProjectSchema);
