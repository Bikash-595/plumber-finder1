import { Router } from "express";
import { teamController } from "../controllers/teamController.js";
import { requireCompanyTeamAccess } from "../middleware/teamAuth.js";
import { validateTeamCreate, validateTeamUpdate } from "../middleware/validateTeam.js";

export const teamRouter = Router();

// Public: team members shown on a published company profile (by public listing id).
teamRouter.get("/public/:listingId", teamController.listPublic);

// Signed-in company: manage its own team members.
teamRouter.get("/", requireCompanyTeamAccess, teamController.list);
teamRouter.post("/", requireCompanyTeamAccess, validateTeamCreate, teamController.create);
teamRouter.get("/:id", requireCompanyTeamAccess, teamController.getOne);
teamRouter.put("/:id", requireCompanyTeamAccess, validateTeamUpdate, teamController.update);
teamRouter.patch("/:id", requireCompanyTeamAccess, validateTeamUpdate, teamController.update);
teamRouter.delete("/:id", requireCompanyTeamAccess, teamController.remove);
