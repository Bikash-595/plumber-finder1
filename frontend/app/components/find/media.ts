// Video helpers shared by the card slideshow and the profile gallery.

/** The 11-character id of a YouTube link (watch, embed, or youtu.be), or null. */
export const youtubeId = (url: string) => url.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/)?.[1] ?? null;

/** YouTube's own thumbnail for a video. */
export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
