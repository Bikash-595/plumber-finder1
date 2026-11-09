import "dotenv/config";
import { app } from "./app.js";
import { validateAuthConfiguration } from "./auth/shared/config/jwtConfig.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { backfillBookings } from "./shared/bookings/backfillBookings.js";
import { migrateReviews } from "./reviews/services/migrations.js";
import { startReviewScheduler } from "./reviews/services/scheduler.js";
import { startPremiumScheduler } from "./premium/services/scheduler.js";

const port = Number(process.env.PORT || 3300);

const RETRY_MS = [2_000, 5_000, 10_000, 30_000];

/** Connects to MongoDB, retrying (2 s, 5 s, 10 s, then every 30 s) and logging why each attempt failed. */
async function connectWithRetry() {
  for (let attempt = 0; ; attempt++) {
    try {
      await connectDatabase();
      return;
    } catch (error) {
      if (/MONGODB_URI is required/.test(error.message)) throw error;
      const wait = RETRY_MS[Math.min(attempt, RETRY_MS.length - 1)];
      console.error(`MongoDB connection failed (${error.name}: ${error.message}). Retrying in ${wait / 1000} s. On a host such as Render, check MONGODB_URI and that MongoDB Atlas → Network Access allows the server (0.0.0.0/0).`);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
}

async function start() {
  validateAuthConfiguration();
  // The port opens first, so the host sees the service and /health reports the database state; API calls answer
  // 503 "try again" until MongoDB is connected (see config/databaseAvailability.js).
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Plumber Finder API listening on port ${port}`);
  });
  let stopReviewJobs = () => undefined;
  let stopPremiumJobs = () => undefined;
  const ready = connectWithRetry().then(() => {
    // Older bookings get a reference and their plumber's account (once; a no-op afterwards).
    backfillBookings().then((count) => count && console.log(`Updated ${count} older booking(s) with references.`)).catch((error) => console.error("Booking backfill failed:", error.message));
    // Reviews written before review sources existed get one (once), and their indexes are brought up to date.
    migrateReviews().then((count) => count && console.log(`Updated ${count} older review(s) with a review source.`)).catch((error) => console.error("Review migration failed:", error.message));
    // Review requests and reminders, auto-confirmed jobs, and daily Google review refreshes.
    stopReviewJobs = startReviewScheduler();
    // Premium plans whose paid period is over lose their badge and top position.
    stopPremiumJobs = startPremiumScheduler();
  });
  ready.catch((error) => {
    console.error("Unable to start the API:", error.message);
    process.exit(1);
  });

  // Graceful stop (Ctrl+C, nodemon restarts, a host's SIGTERM): background jobs stop first, no new connections,
  // requests already running finish, then the database closes. Nothing touches the database after it's closed.
  let stopping = false;
  const shutdown = (signal) => {
    if (stopping) return;
    stopping = true;
    stopReviewJobs();
    stopPremiumJobs();
    server.close(async () => {
      await disconnectDatabase().catch(() => undefined);
      process.exit(0);
    });
    server.closeIdleConnections();
    // Keep-alive connections that stay busy are cut after 5 s; never hang longer than 10 s.
    setTimeout(() => server.closeAllConnections(), 5_000).unref();
    setTimeout(() => process.exit(signal === "SIGUSR2" ? 0 : 1), 10_000).unref();
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  // nodemon restarts the server with SIGUSR2.
  process.once("SIGUSR2", () => shutdown("SIGUSR2"));
}

start().catch((error) => {
  console.error("Unable to start the API:", error.message);
  process.exit(1);
});
