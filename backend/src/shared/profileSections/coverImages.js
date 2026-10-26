// Several cover photos at the top of a company's or freelancer's profile, shown as a slideshow.
// `coverImage` (one photo, used by cards and older pages) always follows the first of them.

export const MAX_COVER_IMAGES = 8;
export const coverImagesField = { type: "images", maxItems: MAX_COVER_IMAGES, max: 1_250_000 };

/** beforeSave hook: keeps the single `coverImage` equal to the first cover photo. */
export function syncFirstCoverImage(values) {
  if (values.coverImages !== undefined) values.coverImage = values.coverImages[0] ?? null;
}

/** The cover photos to show: the list, or the single cover saved before lists existed. */
export const coverImagesOf = (record) => (record?.coverImages?.length ? record.coverImages : record?.coverImage ? [record.coverImage] : []);
