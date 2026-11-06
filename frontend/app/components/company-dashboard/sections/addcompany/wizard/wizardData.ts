import type { HoursRow } from "@/components/company-dashboard/business-profile/WeeklyHoursEditor";
import { steps } from "./wizardSteps";

export const initialFormData = steps.flatMap((step) => step.fields).reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {} as Record<string, string>);

export const initialService = { name: "", category: "", description: "", pricing: "", duration: "", warranty: "", areas: "" };
export const initialLocation = { label: "", address: "", city: "", state: "", country: "", zipCode: "", latitude: "", longitude: "", radius: "" };
export const initialGalleryImage = { url: "", caption: "" };
export const initialGalleryVideo = { url: "", title: "" };
export type Service = typeof initialService;
export type Location = typeof initialLocation;
export type GalleryImage = typeof initialGalleryImage;
export type GalleryVideo = typeof initialGalleryVideo;
export type ListName = "services" | "locations" | "galleryImages" | "galleryVideos" | "weeklyHours";
export type OnboardingData = {
  formData: Record<string, string>;
  services: Service[];
  locations: Location[];
  galleryImages: GalleryImage[];
  galleryVideos: GalleryVideo[];
  weeklyHours: HoursRow[];
  completedSteps: string[];
  submittedAt: string | null;
  listing: { _id: string; companyName: string; isPublished: boolean } | null;
};

// The repeatable lists each step owns (saved together with that step's fields).
export const stepLists: Record<string, ListName[]> = { gallery: ["galleryImages", "galleryVideos"], location: ["locations"], operations: ["weeklyHours"], services: ["services"] };
export const loginMessage = "Please log in with your company account to add or edit your listing.";
// Saved lists come back without empty rows; keep one blank row so the form always has inputs.
export const withBlankRow = <T,>(items: T[] | undefined, blank: T) => (items?.length ? items.map((item) => ({ ...blank, ...item })) : [{ ...blank }]);
