import { providerFields } from "../../shared/providerFields.js";

// Plumbers a customer is comparing side by side (up to 3).
export const compareConfig = {
  label: "Compare item",
  labelPlural: "plumbers to compare",
  maxItems: 3,
  fields: providerFields,
};
