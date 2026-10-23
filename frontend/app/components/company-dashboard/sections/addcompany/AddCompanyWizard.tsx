"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaArrowRight, FaCheck, FaChevronLeft, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { apiRequest } from "@/components/utils/apiClient";
import LocationPicker from "@/components/company-dashboard/LocationPicker";
import WeeklyHoursEditor, { hoursPayload, initialWeeklyHours, withAllDays, type HoursRow } from "@/components/company-dashboard/business-profile/WeeklyHoursEditor";

const steps = [
  {
    id: "company-information",
    title: "Company Information",
    description: "Capture the public profile and business identity details.",
    fields: [
      { 
        name: "companyName", 
        label: "Company Name", 
        type: "text", 
        placeholder: "Premier Plumbing Co." 
      },
      {
        name: "tagline", 
        label: "Company Tagline", 
        type: "text", 
        placeholder: "Fast, friendly plumbing services." 
      },
      { 
        name: "slogan", 
        label: "Company Slogan", 
        type: "text", 
        placeholder: "Your trusted leak repair experts." 
      },

      { 
        name: "shortDescription", 
        label: "Short Description", 
        type: "textarea", 
        placeholder: "Reliable plumbing for homes and businesses." 
      },
      { 
        name: "longDescription", 
        label: "Long Description", 
        type: "textarea", 
        placeholder: "Premier Plumbing provides residential and commercial plumbing services across New York...", 
        rows: 6 
      },
      { 
        name: "missionStatement", 
        label: "Mission Statement", 
        type: "textarea", 
        placeholder: "Deliver exceptional plumbing service with integrity and speed.", 
        rows: 4 
      },
      { 
        name: "visionStatement", 
        label: "Vision Statement", 
        type: "textarea", 
        placeholder: "To be the most trusted plumbing partner in every community.", 
        rows: 4 
      },
    ],
  },









  {
    id: "business-profile",
    title: "Business Profile",
    description: "Add the company background, operations, and scale details.",
    fields: [
      { 
        name: "companyHistory", 
        label: "Company History", 
        type: "textarea", 
        placeholder: "Founded in 2003, Premier Plumbing has grown from a two-person team...", 
        rows: 5 
      },
      { 
        name: "founderStory", 
        label: "Founder Story", 
        type: "textarea", 
        placeholder: "Our founder started as an apprentice plumber...", 
        rows: 4 
      },
      { 
        name: "businessGoals", 
        label: "Business Goals", 
        type: "textarea", 
        placeholder: "Expand into commercial maintenance contracts and emergency repair services.", 
        rows: 4 
      },
      { 
        name: "coreValues", 
        label: "Core Values", 
        type: "textarea", 
        placeholder: "Integrity, responsiveness, quality workmanship.", 
        rows: 4 
      },

      { 
        name: "businessRegistrationNumber", 
        label: "Business Registration Number", 
        type: "text", 
        placeholder: "NY-PL-2024-009" 
      },
      { 
        name: "taxIdentificationNumber", 
        label: "Tax Identification Number", 
        type: "text", 
        placeholder: "98-7654321" 
      },
      { 
        name: "vatGstNumber", 
        label: "VAT/GST Number", 
        type: "text", 
        placeholder: "US123456789" 
      },
      { 
        name: "employerIdentificationNumber", 
        label: "Employer Identification Number", 
        type: "text", 
        placeholder: "12-3456789" 
      },
      { 
        name: "companyType", 
        label: "Company Type", 
        type: "text", 
        placeholder: "Plumbing Contractor" 
      },
      { 
        name: "businessStructure", 
        label: "Business Structure", 
        type: "select", 
        options: ["Sole Proprietorship", "LLC", "Corporation", "Partnership"] 
      },

      { 
        name: "yearEstablished", 
        label: "Year Established", 
        type: "number", 
        placeholder: "2003" 
      },
      { 
        name: "numberOfEmployees", 
        label: "Number Of Employees", 
        type: "number", 
        placeholder: "42" 
      },
      { 
        name: "numberOfTechnicians", 
        label: "Number Of Technicians", 
        type: "number", 
        placeholder: "27" 
      },
      { 
        name: "numberOfVehicles", 
        label: "Number Of Vehicles", 
        type: "number", 
        placeholder: "14" 
      },
      { 
        name: "companySize", 
        label: "Company Size", 
        type: "text", 
        placeholder: "Small Business" 
      },
      { 
        name: "languagesSpoken", 
        label: "Languages Spoken", 
        type: "text", 
        placeholder: "English, Spanish" 
      },
      { 
        name: "serviceCapacity", 
        label: "Service Capacity", 
        type: "text", 
        placeholder: "High-volume residential and commercial service." 
      },
      { 
        name: "annualRevenueRange", 
        label: "Annual Revenue Range", 
        type: "text", 
        placeholder: "$1M - $5M" 
      },
      { 
        name: "operatingRegions", 
        label: "Operating Regions", 
        type: "text", 
        placeholder: "NYC Metro, Hudson Valley, Long Island" 
      },
    ],
  },







  {
    id: "branding",
    title: "Branding & Media",
    description: "Capture the visual identity, marketing assets, and SEO metadata.",
    fields: [
      { 
        name: "companyLogo", 
        label: "Company Logo URL", 
        type: "url", 
        placeholder: "https://.../logo.png" 
      },
      { 
        name: "darkLogo", 
        label: "Dark Logo URL", 
        type: "url", 
        placeholder: "https://.../logo-dark.png" 
      },
      { 
        name: "lightLogo", 
        label: "Light Logo URL", 
        type: "url", 
        placeholder: "https://.../logo-light.png" 
      },
      { 
        name: "favicon", 
        label: "Favicon URL", 
        type: "url", 
        placeholder: "https://.../favicon.ico" 
      },
      { 
        name: "coverImage", 
        label: "Cover Image URL", 
        type: "url", 
        placeholder: "https://.../cover.jpg" 
      },
      { 
        name: "heroBanner", 
        label: "Hero Banner URL", 
        type: "url", 
        placeholder: "https://.../hero.jpg" 
      },
      { 
        name: "mobileBanner", 
        label: "Mobile Banner URL", 
        type: "url", 
        placeholder: "https://.../mobile-banner.jpg" 
      },
      { 
        name: "introVideo", 
        label: "Company Intro Video URL", 
        type: "url", 
        placeholder: "https://.../video.mp4" 
      },
      { 
        name: "brandColors", 
        label: "Brand Colors", 
        type: "text", 
        placeholder: "#003366, #FFD60A, #ffffff" 
      },
      { 
        name: "brandTypography", 
        label: "Brand Typography", 
        type: "text", 
        placeholder: "Inter, Roboto, Poppins" 
      },
      { 
        name: "seoTitle", 
        label: "SEO Title", 
        type: "text", 
        placeholder: "Best Plumbing Services in NYC | Premier Plumbing" 
      },
      { 
        name: "seoKeywords", 
        label: "SEO Keywords", 
        type: "text", 
        placeholder: "plumbing, leak repair, drain cleaning" 
      },
    ],
  },











  {
    id: "gallery",
    title: "Gallery & Media",
    description: "Upload multiple images and videos that showcase the company, service work, and video stories.",
    fields: [
      { 
        name: "galleryDescription", 
        label: "Gallery Description", 
        type: "textarea", 
        placeholder: "Showcase your best projects and team in a visual gallery.", 
        rows: 4 
      },
    ],
  },
  {
    id: "contact",
    title: "Contact & Location",
    description: "Add phone, email, support channels and the primary address.",
    fields: [
      { 
        name: "primaryPhone", 
        label: "Primary Phone", 
        type: "tel", 
        placeholder: "(212) 555-1234" 
      },
      { 
        name: "secondaryPhone", 
        label: "Secondary Phone", 
        type: "tel", 
        placeholder: "(212) 555-5678" 
      },
      { 
        name: "whatsapp", 
        label: "WhatsApp", 
        type: "tel", 
        placeholder: "+1 917 555 1234" 
      },
      { 
        name: "smsNumber", 
        label: "SMS Number", 
        type: "tel", 
        placeholder: "+1 917 555 4321" 
      },
      { 
        name: "email", 
        label: "Email", 
        type: "email", 
        placeholder: "contact@premierplumbing.com" 
      },
      { 
        name: "supportEmail", 
        label: "Support Email", 
        type: "email", 
        placeholder: "support@premierplumbing.com" 
      },
      { 
        name: "salesEmail", 
        label: "Sales Email", 
        type: "email", 
        placeholder: "sales@premierplumbing.com" 
      },
      { 
        name: "emergencyHotline", 
        label: "Emergency Hotline", 
        type: "tel", 
        placeholder: "+1 800 123 4567" 
      },
      { 
        name: "website", 
        label: "Website", 
        type: "url", 
        placeholder: "https://premierplumbing.com" 
      },
      { 
        name: "contactPerson", 
        label: "Contact Person", 
        type: "text", 
        placeholder: "Alicia Torres" 
      },
      { 
        name: "contactPersonRole", 
        label: "Contact Person Role", 
        type: "text", 
        placeholder: "Operations Manager" 
      },
    ],
  },











  {
    id: "location",
    title: "Location & Service Area",
    description: "Define all operating locations, service cities, and mapping details.",
    fields: [
      { 
        name: "headquarters", 
        label: "Headquarters Address", 
        type: "textarea", 
        placeholder: "123 Main St, New York, NY 10001", 
        rows: 3 
      },
      { 
        name: "branchLocations", 
        label: "Branch Locations", 
        type: "textarea", 
        placeholder: "45 Hudson Ave, Brooklyn, NY 11201\n98 Main St, White Plains, NY 10601", 
        rows: 4 
      },
      { 
        name: "franchiseLocations", 
        label: "Franchise Locations", 
        type: "textarea", 
        placeholder: "Chicago, IL; Dallas, TX", 
        rows: 3 
      },
      { 
        name: "serviceRadius", 
        label: "Service Radius (miles)", 
        type: "text", 
        placeholder: "50" 
      },
      { 
        name: "multipleServiceAreas", 
        label: "Multiple Service Areas", 
        type: "textarea", 
        placeholder: "Manhattan, Brooklyn, Queens", 
        rows: 3 
      },
      { 
        name: "multipleCities", 
        label: "Multiple Cities", 
        type: "text", 
        placeholder: "New York, Jersey City" 
      },
      { 
        name: "multipleStates", 
        label: "Multiple States", 
        type: "text", 
        placeholder: "NY, NJ" 
      },
      { 
        name: "operatingCountries", 
        label: "Operating Countries", 
        type: "text", 
        placeholder: "United States" 
      },
      { 
        name: "googleMapsIntegration", 
        label: "Google Maps Embed URL", 
        type: "url", 
        placeholder: "https://maps.google.com/..." 
      },
      { 
        name: "latitude", 
        label: "Latitude", 
        type: "text", 
        placeholder: "40.7128" 
      },
      { 
        name: "longitude", 
        label: "Longitude", 
        type: "text", 
        placeholder: "-74.0060" 
      },
    ],
  },
















  {
    id: "operations",
    title: "Business Hours & Operations",
    description: "Add working hours, emergency availability and special closures.",
    fields: [
      { 
        name: "dailyHours", 
        label: "Daily Hours", 
        type: "textarea", 
        placeholder: "Mon-Fri 8:00 AM - 8:00 PM\nSat 9:00 AM - 5:00 PM", 
        rows: 4 
      },
      { 
        name: "holidayHours", 
        label: "Holiday Hours", 
        type: "textarea", 
        placeholder: "Closed on Thanksgiving and Christmas.", 
        rows: 3 
      },
      { 
        name: "emergencyHours", 
        label: "Emergency Hours", 
        type: "textarea", 
        placeholder: "24/7 emergency response available.", 
        rows: 3 
      },
      { 
        name: "availability24x7", 
        label: "24/7 Availability", 
        type: "select", 
        options: ["Yes", "No"] 
      },
      { 
        name: "seasonalHours", 
        label: "Seasonal Hours", 
        type: "textarea", 
        placeholder: "Winter: Mon-Fri 7:00 AM - 6:00 PM", 
        rows: 3 
      },
      { 
        name: "specialClosures", 
        label: "Special Closures", 
        type: "textarea", 
        placeholder: "Closed for Memorial Day weekend.", 
        rows: 3 
      },
    ],
  },















  {
    id: "services",
    title: "Services & Categories",
    description: "Create service packages and categories used on the public profile.",
    fields: [
      { 
        name: "serviceCategory", 
        label: "Service Category", 
        type: "text", 
        placeholder: "Emergency Plumbing" 
      },
      { 
        name: "serviceName", 
        label: "Service Name", 
        type: "text", 
        placeholder: "Burst Pipe Repair" 
      },
      { 
        name: "serviceDescription", 
        label: "Service Description", 
        type: "textarea", 
        placeholder: "Fast repair for burst pipes with guaranteed workmanship.", 
        rows: 4 
      },
      { 
        name: "serviceFeatures", 
        label: "Service Features", 
        type: "textarea", 
        placeholder: "24/7 response, free inspection, warranty", 
        rows: 3 
      },
      { 
        name: "serviceBenefits", 
        label: "Service Benefits", 
        type: "textarea", 
        placeholder: "Faster repairs, lower damage risk, fixed pricing.", 
        rows: 3 
      },
      { 
        name: "serviceAreas", 
        label: "Service Areas", 
        type: "text", 
        placeholder: "Manhattan, Bronx, Westchester" 
      },
      { 
        name: "servicePricing", 
        label: "Service Pricing", 
        type: "text", 
        placeholder: "$99 - $499" 
      },
      { 
        name: "estimatedDuration", 
        label: "Estimated Duration", 
        type: "text", 
        placeholder: "1 - 3 hours" 
      },
      { 
        name: "warranty", 
        label: "Warranty", 
        type: "text", 
        placeholder: "1 year workmanship warranty" 
      },
      { 
        name: "serviceFaqs", 
        label: "Service FAQs", 
        type: "textarea", 
        placeholder: "What is included?\nDo you offer emergency service?", 
        rows: 4 
      },
    ],
  },
];




const initialFormData = steps.flatMap((step) => step.fields).reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {} as Record<string, string>);

const initialService = { name: "", category: "", description: "", pricing: "", duration: "", warranty: "", areas: "" };
const initialLocation = { label: "", address: "", city: "", state: "", country: "", zipCode: "", latitude: "", longitude: "", radius: "" };
const initialGalleryImage = { url: "", caption: "" };
const initialGalleryVideo = { url: "", title: "" };
type Service = typeof initialService;
type Location = typeof initialLocation;
type GalleryImage = typeof initialGalleryImage;
type GalleryVideo = typeof initialGalleryVideo;
type ListName = "services" | "locations" | "galleryImages" | "galleryVideos" | "weeklyHours";
type OnboardingData = {
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
const stepLists: Record<string, ListName[]> = { gallery: ["galleryImages", "galleryVideos"], location: ["locations"], operations: ["weeklyHours"], services: ["services"] };
const loginMessage = "Please log in with your company account to add or edit your listing.";
// Saved lists come back without empty rows; keep one blank row so the form always has inputs.
const withBlankRow = <T,>(items: T[] | undefined, blank: T) => (items?.length ? items.map((item) => ({ ...blank, ...item })) : [{ ...blank }]);

export default function AddCompanyWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>(initialFormData);
  const [services, setServices] = useState([initialService]);
  const [locations, setLocations] = useState([initialLocation]);
  const [galleryImages, setGalleryImages] = useState([initialGalleryImage]);
  const [galleryVideos, setGalleryVideos] = useState([initialGalleryVideo]);
  const [weeklyHours, setWeeklyHours] = useState<HoursRow[]>(initialWeeklyHours);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  // Load whatever the company already saved, so the wizard resumes (or edits a published listing).
  useEffect(() => {
    let cancelled = false;
    apiRequest<OnboardingData>("/companies/onboarding", { loginMessage })
      .then(({ data }) => {
        if (cancelled) return;
        setFormData({ ...initialFormData, ...data.formData });
        setServices(withBlankRow(data.services, initialService));
        setLocations(withBlankRow(data.locations, initialLocation));
        setGalleryImages(withBlankRow(data.galleryImages, initialGalleryImage));
        setGalleryVideos(withBlankRow(data.galleryVideos, initialGalleryVideo));
        setWeeklyHours(withAllDays(data.weeklyHours));
        setCompletedSteps(data.completedSteps);
        setIsLive(Boolean(data.submittedAt));
        // Resume at the first unfinished step.
        const nextStep = steps.findIndex((item) => !data.completedSteps.includes(item.id));
        if (!data.submittedAt && nextStep > 0) setStepIndex(nextStep);
      })
      .catch((error) => { if (!cancelled) setSubmitError(error instanceof Error ? error.message : "Unable to load your saved listing."); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const changeStep = (index: number) => {
    setStepIndex(Math.min(Math.max(index, 0), steps.length - 1));
    setSubmitError("");
    setSubmitSuccess("");
  };

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const updateService = (index: number, key: string, value: string) => {
    setServices((current) => current.map((service, idx) => (idx === index ? { ...service, [key]: value } : service)));
  };

  const addService = () => setServices((current) => [...current, { ...initialService }]);
  const removeService = (index: number) => setServices((current) => current.filter((_, idx) => idx !== index));

  const updateLocation = (index: number, key: string, value: string) => {
    setLocations((current) => current.map((location, idx) => (idx === index ? { ...location, [key]: value } : location)));
  };

  const addLocation = () => setLocations((current) => [...current, { ...initialLocation }]);
  const removeLocation = (index: number) => setLocations((current) => current.filter((_, idx) => idx !== index));

  const updateGalleryImage = (index: number, key: string, value: string) => {
    setGalleryImages((current) => current.map((image, idx) => (idx === index ? { ...image, [key]: value } : image)));
  };

  const addGalleryImage = () => setGalleryImages((current) => [...current, { ...initialGalleryImage }]);
  const removeGalleryImage = (index: number) => setGalleryImages((current) => current.filter((_, idx) => idx !== index));

  const updateGalleryVideo = (index: number, key: string, value: string) => {
    setGalleryVideos((current) => current.map((video, idx) => (idx === index ? { ...video, [key]: value } : video)));
  };

  const addGalleryVideo = () => setGalleryVideos((current) => [...current, { ...initialGalleryVideo }]);
  const removeGalleryVideo = (index: number) => setGalleryVideos((current) => current.filter((_, idx) => idx !== index));

  const goBack = () => changeStep(stepIndex - 1);
  const lists = { services, locations, galleryImages, galleryVideos, weeklyHours: hoursPayload(weeklyHours) };

  /** Saves the current step to the database. Once the listing is live, the change is published immediately. */
  const saveStep = async () => {
    if (step.id === "company-information" && !formData.companyName?.trim()) throw new Error("Company Name is required.");
    const body = {
      formData: Object.fromEntries(step.fields.map((field) => [field.name, formData[field.name] ?? ""])),
      ...Object.fromEntries((stepLists[step.id] ?? []).map((name) => [name, lists[name]])),
    };
    const response = await apiRequest<OnboardingData>(`/companies/onboarding/steps/${step.id}`, { method: "PUT", body, loginMessage });
    setCompletedSteps(response.data.completedSteps);
    return response.message;
  };

  const run = async (action: () => Promise<string | undefined>) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const message = await action();
      if (message) setSubmitSuccess(message);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save this step.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStepFields = (stepId: string) => {
    const target = steps.find((item) => item.id === stepId)!;
    setFormData((current) => ({ ...current, ...Object.fromEntries(target.fields.map((field) => [field.name, ""])) }));
    if (stepId === "gallery") { setGalleryImages([{ ...initialGalleryImage }]); setGalleryVideos([{ ...initialGalleryVideo }]); }
    if (stepId === "location") setLocations([{ ...initialLocation }]);
    if (stepId === "operations") setWeeklyHours(initialWeeklyHours);
    if (stepId === "services") setServices([{ ...initialService }]);
  };

  // Deletes what was saved for this step (and empties its form).
  const handleClearStep = () => {
    if (!window.confirm(`Clear everything saved in "${step.title}"?${isLive ? " Your live listing will be updated." : ""}`)) return;
    run(async () => {
      const response = await apiRequest<OnboardingData>(`/companies/onboarding/steps/${step.id}`, { method: "DELETE", loginMessage });
      resetStepFields(step.id);
      setCompletedSteps(response.data.completedSteps);
      return response.message;
    });
  };

  // Removes the listing from the directory and everything saved in the wizard.
  const handleDeleteListing = () => {
    if (!window.confirm("Delete your company listing? It will disappear from the public directory and all wizard steps will be cleared. Your team, blogs, projects and other Business Profile sections are kept.")) return;
    run(async () => {
      const response = await apiRequest("/companies/onboarding", { method: "DELETE", loginMessage });
      steps.forEach((item) => resetStepFields(item.id));
      setCompletedSteps([]);
      setIsLive(false);
      setStepIndex(0);
      return response.message;
    });
  };

  // "Save" keeps the company on the current step.
  const handleSave = () => run(saveStep);

  // The main button saves the step, then moves on; the last step also publishes the listing.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(async () => {
      const message = await saveStep();
      if (isLive) return message;
      if (!isLastStep) {
        changeStep(stepIndex + 1);
        return `Step ${stepIndex + 1} saved.`;
      }
      await apiRequest("/companies/onboarding", { method: "POST", body: { formData, ...lists }, loginMessage });
      setIsLive(true);
      setCompletedSteps(steps.map((item) => item.id));
      return "Company listing published. You can come back to any step to edit it — changes go live when you save.";
    });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0b1f3b]">{isLive ? "Your Listing Is Live" : "Company Onboarding"}</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{isLive ? "Edit Company Listing" : "Add Company Listing"}</h2>
          <p className="mt-2 text-sm text-gray-500">Step {stepIndex + 1} of {steps.length}: {step.title}</p>
          <p className="mt-1 text-xs text-gray-400">{isLoading ? "Loading your saved details…" : isLive ? "Edit any step and save — changes update your public listing right away." : `${completedSteps.length} of ${steps.length} steps saved. Each step is saved when you continue.`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => changeStep(index)}
              title={`${item.title}${completedSteps.includes(item.id) ? " (saved)" : ""}`}
              aria-label={`Step ${index + 1}: ${item.title}${completedSteps.includes(item.id) ? ", saved" : ""}`}
              aria-current={index === stepIndex ? "step" : undefined}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                index === stepIndex ? "bg-[#0b1f3b] text-white" : completedSteps.includes(item.id) ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-600 hover:bg-[#FFD60A]/20"
              }`}
            >
              {completedSteps.includes(item.id) && index !== stepIndex && <FaCheck className="h-2.5 w-2.5" aria-hidden />}
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <fieldset disabled={isLoading} className="space-y-8 disabled:opacity-60">
        <div className="grid gap-6 md:grid-cols-2">
          {step.fields.map((field) => (
            <label key={field.name} className={`${field.type === "textarea" ? "md:col-span-2" : ""}`}>
              <span className="block text-sm font-bold text-gray-700">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={updateField}
                  rows={field.rows ?? 4}
                  placeholder={field.placeholder}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={updateField}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                >
                  <option value="">Choose an option</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={updateField}
                  placeholder={field.placeholder}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                />
              )}
            </label>
          ))}
        </div>

        {step.title === "Services & Categories" && (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between gap-3 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Service Catalog</h3>
                <p className="text-sm text-gray-500">Add one or more services and define their core details.</p>
              </div>
              <button
                type="button"
                onClick={addService}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111b35]"
              >
                <FaPlus className="h-3.5 w-3.5" /> Add Service
              </button>
            </div>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="rounded-3xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-bold text-gray-900">Service {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Service Name</span>
                      <input
                        value={service.name}
                        onChange={(event) => updateService(index, "name", event.target.value)}
                        placeholder="Burst Pipe Repair"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Category</span>
                      <input
                        value={service.category}
                        onChange={(event) => updateService(index, "category", event.target.value)}
                        placeholder="Emergency Plumbing"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label className="md:col-span-2">
                      <span className="block text-sm font-semibold text-gray-700">Description</span>
                      <textarea
                        value={service.description}
                        onChange={(event) => updateService(index, "description", event.target.value)}
                        rows={3}
                        placeholder="Fast repair for burst pipes with a satisfaction guarantee."
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Price Range</span>
                      <input
                        value={service.pricing}
                        onChange={(event) => updateService(index, "pricing", event.target.value)}
                        placeholder="$99 - $499"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Duration</span>
                      <input
                        value={service.duration}
                        onChange={(event) => updateService(index, "duration", event.target.value)}
                        placeholder="1 - 3 hours"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Warranty</span>
                      <input
                        value={service.warranty}
                        onChange={(event) => updateService(index, "warranty", event.target.value)}
                        placeholder="1 year workmanship warranty"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label className="md:col-span-2">
                      <span className="block text-sm font-semibold text-gray-700">Service Areas</span>
                      <input
                        value={service.areas}
                        onChange={(event) => updateService(index, "areas", event.target.value)}
                        placeholder="Manhattan, Brooklyn, Queens"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step.title === "Gallery & Media" && (
          <div className="space-y-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-bold text-gray-900">Gallery Description</h3>
              <p className="mt-2 text-sm text-gray-500">Add a short introduction for the company gallery and showcase section.</p>
              <textarea
                name="galleryDescription"
                value={formData.galleryDescription}
                onChange={updateField}
                rows={4}
                placeholder="Showcase your best projects, team photos, and company milestones."
                className="mt-4 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
              />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Gallery Images</h3>
                  <p className="text-sm text-gray-500">Add multiple image URLs for the public company gallery.</p>
                </div>
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111b35]"
                >
                  <FaPlus className="h-3.5 w-3.5" /> Add Image
                </button>
              </div>
              <div className="space-y-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-bold text-gray-900">Image {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="block text-sm font-semibold text-gray-700">Image URL</span>
                        <input
                          value={image.url}
                          onChange={(event) => updateGalleryImage(index, "url", event.target.value)}
                          placeholder="https://.../project-image.jpg"
                          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                        />
                      </label>
                      <label>
                        <span className="block text-sm font-semibold text-gray-700">Caption</span>
                        <input
                          value={image.caption}
                          onChange={(event) => updateGalleryImage(index, "caption", event.target.value)}
                          placeholder="Finished kitchen sink installation"
                          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Gallery Videos</h3>
                  <p className="text-sm text-gray-500">Add multiple video URLs for company introductions and project snippets.</p>
                </div>
                <button
                  type="button"
                  onClick={addGalleryVideo}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111b35]"
                >
                  <FaPlus className="h-3.5 w-3.5" /> Add Video
                </button>
              </div>
              <div className="space-y-4">
                {galleryVideos.map((video, index) => (
                  <div key={index} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-bold text-gray-900">Video {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeGalleryVideo(index)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="block text-sm font-semibold text-gray-700">Video URL</span>
                        <input
                          value={video.url}
                          onChange={(event) => updateGalleryVideo(index, "url", event.target.value)}
                          placeholder="https://.../company-intro.mp4"
                          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                        />
                      </label>
                      <label>
                        <span className="block text-sm font-semibold text-gray-700">Video Title</span>
                        <input
                          value={video.title}
                          onChange={(event) => updateGalleryVideo(index, "title", event.target.value)}
                          placeholder="Emergency response overview"
                          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step.title === "Location & Service Area" && (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between gap-3 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Locations & Service Areas</h3>
                <p className="text-sm text-gray-500">Manage multiple addresses and geo data for service coverage.</p>
              </div>
              <button
                type="button"
                onClick={addLocation}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111b35]"
              >
                <FaPlus className="h-3.5 w-3.5" /> Add Location
              </button>
            </div>
            <div className="space-y-4">
              {locations.map((location, index) => (
                <div key={index} className="rounded-3xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-bold text-gray-900">Location {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Label</span>
                      <input
                        value={location.label}
                        onChange={(event) => updateLocation(index, "label", event.target.value)}
                        placeholder="Headquarters"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Address</span>
                      <input
                        value={location.address}
                        onChange={(event) => updateLocation(index, "address", event.target.value)}
                        placeholder="123 Main St, New York, NY 10001"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">City</span>
                      <input
                        value={location.city}
                        onChange={(event) => updateLocation(index, "city", event.target.value)}
                        placeholder="New York"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">State</span>
                      <input
                        value={location.state}
                        onChange={(event) => updateLocation(index, "state", event.target.value)}
                        placeholder="NY"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Country</span>
                      <input
                        value={location.country}
                        onChange={(event) => updateLocation(index, "country", event.target.value)}
                        placeholder="United States"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">ZIP Code</span>
                      <input
                        value={location.zipCode}
                        onChange={(event) => updateLocation(index, "zipCode", event.target.value)}
                        placeholder="10001"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Latitude</span>
                      <input
                        value={location.latitude}
                        onChange={(event) => updateLocation(index, "latitude", event.target.value)}
                        placeholder="40.7128"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Longitude</span>
                      <input
                        value={location.longitude}
                        onChange={(event) => updateLocation(index, "longitude", event.target.value)}
                        placeholder="-74.0060"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <label>
                      <span className="block text-sm font-semibold text-gray-700">Service Radius (miles)</span>
                      <input
                        value={location.radius}
                        onChange={(event) => updateLocation(index, "radius", event.target.value)}
                        placeholder="50"
                        className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30"
                      />
                    </label>
                    <div className="md:col-span-2"><LocationPicker address={location.address} latitude={location.latitude} longitude={location.longitude} onChange={({ latitude, longitude }) => { updateLocation(index, "latitude", latitude); updateLocation(index, "longitude", longitude); }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step.id === "operations" && <WeeklyHoursEditor rows={weeklyHours} onChange={setWeeklyHours} />}

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#FFD60A] hover:text-[#0b1f3b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaChevronLeft className="mr-2 h-4 w-4" /> Back
          </button>
          {completedSteps.includes(step.id) && !(isLive && step.id === "company-information") && (
            <button
              type="button"
              onClick={handleClearStep}
              disabled={isSubmitting || isLoading}
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:mr-auto"
            >
              <FaTrash className="mr-2 h-3.5 w-3.5" /> Clear step
            </button>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting || isLoading}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#FFD60A] hover:text-[#0b1f3b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSave className="mr-2 h-4 w-4" /> {isLive ? "Save Changes" : "Save"}
            </button>
            {isLive ? (
              !isLastStep && (
                <button
                  type="button"
                  onClick={() => changeStep(stepIndex + 1)}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b1f3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111b35]"
                >
                  Next Step <FaArrowRight className="ml-2 h-4 w-4" />
                </button>
              )
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isLastStep ? "bg-[#FFD60A] text-[#0b1f3b] hover:bg-[#e6c000]" : "bg-[#0b1f3b] text-white hover:bg-[#111b35]"}`}
              >
                {isSubmitting ? (isLastStep ? "Publishing…" : "Saving…") : isLastStep ? "Save & Submit Listing" : <>Save & Continue <FaArrowRight className="ml-2 h-4 w-4" /></>}
              </button>
            )}
          </div>
        </div>
        </fieldset>
        {submitError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}
        {isLive && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700"><span className="font-bold text-red-700">Delete listing.</span> Removes your company from the public directory and clears every wizard step.</p>
            <button type="button" onClick={handleDeleteListing} disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50">
              <FaTrash className="mr-2 h-3.5 w-3.5" /> Delete listing
            </button>
          </div>
        )}
        {submitSuccess && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{submitSuccess}</p>}
      </form>
    </section>
  );
}
