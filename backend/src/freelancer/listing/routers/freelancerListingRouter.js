import { Router } from "express";
import { getPublishedFreelancer, getPublishedFreelancers } from "../controllers/freelancerListingController.js";

// Mounted at /api/freelancers.
export const freelancerListingRouter = Router();
freelancerListingRouter.get("/public", getPublishedFreelancers);
freelancerListingRouter.get("/public/:id", getPublishedFreelancer);
