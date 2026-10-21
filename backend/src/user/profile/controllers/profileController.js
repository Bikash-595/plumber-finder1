import { User } from "../../../auth/user/models/User.js";
import { publicAccount } from "../../../auth/shared/services/authResponse.js";

export const profileController = {
  get: async (req, res, next) => {
    try {
      const user = await User.findById(req.auth.sub);
      if (!user) return res.status(404).json({ message: "Account not found." });
      res.json({ data: publicAccount(user) });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.auth.sub, { $set: req.validated }, { new: true, runValidators: true });
      if (!user) return res.status(404).json({ message: "Account not found." });
      res.json({ message: "Profile saved.", data: publicAccount(user) });
    } catch (error) { next(error); }
  },
};
