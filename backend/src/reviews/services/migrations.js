import { CustomerReview } from "../models/index.js";

/**
 * Brings reviews written before review sources existed up to date (a no-op afterwards):
 * reviews tied to a completed booking become verified_booking, the rest directory. Then rebuilds the
 * collection's indexes — the old "one review per customer per plumber" index is replaced by one that
 * applies to directory reviews only, so a customer can also write a verified review for each completed booking.
 */
export async function migrateReviews() {
  const [verified, directory] = await Promise.all([
    CustomerReview.updateMany({ source: { $exists: false }, verified: true, booking: { $type: "objectId" } }, { $set: { source: "verified_booking" } }),
    CustomerReview.updateMany({ source: { $exists: false } }, { $set: { source: "directory", booking: null } }),
  ]);
  await CustomerReview.syncIndexes();
  return verified.modifiedCount + directory.modifiedCount;
}
