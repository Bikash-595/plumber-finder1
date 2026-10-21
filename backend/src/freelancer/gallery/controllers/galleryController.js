import { createCollectionController } from "../../shared/createCollectionController.js";
import { galleryConfig } from "../config/galleryConfig.js";
import { FreelancerGalleryItem } from "../models/FreelancerGalleryItem.js";

/** "video" for video uploads/links, otherwise "image". Also used when onboarding seeds the gallery. */
export const detectMediaKind = (media) => (/^data:video\//.test(media) || /\.(mp4|webm|mov)(\?|#|$)/i.test(media) ? "video" : "image");

export const galleryController = createCollectionController({
  Model: FreelancerGalleryItem,
  config: galleryConfig,
  beforeWrite: (values) => {
    if (values.media) values.mediaKind = detectMediaKind(values.media);
  },
});
