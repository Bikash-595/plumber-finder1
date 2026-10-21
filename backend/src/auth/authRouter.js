import { Router } from "express";
import { adminAuthRouter } from "./admin/routers/adminAuthRouter.js";
import { companyAuthRouter } from "./company/routers/companyAuthRouter.js";
import { unifiedLoginRouter } from "./email/routers/unifiedLoginRouter.js";
import { freelancerAuthRouter } from "./freelancer/routers/freelancerAuthRouter.js";
import { userAuthRouter } from "./user/routers/userAuthRouter.js";

// Mounted at /api/auth.
//   POST /login                                   email login for any account type
//   /users | /companies | /freelancers            POST /signup, /login, /google, /apple · GET /me
//   /admins                                       POST /login · GET /me (admin app only; no signup)
export const authRouter = Router();
authRouter.use(unifiedLoginRouter);
authRouter.use("/users", userAuthRouter);
authRouter.use("/companies", companyAuthRouter);
authRouter.use("/freelancers", freelancerAuthRouter);
authRouter.use("/admins", adminAuthRouter);
