// Freelancer accounts and their verification status.
export const freelancersConfig = {
  statuses: ["pending", "verified", "rejected"],
  searchFields: ["name", "email", "phone"],
  fields: "name email phone verificationStatus createdAt",
  statusFields: { verificationStatus: { type: "enum", values: ["pending", "verified", "rejected"], required: true } },
};
