/** "Dana Rivera" → "Dana R." (reviews show first names only). */
export function shortName(name) {
  const parts = (name ?? "Customer").trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts.at(-1)[0]}.` : parts[0];
}

/** A review as the public sees it. `viewer` is the signed-in account's token claims (or null). */
export function present(review, viewer = null) {
  return {
    _id: review._id, source: review.source ?? "directory", verified: (review.source ?? "directory") === "verified_booking",
    rating: review.rating, title: review.title ?? "", body: review.body, serviceCategory: review.serviceCategory,
    photos: review.photos ?? [], createdAt: review.createdAt, edited: Boolean(review.edited), editedAt: review.editedAt,
    author: { name: shortName(review.userName) }, reply: review.reply?.body ? review.reply : null,
    isMine: Boolean(viewer && viewer.accountType === "user" && String(review.user) === String(viewer.sub)),
  };
}

/** A review as its author sees it in their dashboard. */
export const presentForAuthor = (review) => ({
  ...present(review), isMine: true, status: review.status, moderation: review.status !== "published" ? review.moderation ?? null : null,
  providerType: review.providerType, providerId: review.providerId, providerName: review.providerName, bookingReference: review.bookingReference ?? null,
});
