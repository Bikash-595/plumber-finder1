// Where the company works. `areasCovered` is a comma-separated list typed by the company.
export const serviceAreasConfig = {
  label: "Service areas",
  fields: {
    areasCovered: { type: "text", max: 5000 },
    radius: { type: "number", min: 0, max: 500 },
    branchLocation: { type: "string", max: 200 },
  },
};
