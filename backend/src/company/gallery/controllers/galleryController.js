import { createCollectionController } from "../../shared/createCollectionController.js";
import { galleryConfig } from "../config/galleryConfig.js";
import { CompanyGalleryItem } from "../models/CompanyGalleryItem.js";

/** "video" for video uploads/links, otherwise "image". Also used when onboarding seeds the gallery. */
// Uploaded videos, video files, and YouTube links are videos; everything else is a photo.
export const detectMediaKind = (media) => (/^data:video\//.test(media) || /\.(mp4|webm|mov)(\?|#|$)/i.test(media) || /(youtube(-nocookie)?\.com\/(embed\/|watch\?v=)|youtu\.be\/)[\w-]{11}/i.test(media) ? "video" : "image");

export const galleryController = createCollectionController({
  Model: CompanyGalleryItem,
  config: galleryConfig,
  beforeWrite: (values) => {
    if (values.media) values.mediaKind = detectMediaKind(values.media);
  },
});
