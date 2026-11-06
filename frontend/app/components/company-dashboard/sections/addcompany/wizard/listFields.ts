import type { RowField } from "./RepeatableList";
import type { GalleryImage, GalleryVideo, Location, Service } from "./wizardData";

// The inputs of each repeatable list in the wizard.
export const serviceFields: RowField<Service>[] = [
  { key: "name", label: "Service Name", placeholder: "Burst Pipe Repair" },
  { key: "category", label: "Category", placeholder: "Emergency Plumbing" },
  { key: "description", label: "Description", placeholder: "Fast repair for burst pipes with a satisfaction guarantee.", textarea: true, rows: 3, wide: true },
  { key: "pricing", label: "Price Range", placeholder: "$99 - $499" },
  { key: "duration", label: "Duration", placeholder: "1 - 3 hours" },
  { key: "warranty", label: "Warranty", placeholder: "1 year workmanship warranty" },
  { key: "areas", label: "Service Areas", placeholder: "Manhattan, Brooklyn, Queens", wide: true },
];

export const locationFields: RowField<Location>[] = [
  { key: "label", label: "Label", placeholder: "Headquarters" },
  { key: "address", label: "Address", placeholder: "123 Main St, New York, NY 10001" },
  { key: "city", label: "City", placeholder: "New York" },
  { key: "state", label: "State", placeholder: "NY" },
  { key: "country", label: "Country", placeholder: "United States" },
  { key: "zipCode", label: "ZIP Code", placeholder: "10001" },
  { key: "latitude", label: "Latitude", placeholder: "40.7128" },
  { key: "longitude", label: "Longitude", placeholder: "-74.0060" },
  { key: "radius", label: "Service Radius (miles)", placeholder: "50" },
];

export const galleryImageFields: RowField<GalleryImage>[] = [
  { key: "url", label: "Image URL", placeholder: "https://.../project-image.jpg" },
  { key: "caption", label: "Caption", placeholder: "Finished kitchen sink installation" },
];

export const galleryVideoFields: RowField<GalleryVideo>[] = [
  { key: "url", label: "Video URL", placeholder: "https://.../company-intro.mp4" },
  { key: "title", label: "Video Title", placeholder: "Emergency response overview" },
];
