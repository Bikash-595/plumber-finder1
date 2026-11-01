import { createProviderReviewsController } from "../../../reviews/services/providerInbox.js";

// The freelancer's PlumberFinder review inbox (directory + verified reviews): list, reply, report.
export const freelancerReviewsController = createProviderReviewsController("freelancer");
