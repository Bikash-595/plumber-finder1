import { Router } from "express";
import { getCustomer, listCustomers } from "../controllers/customersController.js";
import { requireCustomersAccess } from "../middleware/customersAuth.js";

// Mounted at /api/companies/customers.
export const companyCustomersRouter = Router();
companyCustomersRouter.use(requireCustomersAccess);
companyCustomersRouter.get("/", listCustomers);
companyCustomersRouter.get("/:id", getCustomer);
