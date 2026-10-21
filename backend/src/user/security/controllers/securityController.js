import { User } from "../../../auth/user/models/User.js";

export const securityController = {
  // Which sign-in methods the account has.
  status: async (req, res, next) => {
    try {
      const user = await User.findById(req.auth.sub).select("+password");
      if (!user) return res.status(404).json({ message: "Account not found." });
      res.json({ data: { hasPassword: Boolean(user.password), googleLinked: Boolean(user.googleId), appleLinked: Boolean(user.appleId) } });
    } catch (error) { next(error); }
  },

  // Change the password, or set one for an account created with Google/Apple.
  changePassword: async (req, res, next) => {
    try {
      const user = await User.findById(req.auth.sub).select("+password");
      if (!user) return res.status(404).json({ message: "Account not found." });
      const hadPassword = Boolean(user.password);
      if (hadPassword) {
        if (!req.body.currentPassword || !(await user.comparePassword(req.body.currentPassword))) {
          return res.status(401).json({ message: "Your current password is incorrect.", errors: { currentPassword: "is incorrect" } });
        }
        if (await user.comparePassword(req.body.newPassword)) {
          return res.status(400).json({ message: "Choose a password you have not used for this account.", errors: { newPassword: "must be different" } });
        }
      }
      user.password = req.body.newPassword; // hashed by the model's pre-save hook
      await user.save();
      res.json({ message: hadPassword ? "Password updated." : "Password set." });
    } catch (error) { next(error); }
  },
};
