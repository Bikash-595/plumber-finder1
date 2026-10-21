import mongoose from "mongoose";

// Explicit collection name: older databases may still contain the retired onboarding "companygalleries" collection.
const companyGalleryItemSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  type: { type: String, trim: true, maxlength: 40 },
  media: { type: String, required: true },
  // Derived from `media` so the public page knows whether to render <img> or <video>.
  mediaKind: { type: String, enum: ["image", "video"], default: "image" },
  caption: { type: String, trim: true, maxlength: 500 },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "company_gallery_items" });

export const CompanyGalleryItem = mongoose.model("CompanyGalleryItem", companyGalleryItemSchema);
