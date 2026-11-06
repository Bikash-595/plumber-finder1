"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/components/utils/apiClient";
import LocationPicker from "@/components/company-dashboard/LocationPicker";
import WeeklyHoursEditor, { hoursPayload, initialWeeklyHours, withAllDays, type HoursRow } from "@/components/company-dashboard/business-profile/WeeklyHoursEditor";
import DeleteListingBox from "./wizard/DeleteListingBox";
import GalleryStep from "./wizard/GalleryStep";
import { locationFields, serviceFields } from "./wizard/listFields";
import RepeatableList from "./wizard/RepeatableList";
import StepFields from "./wizard/StepFields";
import StepNav from "./wizard/StepNav";
import WizardActions from "./wizard/WizardActions";
import { initialFormData, initialGalleryImage, initialGalleryVideo, initialLocation, initialService, loginMessage, stepLists, withBlankRow, type OnboardingData } from "./wizard/wizardData";
import { steps } from "./wizard/wizardSteps";

// The company onboarding wizard: one step at a time, each saved on its own (the pieces live in ./wizard).

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
      <StepNav stepIndex={stepIndex} completedSteps={completedSteps} isLive={isLive} isLoading={isLoading} onStep={changeStep} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <fieldset disabled={isLoading} className="space-y-8 disabled:opacity-60">
          <StepFields fields={step.fields} values={formData} onChange={updateField} />

          {step.id === "services" && (
            <RepeatableList title="Service Catalog" description="Add one or more services and define their core details." addLabel="Add Service" itemLabel="Service" rows={services} setRows={setServices} blank={initialService} fields={serviceFields} />
          )}
          {step.id === "gallery" && (
            <GalleryStep description={formData.galleryDescription} onDescription={updateField} images={galleryImages} setImages={setGalleryImages} videos={galleryVideos} setVideos={setGalleryVideos} />
          )}
          {step.id === "location" && (
            <RepeatableList title="Locations & Service Areas" description="Manage multiple addresses and geo data for service coverage." addLabel="Add Location" itemLabel="Location" rows={locations} setRows={setLocations} blank={initialLocation} fields={locationFields}
              extra={(location, update) => <LocationPicker address={location.address} latitude={location.latitude} longitude={location.longitude} onChange={({ latitude, longitude }) => { update("latitude", latitude); update("longitude", longitude); }} />} />
          )}
          {step.id === "operations" && <WeeklyHoursEditor rows={weeklyHours} onChange={setWeeklyHours} />}

          <WizardActions
            isFirstStep={stepIndex === 0} isLastStep={isLastStep} isLive={isLive} disabled={isSubmitting || isLoading} submitting={isSubmitting}
            canClear={completedSteps.includes(step.id) && !(isLive && step.id === "company-information")}
            onBack={goBack} onClear={handleClearStep} onSave={handleSave} onNext={() => changeStep(stepIndex + 1)}
          />
        </fieldset>
        {submitError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}
        {isLive && <DeleteListingBox disabled={isSubmitting} onDelete={handleDeleteListing} />}
        {submitSuccess && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{submitSuccess}</p>}
      </form>
    </section>
  );
}
