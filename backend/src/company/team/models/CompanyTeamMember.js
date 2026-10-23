import mongoose from "mongoose";

const companyTeamMemberSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, trim: true, maxlength: 120 },
  bio: { type: String, trim: true, maxlength: 2000 },
  photo: { type: String },
  specialties: [{ type: String, trim: true }],
  experienceYears: { type: Number, min: 0, max: 80 },
  certificates: [{ type: String, trim: true }],
  licenseNumber: { type: String, trim: true, maxlength: 120 },
  availability: { type: String, trim: true, maxlength: 120 },
  joinedYear: { type: Number, min: 1900 },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_team_members" });

export const CompanyTeamMember = mongoose.model("CompanyTeamMember", companyTeamMemberSchema);
