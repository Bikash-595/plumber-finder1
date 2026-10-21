import { UserNotification } from "../models/UserNotification.js";

/** Adds an in-app notification for a customer. `link` should be a site path such as /dashboard/bookings. */
export function notify(user, { type = "system", title, message, link }) {
  return UserNotification.create({ user, type, title, message, link });
}
