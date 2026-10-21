import { createCollectionController } from "../../shared/createCollectionController.js";
import { reviewsConfig } from "../config/reviewsConfig.js";
import { CompanyReview } from "../models/CompanyReview.js";

export const reviewsController = createCollectionController({ Model: CompanyReview, config: reviewsConfig });
