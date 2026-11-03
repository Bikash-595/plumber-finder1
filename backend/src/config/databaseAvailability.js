import mongoose from "mongoose";

// Requests that arrive while the database isn't connected (the server is starting, restarting or shutting
// down, or MongoDB is unreachable) get a short "try again" answer instead of a crash, and the log gets one
// line every few seconds instead of a stack trace per request.

const UNAVAILABLE = new Set(["MongoExpiredSessionError", "MongoNotConnectedError", "MongoTopologyClosedError", "MongoNetworkError", "MongoNetworkTimeoutError", "MongoServerSelectionError", "MongooseServerSelectionError"]);
const RETRY_SECONDS = 5;
let lastLogged = 0;

export const isDatabaseReady = () => mongoose.connection.readyState === 1;

/** Whether an error means "the database isn't available right now" (not a bug in the request). */
export const isDatabaseUnavailable = (error) => UNAVAILABLE.has(error?.name) || UNAVAILABLE.has(error?.cause?.name);

/** Answers 503 with Retry-After, logging at most once every 10 seconds. */
export function sendDatabaseUnavailable(res, error) {
  const now = Date.now();
  if (now - lastLogged > 10_000) {
    lastLogged = now;
    console.warn(`Database unavailable (${error?.name ?? "not connected"}); answering 503 until it's back.`);
  }
  res.set("Retry-After", String(RETRY_SECONDS));
  return res.status(503).json({ message: "The service is briefly unavailable. Please try again in a moment." });
}

/** Middleware for /api: don't start work that needs the database while it isn't connected. */
export function requireDatabase(_req, res, next) {
  if (isDatabaseReady()) return next();
  return sendDatabaseUnavailable(res);
}
