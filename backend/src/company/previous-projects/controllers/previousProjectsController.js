import { createCollectionController } from "../../shared/createCollectionController.js";
import { previousProjectsConfig } from "../config/previousProjectsConfig.js";
import { CompanyProject } from "../models/CompanyProject.js";

export const previousProjectsController = createCollectionController({
  Model: CompanyProject,
  config: previousProjectsConfig,
  publicFilter: () => ({ visible: true }),
});
