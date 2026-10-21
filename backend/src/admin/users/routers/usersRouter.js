import { Router } from "express";
import { listUsers } from "../controllers/usersController.js";
import { requireUsersAccess } from "../middleware/usersAuth.js";

// Mounted at /api/admin/users.
export const usersRouter = Router();
usersRouter.get("/", requireUsersAccess, listUsers);
