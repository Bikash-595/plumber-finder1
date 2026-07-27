"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { plumbers } from "@/data/plumbers";
import SearchHero from "@/components/find/SearchHero";
import FilterSidebar from "@/components/find/FilterSidebar";
import ResultsHeader from "@/components/find/ResultsHeader";
import PlumberCardGrid from "@/components/find/PlumberCardGrid";
import PlumberCardList from "@/components/find/PlumberCardList";
import Pagination from "@/components/find/Pagination";
export default function FindPlumberPageWrapper() {
  return (
    <Suspense>
      <FindPlumberPage />
    </Suspense>
  );
}

function FindPlumberPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchFilters, setSearchFilters] = useState({
    query: searchParams.get("search") ?? "",
    zip: "",
    serviceCategory: "",
    emergencyOnly: false,
    verifiedOnly: false,
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedResponseTimes, setSelectedResponseTimes] = useState<string[]>([]);
  const [selectedTeamSizes, setSelectedTeamSizes] = useState<string[]>([]);
  const [selectedYearsInBusiness, setSelectedYearsInBusiness] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Helper functions for ranges (team size, years)
  const matchesTeamSize = useCallback((size: number, ranges: string[]) => {
    if (ranges.length === 0) return true;
    return ranges.some((range) => {
      if (range === "1-5") return size >= 1 && size <= 5;
      if (range === "6-10") return size >= 6 && size <= 10;
      if (range === "11-20") return size >= 11 && size <= 20;
      if (range === "21+") return size >= 21;
      return false;
    });
  }, []);

  const matchesYearsRange = useCallback((years: number, ranges: string[]) => {
    if (ranges.length === 0) return true;

    return ranges.some((range) => {
      if (range === "0-5") return years >= 0 && years <= 5;
      if (range === "6-10") return years >= 6 && years <= 10;
      if (range === "11-20") return years >= 11 && years <= 20;
      if (range === "21+") return years >= 21;
      return false;
    });
  }, []);

  const normalizeValue = useCallback(
    (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(),
    []
  );

  const normalizeResponseTime = useCallback((value: string) => {
    const normalized = normalizeValue(value);

    if (normalized.includes("30 min")) return "< 30 min";
    if (normalized.includes("45 min") || normalized.includes("1 hour")) return "< 1 hour";
    if (normalized.includes("2 hours")) return "< 2 hours";
    if (normalized.includes("3 hours") || normalized.includes("4 hours")) return "< 4 hours";
    if (normalized.includes("next day")) return "Next day";

    return value;
  }, [normalizeValue]);

  const normalizeAvailability = useCallback((value: string) => {
    const normalized = normalizeValue(value);

    if (normalized.includes("24 7") || normalized.includes("emergency")) return "24/7 Emergency";
    if (normalized.includes("weekend")) return "Weekends only";
    if (normalized.includes("business hours") || normalized.includes("appointment")) return "Business hours";
    if (normalized.includes("evening")) return "Evenings available";
    if (normalized.includes("same day")) return "Same-day";

    return value;
  }, [normalizeValue]);

  const getSearchableText = useCallback((plumber: typeof plumbers[number]) =>
    [
      plumber.companyName,
      plumber.ownerName,
      plumber.description,
      plumber.location,
      plumber.city,
      plumber.state,
      plumber.services.join(" "),
      plumber.serviceAreas.join(" "),
      plumber.specializations.join(" "),
      plumber.certifications.join(" "),
      plumber.paymentMethods.join(" "),
      plumber.languages.join(" "),
      plumber.phone,
      plumber.email,
      plumber.website,
      plumber.warranty,
      plumber.licenseNumber,
      plumber.insurance,
      plumber.availability,
      plumber.responseTime,
      plumber.priceRange,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(), []);

  const filteredPlumbers = useMemo(() => plumbers.filter((plumber) => {
    const query = searchFilters.query.trim().toLowerCase();
    const locationQuery = searchFilters.zip.trim().toLowerCase();
    const serviceCategory = searchFilters.serviceCategory.trim().toLowerCase();

    const plumberServices = plumber.services.map((service) => service.toLowerCase());
    const plumberServiceAreas = plumber.serviceAreas.map((area) => area.toLowerCase());
    const plumberPaymentMethods = plumber.paymentMethods.map((method) => method.toLowerCase());
    const plumberLanguages = plumber.languages.map((language) => language.toLowerCase());
    const plumberCertifications = plumber.certifications.map((cert) => cert.toLowerCase());
    const normalizedAvailability = normalizeAvailability(plumber.availability);
    const normalizedResponseTime = normalizeResponseTime(plumber.responseTime);

    const searchableText = getSearchableText(plumber);
    const matchesQuery = !query || searchableText.includes(query);

    const matchesLocation =
      !locationQuery ||
      plumber.location.toLowerCase().includes(locationQuery) ||
      (plumber.city?.toLowerCase().includes(locationQuery) ?? false) ||
      (plumber.state?.toLowerCase().includes(locationQuery) ?? false) ||
      plumberServiceAreas.some((area) => area.includes(locationQuery));

    const matchesCategory =
      !serviceCategory ||
      plumberServices.some((service) => service === serviceCategory);

    const matchesEmergencyHero = !searchFilters.emergencyOnly || plumber.isEmergency;
    const matchesVerifiedHero = !searchFilters.verifiedOnly || plumber.isVerified;

    const matchesServices =
      selectedServices.length === 0 ||
      selectedServices.some((selectedService) =>
        plumberServices.some(
          (service) =>
            service.includes(selectedService.toLowerCase()) ||
            selectedService.toLowerCase().includes(service)
        )
      );

    const matchesPrice =
      priceRange === "all" || plumber.priceRange === priceRange;

    const matchesEmergencySidebar = !emergencyOnly || plumber.isEmergency;
    const matchesVerifiedSidebar = !verifiedOnly || plumber.isVerified;
    const matchesResponseTime =
      selectedResponseTimes.length === 0 ||
      selectedResponseTimes.includes(normalizedResponseTime);
    const matchesTeamSizeFilter = matchesTeamSize(plumber.teamSize, selectedTeamSizes);
    const matchesYearsFilter = matchesYearsRange(plumber.yearsInBusiness, selectedYearsInBusiness);
    const matchesPaymentMethods =
      selectedPaymentMethods.length === 0 ||
      selectedPaymentMethods.some((method) => plumberPaymentMethods.includes(method));
    const matchesLanguages =
      selectedLanguages.length === 0 ||
      selectedLanguages.some((lang) => plumberLanguages.includes(lang));
    const matchesCertifications =
      selectedCertifications.length === 0 ||
      selectedCertifications.some((cert) => plumberCertifications.includes(cert));
    const matchesAvailability =
      selectedAvailability.length === 0 ||
      selectedAvailability.includes(normalizedAvailability);

    return (
      matchesQuery &&
      matchesLocation &&
      matchesCategory &&
      matchesEmergencyHero &&
      matchesVerifiedHero &&
      matchesServices &&
      matchesPrice &&
      matchesEmergencySidebar &&
      matchesVerifiedSidebar &&
      matchesResponseTime &&
      matchesTeamSizeFilter &&
      matchesYearsFilter &&
      matchesPaymentMethods &&
      matchesLanguages &&
      matchesCertifications &&
      matchesAvailability
    );
  }), [
    searchFilters,
    selectedServices,
    priceRange,
    emergencyOnly,
    verifiedOnly,
    selectedResponseTimes,
    selectedTeamSizes,
    selectedYearsInBusiness,
    selectedPaymentMethods,
    selectedLanguages,
    selectedCertifications,
    selectedAvailability,
    getSearchableText,
    matchesTeamSize,
    matchesYearsRange,
    normalizeAvailability,
    normalizeResponseTime,
  ]);

  const totalPages = Math.ceil(filteredPlumbers.length / itemsPerPage);
  const safeCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const paginatedPlumbers = filteredPlumbers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-white font-sans">
      <SearchHero
        onSearch={setSearchFilters}
        initialFilters={{
          query: searchParams.get("search") ?? "",
          zip: searchParams.get("location") ?? "",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <FilterSidebar
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              emergencyOnly={emergencyOnly}
              onEmergencyChange={setEmergencyOnly}
              verifiedOnly={verifiedOnly}
              onVerifiedChange={setVerifiedOnly}
              selectedResponseTimes={selectedResponseTimes}
              onResponseTimesChange={setSelectedResponseTimes}
              selectedTeamSizes={selectedTeamSizes}
              onTeamSizesChange={setSelectedTeamSizes}
              selectedYearsInBusiness={selectedYearsInBusiness}
              onYearsInBusinessChange={setSelectedYearsInBusiness}
              selectedPaymentMethods={selectedPaymentMethods}
              onPaymentMethodsChange={setSelectedPaymentMethods}
              selectedLanguages={selectedLanguages}
              onLanguagesChange={setSelectedLanguages}
              selectedCertifications={selectedCertifications}
              onCertificationsChange={setSelectedCertifications}
              selectedAvailability={selectedAvailability}
              onAvailabilityChange={setSelectedAvailability}
            />
          </aside>
          <div className="flex-1">
            <ResultsHeader totalResults={filteredPlumbers.length} viewMode={viewMode} onViewModeChange={setViewMode} />
            {paginatedPlumbers.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">No plumbers match your criteria.</div>
            ) : viewMode === "grid" ? (
              <PlumberCardGrid plumbers={paginatedPlumbers} />
            ) : (
              <PlumberCardList plumbers={paginatedPlumbers} />
            )}
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
