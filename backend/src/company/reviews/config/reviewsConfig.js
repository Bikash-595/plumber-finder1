// A company's reviews: Google (connected Business Profile) + PlumberFinder directory + verified customer reviews.
export const companyReviewsConfig = {
  providerType: "company",
  google: {
    label: "Google Business Profile",
    fields: {
      profileUrl: { type: "string", max: 500 },
      placeId: { type: "string", max: 300 },
    },
  },
};
