import mongoose from "mongoose";
const companyBrandingSchema = new mongoose.Schema({ company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", unique: true, required: true }, companyLogo: String, darkLogo: String, lightLogo: String, favicon: String, coverImage: String, heroBanner: String, mobileBanner: String, introVideo: String, brandColors: String, brandTypography: String, seoTitle: String, seoKeywords: String }, { timestamps: true });
export const CompanyBranding = mongoose.model("CompanyBranding", companyBrandingSchema);
