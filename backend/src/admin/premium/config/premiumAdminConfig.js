// Admin premium management: activate after an offline payment, extend, or end a plan.
export const premiumAdminConfig = {
  pageSize: 25,
  activate: {
    label: "activation",
    fields: {
      plan: { type: "enum", values: ["premium", "elite"] },
      months: { type: "number", integer: true, min: 1, max: 24, required: true },
      amount: { type: "number", min: 0, max: 1_000_000, required: true }, // dollars received
      note: { type: "text", max: 500 },
    },
  },
  cancel: { label: "cancellation", fields: { note: { type: "text", max: 500 } } },
};
