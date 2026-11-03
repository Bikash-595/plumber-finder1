import { CompanyListing } from "../../listing/models/CompanyListing.js";
import { locationConfig } from "../config/locationConfig.js";
import { CompanyLocations } from "../models/CompanyLocations.js";

const { stored } = locationConfig;
// The record also keeps the wizard's branch list, so this section only reads and writes its own fields.
const view = (doc) => {
  if (!doc || stored.every((field) => doc[field] === undefined || doc[field] === null || doc[field] === "")) return null;
  return { headquarters: doc.headquarters ?? "", latitude: doc.latitude ?? "", longitude: doc.longitude ?? "", serviceRadius: doc.serviceRadius ?? "", mapUrl: doc.mapUrl ?? "" };
};
// Coordinates and radius are stored as text in the shared record.
const asText = (value) => (value === null || value === undefined ? null : String(value));

export const locationController = {
  getMine: async (req, res, next) => {
    try {
      res.json({ data: view(await CompanyLocations.findOne({ company: req.auth.sub }).select(stored.join(" ")).lean()) });
    } catch (error) { next(error); }
  },

  saveMine: async (req, res, next) => {
    try {
      const company = req.auth.sub;
      const values = Object.fromEntries(Object.entries(req.validated).map(([field, value]) => [field, field === "headquarters" || field === "mapUrl" ? value : asText(value)]));
      if ((values.latitude == null) !== (values.longitude == null) && ("latitude" in values || "longitude" in values)) {
        return res.status(400).json({ message: "Enter both latitude and longitude, or neither.", errors: { latitude: "needs a longitude too" } });
      }
      const doc = await CompanyLocations.findOneAndUpdate({ company }, { $set: values, $setOnInsert: { company } }, { new: true, upsert: true, lean: true });
      // The address is the location shown on cards and in search.
      if (values.headquarters) await CompanyListing.updateOne({ company }, { $set: { location: values.headquarters } });
      res.json({ message: "Map location saved.", data: view(doc) });
    } catch (error) { next(error); }
  },

  deleteMine: async (req, res, next) => {
    try {
      await CompanyLocations.updateOne({ company: req.auth.sub }, { $unset: Object.fromEntries(stored.map((field) => [field, ""])) });
      res.json({ message: "Map location deleted.", data: null });
    } catch (error) { next(error); }
  },
};
