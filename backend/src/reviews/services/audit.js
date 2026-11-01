import { ReviewAudit } from "../models/index.js";

/** Records a change to a review (never fails the request that caused it). */
export function audit(review, action, actor, extra = {}) {
  return ReviewAudit.create({
    review: review._id, action, actor: { type: actor.type, id: actor.id ?? null }, ...extra,
    snapshot: { rating: review.rating, title: review.title, body: review.body },
  }).catch(() => undefined);
}
