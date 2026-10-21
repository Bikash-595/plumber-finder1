import mongoose from "mongoose";

const companyTeamMemberSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, trim: true, maxlength: 120 },
  bio: { type: String, trim: true, maxlength: 2000 },
  photo: { type: String },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_team_members" });

export const CompanyTeamMember = mongoose.model("CompanyTeamMember", companyTeamMemberSchema);
