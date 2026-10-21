// In-app notifications for customers. Created by the server (bookings, checkout); customers can
// read, mark as read, and delete them, but never create them.
export const notificationsConfig = {
  label: "Notification",
  types: ["booking", "order", "offer", "system"],
  listLimit: 100,
};
