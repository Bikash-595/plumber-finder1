import ServicePageLayout from "./ServicePageLayout";
import { serviceBySlug } from "./serviceData";

export const EmergencyPlumbingService = () => <ServicePageLayout service={serviceBySlug["emergency-plumbing"]} />;
export const DrainCleaningService = () => <ServicePageLayout service={serviceBySlug["drain-cleaning"]} />;
export const WaterHeaterRepairService = () => <ServicePageLayout service={serviceBySlug["water-heater-repair"]} />;
export const LeakDetectionService = () => <ServicePageLayout service={serviceBySlug["leak-detection"]} />;
export const PipeRepairService = () => <ServicePageLayout service={serviceBySlug["pipe-repair"]} />;
export const BathroomPlumbingService = () => <ServicePageLayout service={serviceBySlug["bathroom-plumbing"]} />;
export const SewerLineService = () => <ServicePageLayout service={serviceBySlug["sewer-line-service"]} />;
export const CommercialPlumbingService = () => <ServicePageLayout service={serviceBySlug["commercial-plumbing"]} />;

export const servicePageComponents = {
  "emergency-plumbing": EmergencyPlumbingService,
  "drain-cleaning": DrainCleaningService,
  "water-heater-repair": WaterHeaterRepairService,
  "leak-detection": LeakDetectionService,
  "pipe-repair": PipeRepairService,
  "bathroom-plumbing": BathroomPlumbingService,
  "sewer-line-service": SewerLineService,
  "commercial-plumbing": CommercialPlumbingService,
};
