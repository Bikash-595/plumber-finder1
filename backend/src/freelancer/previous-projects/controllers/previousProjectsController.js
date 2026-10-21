import { createCollectionController } from "../../shared/createCollectionController.js";
import { previousProjectsConfig } from "../config/previousProjectsConfig.js";
import { FreelancerProject } from "../models/FreelancerProject.js";

export const previousProjectsController = createCollectionController({
  Model: FreelancerProject,
  config: previousProjectsConfig,
  publicFilter: () => ({ visible: true }),
});
