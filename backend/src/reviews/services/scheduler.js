import { autoConfirmCompletions } from "../../shared/bookings/bookingWorkflow.js";
import { oauthConfigured } from "../google/oauth.js";
import { googleConfigured } from "../google/places.js";
import { refreshStaleGoogleLinks } from "../google/sync.js";
import { processDueReviewRequests } from "./requests.js";
import { isDatabaseReady } from "../../config/databaseAvailability.js";

// Background work for the review system, run by the API server (server.js) every minute:
//  1. confirm jobs the customer never answered (after 7 days) — which schedules their review requests;
//  2. send review requests and reminders that are due;
//  3. refresh Google reviews older than a day for connected companies.
// Every step is safe to run on several servers at once (rows are claimed atomically).

export async function runReviewJobs(now = new Date()) {
  const confirmed = await autoConfirmCompletions(now);
  const sent = await processDueReviewRequests({ now });
  const google = googleConfigured() || oauthConfigured() ? await refreshStaleGoogleLinks({ now }) : 0;
  return { confirmed, sent, google };
}

export function startReviewScheduler({ everyMs = 60_000 } = {}) {
  let running = false;
  const tick = async () => {
    if (running || !isDatabaseReady()) return; // never overlap runs; skip while the database is down
    running = true;
    try { await runReviewJobs(); } catch (error) { console.error("Review jobs failed:", error.message); } finally { running = false; }
  };
  const timer = setInterval(tick, everyMs);
  timer.unref();
  setTimeout(tick, 5_000).unref();
  return () => clearInterval(timer);
}
