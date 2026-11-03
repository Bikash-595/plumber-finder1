import { Router } from "express";
import { getCustomer, listCustomers } from "../../../company/customers/controllers/customersController.js";
import { requireCustomersAccess } from "../middleware/customersAuth.js";

// Mounted at /api/freelancers/customers.
export const freelancerCustomersRouter = Router();
freelancerCustomersRouter.use(requireCustomersAccess);
freelancerCustomersRouter.get("/", listCustomers);
freelancerCustomersRouter.get("/:id", getCustomer);
