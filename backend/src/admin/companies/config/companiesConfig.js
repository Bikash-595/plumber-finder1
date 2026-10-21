// Company accounts and their approval status. Suspending a company hides its public listing.
export const companiesConfig = {
  statuses: ["pending", "approved", "suspended"],
  searchFields: ["companyName", "email", "phone"],
  fields: "companyName email phone status createdAt",
  statusFields: { status: { type: "enum", values: ["pending", "approved", "suspended"], required: true } },
};
