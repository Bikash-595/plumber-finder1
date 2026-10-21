import { createSingletonController } from "../../shared/createSingletonController.js";
import { settingsConfig } from "../config/settingsConfig.js";
import { UserSettings } from "../models/UserSettings.js";

const base = createSingletonController({ Model: UserSettings, config: settingsConfig });

// Customers who never saved settings get the defaults instead of null.
const defaults = Object.fromEntries(Object.entries(settingsConfig.fields).map(([name, spec]) => [name, spec.default]));

export const settingsController = {
  get: async (req, res, next) => {
    try {
      const settings = await UserSettings.findOne({ user: req.auth.sub });
      res.json({ data: settings ?? defaults });
    } catch (error) { next(error); }
  },
  save: base.saveMine,
};
