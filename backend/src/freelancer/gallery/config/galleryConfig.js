// Photos and videos for the freelancer gallery. Videos can be large, so this route has a bigger body limit (see app.js).
export const galleryConfig = {
  label: "Gallery item",
  labelPlural: "gallery items",
  maxItems: 100,
  fields: {
    type: { type: "string", max: 40 },
    media: { type: "media", required: true },
    caption: { type: "text", max: 500 },
  },
};
