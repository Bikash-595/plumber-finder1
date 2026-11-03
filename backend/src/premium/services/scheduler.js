import { syncListingBadge } from "./listingBadge.js";
import { expireDue } from "./subscriptions.js";
import { isDatabaseReady } from "../../config/databaseAvailability.js";

// Every 5 minutes: plans whose paid period is over lose premium (and their badge). Safe on several servers.
export function startPremiumScheduler({ everyMs = 5 * 60_000 } = {}) {
  let running = false;
  const tick = async () => {
    if (running || !isDatabaseReady()) return; // never overlap runs; skip while the database is down
    running = true;
    try { await expireDue(new Date(), syncListingBadge); } catch (error) { console.error("Premium expiry failed:", error.message); } finally { running = false; }
  };
  const timer = setInterval(tick, everyMs);
  timer.unref();
  setTimeout(tick, 10_000).unref();
  return () => clearInterval(timer);
}
