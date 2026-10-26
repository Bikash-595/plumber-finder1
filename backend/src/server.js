import "dotenv/config";
import { app } from "./app.js";
import { validateAuthConfiguration } from "./auth/shared/config/jwtConfig.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { backfillBookings } from "./shared/bookings/backfillBookings.js";

const port = Number(process.env.PORT || 3300);

async function start() {
  validateAuthConfiguration();
  await connectDatabase();
  // Older bookings get a reference and their plumber's account (once; a no-op afterwards).
  backfillBookings().then((count) => count && console.log(`Updated ${count} older booking(s) with references.`)).catch((error) => console.error("Booking backfill failed:", error.message));
  const server = app.listen(port, () => {
    console.log(`Plumber Finder API listening on http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Unable to start the API:", error.message);
  process.exit(1);
});
