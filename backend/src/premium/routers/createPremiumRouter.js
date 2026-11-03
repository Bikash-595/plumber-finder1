import { Router } from "express";
import { premiumController as premium } from "../controllers/premiumController.js";
import { limitPremiumActions, validatePlanChoice } from "../middleware/validatePremium.js";

/** The premium page's routes for one account type, behind that type's sign-in check. */
export function createPremiumRouter(requireAccount) {
  const router = Router();
  router.use(requireAccount);
  router.get("/", premium.get);
  router.post("/checkout", limitPremiumActions, validatePlanChoice, premium.checkout);
  router.post("/request", limitPremiumActions, validatePlanChoice, premium.request);
  router.post("/cancel", limitPremiumActions, premium.cancel);
  router.post("/resume", limitPremiumActions, premium.resume);
  router.post("/portal", limitPremiumActions, premium.portal);
  return router;
}
