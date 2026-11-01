import { GoogleOAuthToken } from "../models/index.js";
import { accessTokenFor } from "./oauth.js";
import { googleHttp } from "./places.js";

// Reviews through the Google Business Profile APIs, for companies that connected with OAuth. This returns the
// full review list (not just 5) and the owner's replies. Location lookup: Account Management + Business
// Information APIs; reviews: My Business API v4 (accounts.locations.reviews.list).

const STARS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

async function get(url, token) {
  const response = await googleHttp.fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `Google returned ${response.status}.`);
  return payload;
}

/** Finds the company's Business Profile location for its Place ID (remembered after the first time). */
async function findLocation(token, record, placeId) {
  if (record.accountName && record.locationName) return { accountName: record.accountName, locationName: record.locationName };
  const { accounts = [] } = await get("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", token);
  for (const account of accounts) {
    const { locations = [] } = await get(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,metadata&pageSize=100`, token);
    const match = locations.find((location) => location.metadata?.placeId === placeId);
    if (match) {
      await GoogleOAuthToken.updateOne({ _id: record._id }, { $set: { accountName: account.name, locationName: match.name } });
      return { accountName: account.name, locationName: match.name };
    }
  }
  throw new Error("This Google account doesn't manage the Google business connected to your PlumberFinder listing.");
}

/** Rating, count and latest reviews (with owner replies), or null when the company hasn't connected OAuth. */
export async function fetchBusinessProfileReviews(companyId, placeId) {
  const access = await accessTokenFor(companyId);
  if (!access) return null;
  const { accountName, locationName } = await findLocation(access.token, access.record, placeId);
  const result = await get(`https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/reviews?pageSize=50&orderBy=updateTime%20desc`, access.token);
  return {
    origin: "business_profile",
    rating: typeof result.averageRating === "number" ? Math.round(result.averageRating * 10) / 10 : null,
    userRatingCount: result.totalReviewCount ?? 0,
    reviews: (result.reviews ?? []).map((review) => ({
      rating: STARS[review.starRating] ?? 0,
      text: review.comment ?? "",
      publishTime: review.createTime,
      author: { name: review.reviewer?.isAnonymous ? "Google user" : review.reviewer?.displayName ?? "Google user", photoUri: review.reviewer?.profilePhotoUrl },
      ownerReply: review.reviewReply?.comment ? { text: review.reviewReply.comment, updateTime: review.reviewReply.updateTime } : null,
    })),
  };
}
