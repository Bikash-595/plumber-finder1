import mongoose from "mongoose";

// An admin's settings for one landing page or one whole location (only stored when they differ from the default):
//   kind "page"     key = the page's path ("/top-10-plumbers/texas", "/top-50-plumbers-usa")
//   kind "location" key = "usa", "state:TX" or "city:TX/austin" — unpublishing one hides every page there
// An unpublished page answers 404 and leaves the sitemap; title / description / intro replace the built-in wording.
const directoryPageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true, maxlength: 200 },
  kind: { type: String, enum: ["page", "location"], required: true },
  published: { type: Boolean, default: true },
  title: { type: String, trim: true, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 320 },
  intro: { type: String, trim: true, maxlength: 1500 },
  updatedBy: { type: String, trim: true },
}, { timestamps: true, collection: "directory_pages" });

export const DirectoryPage = mongoose.model("DirectoryPage", directoryPageSchema);
