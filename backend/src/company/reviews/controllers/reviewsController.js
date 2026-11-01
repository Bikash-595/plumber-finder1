import { createProviderReviewsController } from "../../../reviews/services/providerInbox.js";

// The company's PlumberFinder review inbox (directory + verified reviews): list, reply, report.
export const companyReviewsController = createProviderReviewsController("company");
