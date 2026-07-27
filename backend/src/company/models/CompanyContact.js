import mongoose from "mongoose";
const companyContactSchema = new mongoose.Schema({ company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", unique: true, required: true }, primaryPhone: String, secondaryPhone: String, whatsapp: String, smsNumber: String, email: String, supportEmail: String, salesEmail: String, emergencyHotline: String, website: String, contactPerson: String, contactPersonRole: String }, { timestamps: true });
export const CompanyContact = mongoose.model("CompanyContact", companyContactSchema);
