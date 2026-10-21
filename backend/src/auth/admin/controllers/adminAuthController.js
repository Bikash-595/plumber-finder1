import { createAccountController } from "../../shared/controllers/createAccountController.js";
import { sendAuthResponse } from "../../shared/services/authResponse.js";
import { adminAuthConfig } from "../config/adminAuthConfig.js";
import { clearAdminLoginFailures, recordAdminLoginFailure } from "../middleware/adminLoginRateLimit.js";
import { Admin } from "../models/Admin.js";

export const adminAccount = { Model: Admin, ...adminAuthConfig };
const INVALID = "Email or password is incorrect.";

export const adminAuthController = {
  login: async (req, res, next) => {
    try {
      const admin = await Admin.findOne({ email: req.body.email }).select("+password");
      if (!admin || !admin.isActive || !(await admin.comparePassword(req.body.password))) {
        recordAdminLoginFailure(req);
        return res.status(401).json({ message: INVALID });
      }
      clearAdminLoginFailures(req);
      admin.lastLoginAt = new Date();
      await admin.save();
      sendAuthResponse(res, admin);
    } catch (error) { next(error); }
  },
  ...createAccountController(adminAccount),
};
