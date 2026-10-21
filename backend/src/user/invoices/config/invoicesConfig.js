// Invoices are created by checkout and are read-only for customers.
export const invoicesConfig = {
  statuses: ["pending", "paid", "cancelled", "refunded"],
  paymentDueDays: 7,
};
