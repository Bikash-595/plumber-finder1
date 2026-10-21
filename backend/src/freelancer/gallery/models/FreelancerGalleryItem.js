import mongoose from "mongoose";

const freelancerGalleryItemSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, index: true },
  type: { type: String, trim: true, maxlength: 40 },
  media: { type: String, required: true },
  // Derived from `media` so the public page knows whether to render <img> or <video>.
  mediaKind: { type: String, enum: ["image", "video"], default: "image" },
  caption: { type: String, trim: true, maxlength: 500 },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "freelancer_gallery_items" });

export const FreelancerGalleryItem = mongoose.model("FreelancerGalleryItem", freelancerGalleryItemSchema);
