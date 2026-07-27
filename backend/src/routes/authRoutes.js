import { Router } from "express";
import { loginWithEmail } from "../controllers/loginController.js";

export const authRouter = Router();
authRouter.post("/login", loginWithEmail);
