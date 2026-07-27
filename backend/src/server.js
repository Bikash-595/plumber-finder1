import "dotenv/config";
import { app } from "./app.js";
import { validateAuthConfiguration } from "./config/auth.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number(process.env.PORT || 3300);

async function start() {
  validateAuthConfiguration();
  await connectDatabase();
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
