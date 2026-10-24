import { Router } from "express";
import { forgotPassword, resendCode, resetPassword, verifyEmail } from "../controllers/verificationController.js";

// Mounted at /api/auth. accountType is "user", "company", or "freelancer".
//   POST /verify-email      { email, accountType, code }            -> token (account confirmed)
//   POST /resend-code       { email, accountType }                  -> new confirmation code
//   POST /password/forgot   { email, accountType }                  -> reset code by email
//   POST /password/reset    { email, accountType, code, password }  -> token (password changed)
export const verificationRouter = Router();
verificationRouter.post("/verify-email", verifyEmail);
verificationRouter.post("/resend-code", resendCode);
verificationRouter.post("/password/forgot", forgotPassword);
verificationRouter.post("/password/reset", resetPassword);
