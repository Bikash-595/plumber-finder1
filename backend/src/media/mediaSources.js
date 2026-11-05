import { CompanyBlog } from "../company/blogs/models/CompanyBlog.js";
import { CompanyGalleryItem } from "../company/gallery/models/CompanyGalleryItem.js";
import { CompanyHeaderProfile } from "../company/header-profile/models/CompanyHeaderProfile.js";
import { CompanyListing } from "../company/listing/models/CompanyListing.js";
import { CompanyProject } from "../company/previous-projects/models/CompanyProject.js";
import { CompanyServiceOffering } from "../company/services/models/CompanyServiceOffering.js";
import { CompanyTeamMember } from "../company/team/models/CompanyTeamMember.js";
import { FreelancerBlog } from "../freelancer/blogs/models/FreelancerBlog.js";
import { FreelancerGalleryItem } from "../freelancer/gallery/models/FreelancerGalleryItem.js";
import { FreelancerHeaderProfile } from "../freelancer/header-profile/models/FreelancerHeaderProfile.js";
import { FreelancerListing } from "../freelancer/listing/models/FreelancerListing.js";
import { FreelancerProject } from "../freelancer/previous-projects/models/FreelancerProject.js";
import { FreelancerServiceOffering } from "../freelancer/services/models/FreelancerServiceOffering.js";

// Image fields that public pages show. Uploads are stored as data URLs; public responses replace them with
// /media/... links (see mediaUrls.js) so browsers download and cache each picture once instead of receiving it
// inside every JSON response. Only fields listed here can be served — private uploads (documents) never are.
export const mediaSources = {
  "company-listing": { Model: CompanyListing, fields: ["logo", "coverImage"] },
  "company-header": { Model: CompanyHeaderProfile, fields: ["logo", "coverImage", "coverImages"] },
  "company-gallery": { Model: CompanyGalleryItem, fields: ["media"] },
  "company-team": { Model: CompanyTeamMember, fields: ["photo"] },
  "company-service": { Model: CompanyServiceOffering, fields: ["image", "images"] },
  "company-project": { Model: CompanyProject, fields: ["beforeImage", "afterImage"] },
  "company-blog": { Model: CompanyBlog, fields: ["coverImage"] },
  "freelancer-listing": { Model: FreelancerListing, fields: ["photo", "coverImage", "coverImages"] },
  "freelancer-header": { Model: FreelancerHeaderProfile, fields: ["photo", "coverImage", "coverImages"] },
  "freelancer-gallery": { Model: FreelancerGalleryItem, fields: ["media"] },
  "freelancer-service": { Model: FreelancerServiceOffering, fields: ["image", "images"] },
  "freelancer-project": { Model: FreelancerProject, fields: ["beforeImage", "afterImage"] },
  "freelancer-blog": { Model: FreelancerBlog, fields: ["coverImage"] },
};
