import type { ContactMethod, ContactTime, Ownership, PropertyType } from "@/components/utils/userApi";

// Choices offered on the profile page. They match the server's lists (backend/src/user/profile and /addresses).
export const contactMethods: { value: ContactMethod; label: string; hint: string }[] = [
  { value: "phone", label: "Phone call", hint: "Plumbers call you" },
  { value: "sms", label: "Text message", hint: "Quick SMS updates" },
  { value: "email", label: "Email", hint: "Written replies" },
];
export const contactTimes: { value: ContactTime; label: string }[] = [
  { value: "anytime", label: "Any time" },
  { value: "morning", label: "Morning (8am – 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm – 5pm)" },
  { value: "evening", label: "Evening (5pm – 8pm)" },
];
export const languages = ["English", "Spanish", "French", "Chinese", "Vietnamese", "Tagalog", "Arabic", "Korean", "Russian", "Hindi", "Portuguese", "Other"];
export const propertyTypes: Record<PropertyType, string> = { house: "House", apartment: "Apartment", condo: "Condo", townhouse: "Townhouse", mobile_home: "Mobile home", commercial: "Commercial", other: "Other" };
export const ownershipLabels: Record<Ownership, string> = { owner: "I own it", renter: "I rent it", landlord: "I'm the landlord", property_manager: "I manage it" };
export const addressLabels = ["Home", "Work", "Rental", "Family", "Vacation home"];
export const US_STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

export const fieldClass = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
/** Server field errors read "phone must be a phone number"; show them as-is. */
export const errorText = (caught: unknown, fallback: string) => (caught instanceof Error ? caught.message : fallback);
