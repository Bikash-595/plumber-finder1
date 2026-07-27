import mongoose from "mongoose";
const companyGallerySchema = new mongoose.Schema({ company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", unique: true, required: true }, description: String, images: [{ url: String, caption: String }], videos: [{ url: String, title: String }] }, { timestamps: true });
export const CompanyGallery = mongoose.model("CompanyGallery", companyGallerySchema);
