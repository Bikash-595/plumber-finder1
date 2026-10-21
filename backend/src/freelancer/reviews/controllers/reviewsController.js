import { createCollectionController } from "../../shared/createCollectionController.js";
import { reviewsConfig } from "../config/reviewsConfig.js";
import { FreelancerReview } from "../models/FreelancerReview.js";

export const reviewsController = createCollectionController({ Model: FreelancerReview, config: reviewsConfig });
