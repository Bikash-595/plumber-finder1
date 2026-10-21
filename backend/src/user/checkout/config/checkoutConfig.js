// Details collected when a customer checks out their cart.
export const checkoutConfig = {
  label: "checkout",
  fields: {
    address: { type: "string", required: true, max: 300 },
    phone: { type: "string", max: 40 },
    scheduledDate: { type: "date" },
    timeSlot: { type: "string", max: 60 },
    details: { type: "text", max: 2000 },
  },
};
