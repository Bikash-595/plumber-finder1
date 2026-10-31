import { Router } from "express";
import { addressesController } from "../controllers/addressesController.js";
import { requireAddressesAccess } from "../middleware/addressesAuth.js";
import { validateAddressCreate, validateAddressUpdate } from "../middleware/validateAddresses.js";

// Mounted at /api/users/addresses.
export const addressesRouter = Router();
addressesRouter.use(requireAddressesAccess);
addressesRouter.get("/", addressesController.list);
addressesRouter.post("/", validateAddressCreate, addressesController.create);
addressesRouter.get("/:id", addressesController.getOne);
addressesRouter.patch("/:id", validateAddressUpdate, addressesController.update);
addressesRouter.delete("/:id", addressesController.remove);
