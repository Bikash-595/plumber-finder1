import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { authorizationUrl, completeAuthorization, consumeState, disconnect, oauthConfigured, oauthStatus } from "../../../reviews/google/oauth.js";
import { fetchPlace, googleConfigured, isGoogleUrl, isPlaceId, placeIdFromUrl, searchPlaces } from "../../../reviews/google/places.js";
import { googleSummary } from "../../../reviews/google/sync.js";
import { GoogleBusinessLink } from "../../../reviews/models/index.js";
import { siteUrl } from "../../../reviews/services/events.js";

// A company's Google Business Profile. Matching suggests businesses from the company's own listing details,
// but nothing is connected until the owner confirms which one is theirs (similar names are common).

const linkOf = (req) => GoogleBusinessLink.findOne({ providerType: "company", providerAccount: req.auth.sub });
const digits = (value) => String(value ?? "").replace(/\D/g, "").slice(-10);
const host = (value) => { try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return ""; } };

async function status(req, link) {
  return { ...(await googleSummary(link)), apiConfigured: googleConfigured(), oauth: await oauthStatus(req.auth.sub) };
}

/** Saves the owner's confirmed Place ID (checked with Google when the API is configured) and syncs. */
async function connect(req, res, { placeId, profileUrl }) {
  let place = null;
  if (googleConfigured()) {
    try { place = await fetchPlace(placeId); } catch (error) { return res.status(400).json({ message: `Google couldn't find that business (${error.message}).`, errors: { placeId: "was not found on Google" } }); }
  }
  const link = await GoogleBusinessLink.findOneAndUpdate(
    { providerType: "company", providerAccount: req.auth.sub },
    { $set: { placeId, profileUrl: profileUrl || undefined, connectionStatus: "connected", verifiedAt: new Date(), ...(place ? { businessName: place.displayName, address: place.address } : {}) }, $unset: { cache: 1, lastError: 1 } },
    { upsert: true, new: true },
  );
  await googleSummary(link, { refresh: true });
  return res.json({ message: `Connected ${place?.displayName ?? "your Google business"}. Its Google reviews now show on your profile.`, data: await status(req, link) });
}

export const googleController = {
  // GET /google — connection, sync status, rating and reviews.
  status: async (req, res, next) => {
    try { res.json({ data: await status(req, await linkOf(req)) }); } catch (error) { next(error); }
  },

  // GET /google/matches — businesses on Google that look like this company (from its listing), best first.
  matches: async (req, res, next) => {
    try {
      if (!googleConfigured()) return res.status(503).json({ message: "Matching needs the site's Google Places API key. You can paste your Google link or Place ID instead." });
      const listing = await CompanyListing.findOne({ company: req.auth.sub }).select("companyName location city state phone website").lean();
      if (!listing) return res.status(404).json({ message: "Publish your company listing first." });
      const query = [listing.companyName, listing.location || [listing.city, listing.state].filter(Boolean).join(" ")].filter(Boolean).join(" ");
      const candidates = await searchPlaces(query);
      const scored = candidates.map((candidate) => {
        const signals = [
          digits(listing.phone) && digits(candidate.phone) === digits(listing.phone) && "phone",
          host(listing.website) && host(candidate.website) === host(listing.website) && "website",
          listing.city && candidate.address?.toLowerCase().includes(listing.city.toLowerCase()) && "city",
        ].filter(Boolean);
        return { ...candidate, matchedOn: signals };
      }).sort((a, b) => b.matchedOn.length - a.matchedOn.length);
      res.json({ data: scored, query });
    } catch (error) { res.status(502).json({ message: `Google search failed: ${error.message}` }); void next; }
  },

  // POST /google/search { query } — the owner searches by hand.
  search: async (req, res) => {
    if (!googleConfigured()) return res.status(503).json({ message: "Searching Google needs the site's Google Places API key. You can paste your Place ID instead." });
    const query = typeof req.body?.query === "string" ? req.body.query.trim().slice(0, 200) : "";
    if (query.length < 3) return res.status(400).json({ message: "Type your business name and city." });
    try { res.json({ data: await searchPlaces(query) }); } catch (error) { res.status(502).json({ message: `Google search failed: ${error.message}` }); }
  },

  // POST /google/connect { placeId } — "This is my business".
  connect: async (req, res, next) => {
    try {
      const placeId = typeof req.body?.placeId === "string" ? req.body.placeId.trim() : "";
      if (!isPlaceId(placeId)) return res.status(400).json({ message: "Choose your business, or paste a Google Place ID (e.g. ChIJN1t_tDeuEmsRUsoyG83frY4).", errors: { placeId: "is not a Place ID" } });
      return connect(req, res, { placeId });
    } catch (error) { next(error); }
  },

  // PUT /google { profileUrl?, placeId? } — save a Google link (and Place ID). Both empty disconnects.
  save: async (req, res, next) => {
    try {
      const profileUrl = req.validated.profileUrl ?? "";
      let placeId = req.validated.placeId ?? "";
      if (profileUrl && !isGoogleUrl(profileUrl)) return res.status(400).json({ message: "Use your Google Business Profile or Google Maps link (https://…google.com/… or https://maps.app.goo.gl/…).", errors: { profileUrl: "must be a Google link" } });
      if (!placeId && profileUrl) placeId = placeIdFromUrl(profileUrl) ?? "";
      if (placeId && !isPlaceId(placeId)) return res.status(400).json({ message: "That doesn't look like a Google Place ID (e.g. ChIJN1t_tDeuEmsRUsoyG83frY4).", errors: { placeId: "is not a Place ID" } });
      if (!profileUrl && !placeId) {
        await Promise.all([GoogleBusinessLink.deleteOne({ providerType: "company", providerAccount: req.auth.sub }), disconnect(req.auth.sub)]);
        return res.json({ message: "Google Business Profile removed.", data: await status(req, null) });
      }
      if (placeId) return connect(req, res, { placeId, profileUrl });
      const link = await GoogleBusinessLink.findOneAndUpdate({ providerType: "company", providerAccount: req.auth.sub }, { $set: { profileUrl, connectionStatus: "link_only" }, $unset: { placeId: 1, cache: 1, lastError: 1, verifiedAt: 1 } }, { upsert: true, new: true });
      res.json({ message: "Google link saved. Choose your business on Google to also show your Google rating and reviews.", data: await status(req, link) });
    } catch (error) { next(error); }
  },

  // POST /google/refresh — fetch from Google now.
  refresh: async (req, res, next) => {
    try {
      const link = await linkOf(req);
      if (!link?.placeId) return res.status(409).json({ message: "Connect your Google business first." });
      await googleSummary(link, { refresh: true });
      res.json({ message: link.lastError?.message ? `Google didn't answer: ${link.lastError.message}` : "Fetched the latest from Google.", data: await status(req, link) });
    } catch (error) { next(error); }
  },

  // DELETE /google — forget the Google business (and any OAuth grant).
  remove: async (req, res, next) => {
    try {
      await Promise.all([GoogleBusinessLink.deleteOne({ providerType: "company", providerAccount: req.auth.sub }), disconnect(req.auth.sub)]);
      res.json({ message: "Google Business Profile disconnected.", data: await status(req, null) });
    } catch (error) { next(error); }
  },

  // POST /google/oauth — returns Google's consent URL (Business Profile access for full reviews and owner replies).
  oauthStart: async (req, res, next) => {
    try {
      if (!oauthConfigured()) return res.status(503).json({ message: "Google Business Profile sign-in isn't set up on this site yet (GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI are needed)." });
      res.json({ data: { url: await authorizationUrl(req.auth.sub) } });
    } catch (error) { next(error); }
  },

  // GET /google/oauth/callback?code&state — Google sends the owner's browser here; we redirect back to the dashboard.
  oauthCallback: async (req, res) => {
    const back = (result, message) => res.redirect(`${siteUrl()}/company-dashboard/business-profile/reviews?google=${result}${message ? `&message=${encodeURIComponent(message)}` : ""}`);
    try {
      const company = await consumeState(req.query.state);
      if (!company) return back("error", "That Google sign-in link expired. Please try again.");
      if (req.query.error || typeof req.query.code !== "string") return back("error", "Google access wasn't granted.");
      await completeAuthorization(company, req.query.code);
      const link = await GoogleBusinessLink.findOne({ providerType: "company", providerAccount: company });
      if (link?.placeId) await googleSummary(link, { refresh: true });
      return back("connected");
    } catch (error) {
      return back("error", error.message);
    }
  },

  // DELETE /google/oauth — stop using Business Profile access (the Place ID connection stays).
  oauthDisconnect: async (req, res, next) => {
    try {
      await disconnect(req.auth.sub);
      res.json({ message: "Google Business Profile access removed.", data: await status(req, await linkOf(req)) });
    } catch (error) { next(error); }
  },
};
