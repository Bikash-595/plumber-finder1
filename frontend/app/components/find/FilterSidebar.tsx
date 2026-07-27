


"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface SectionProps {
  title: string;
  sectionKey: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: (section: string) => void;
}

function Section({ title, sectionKey, children, open, onToggle }: SectionProps) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <button
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between py-1 font-semibold text-gray-900"
      >
        {title}
        {open ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

// Extended filter options based on Plumber interface
const serviceOptions = [
  "Leak Repair", "Drain Cleaning", "Water Heater", "Pipe Repair", "Sewer Line",
  "Emergency Service", "Faucet Installation", "Toilet Repair", "Garbage Disposal",
  "Hydro Jetting", "Video Inspection", "Slab Leak", "Repiping", "Sump Pump",
  "Water Softener", "Gas Line Repair", "Bathroom Remodel", "Radiant Heating"
];

const responseTimeOptions = ["< 30 min", "< 1 hour", "< 2 hours", "< 4 hours", "Next day"];
const teamSizeOptions = ["1-5", "6-10", "11-20", "21+"];
const yearsInBusinessOptions = ["0-5", "6-10", "11-20", "21+"];
const paymentMethodsOptions = ["Cash", "Check", "Credit Card", "Financing", "Venmo", "PayPal"];
const languagesOptions = ["English", "Spanish", "Mandarin", "Tagalog", "Vietnamese", "Russian"];
const certificationsOptions = ["EPA", "OSHA", "LEED", "GreenPlumber", "Backflow Certified", "Gas Fitter", "Pipe Welding", "Medical Gas", "Solar Thermal"];
const availabilityOptions = ["24/7 Emergency", "Weekends only", "Business hours", "Evenings available", "Same-day"];

interface FilterSidebarProps {
  // Service filters
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  // Price
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  // Boolean toggles
  emergencyOnly: boolean;
  onEmergencyChange: (val: boolean) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (val: boolean) => void;
  // New filters
  selectedResponseTimes: string[];
  onResponseTimesChange: (times: string[]) => void;
  selectedTeamSizes: string[];
  onTeamSizesChange: (sizes: string[]) => void;
  selectedYearsInBusiness: string[];
  onYearsInBusinessChange: (years: string[]) => void;
  selectedPaymentMethods: string[];
  onPaymentMethodsChange: (methods: string[]) => void;
  selectedLanguages: string[];
  onLanguagesChange: (langs: string[]) => void;
  selectedCertifications: string[];
  onCertificationsChange: (certs: string[]) => void;
  selectedAvailability: string[];
  onAvailabilityChange: (avail: string[]) => void;
}

export default function FilterSidebar({
  selectedServices,
  onServicesChange,
  priceRange,
  onPriceRangeChange,
  emergencyOnly,
  onEmergencyChange,
  verifiedOnly,
  onVerifiedChange,
  selectedResponseTimes,
  onResponseTimesChange,
  selectedTeamSizes,
  onTeamSizesChange,
  selectedYearsInBusiness,
  onYearsInBusinessChange,
  selectedPaymentMethods,
  onPaymentMethodsChange,
  selectedLanguages,
  onLanguagesChange,
  selectedCertifications,
  onCertificationsChange,
  selectedAvailability,
  onAvailabilityChange,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    services: true,
    price: true,
    response: false,
    team: false,
    years: false,
    payment: false,
    languages: false,
    certifications: false,
    availability: false,
    other: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArrayFilter = (value: string, selected: string[], onChange: (val: string[]) => void) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Services */}
      <Section title="Services" sectionKey="services" open={openSections.services} onToggle={toggleSection}>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => toggleArrayFilter(service, selectedServices, onServicesChange)}
                className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
              />
              <span className="text-gray-700">{service}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price Range */}
      <Section title="Price Range" sectionKey="price" open={openSections.price} onToggle={toggleSection}>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="price"
              value="all"
              checked={priceRange === "all"}
              onChange={() => onPriceRangeChange("all")}
              className="text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">All</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="price"
              value="low"
              checked={priceRange === "low"}
              onChange={() => onPriceRangeChange("low")}
            />
            <span className="text-gray-700">$ (Budget)</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="price"
              value="high"
              checked={priceRange === "high"}
              onChange={() => onPriceRangeChange("high")}
            />
            <span className="text-gray-700">$$ (Premium)</span>
          </label>
        </div>
      </Section>

      {/* Other boolean toggles */}
      <Section title="Quick Filters" sectionKey="other" open={openSections.other} onToggle={toggleSection}>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={emergencyOnly}
            onChange={(e) => onEmergencyChange(e.target.checked)}
            className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
          />
          <span className="text-gray-700">24/7 Emergency available</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedChange(e.target.checked)}
            className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
          />
          <span className="text-gray-700">Verified only</span>
        </label>
      </Section>

      {/* Response Time */}
      <Section title="Response Time" sectionKey="response" open={openSections.response} onToggle={toggleSection}>
        {responseTimeOptions.map((time) => (
          <label key={time} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedResponseTimes.includes(time)}
              onChange={() => toggleArrayFilter(time, selectedResponseTimes, onResponseTimesChange)}
              className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">{time}</span>
          </label>
        ))}
      </Section>

      {/* Team Size */}
      <Section title="Team Size" sectionKey="team" open={openSections.team} onToggle={toggleSection}>
        {teamSizeOptions.map((size) => (
          <label key={size} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedTeamSizes.includes(size)}
              onChange={() => toggleArrayFilter(size, selectedTeamSizes, onTeamSizesChange)}
              className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">{size} plumbers</span>
          </label>
        ))}
      </Section>

      {/* Years in Business */}
      <Section title="Years in Business" sectionKey="years" open={openSections.years} onToggle={toggleSection}>
        {yearsInBusinessOptions.map((years) => (
          <label key={years} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedYearsInBusiness.includes(years)}
              onChange={() => toggleArrayFilter(years, selectedYearsInBusiness, onYearsInBusinessChange)}
              className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">{years} years</span>
          </label>
        ))}
      </Section>

      {/* Payment Methods */}
      <Section title="Payment Methods" sectionKey="payment" open={openSections.payment} onToggle={toggleSection}>
        {paymentMethodsOptions.map((method) => (
          <label key={method} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedPaymentMethods.includes(method)}
              onChange={() => toggleArrayFilter(method, selectedPaymentMethods, onPaymentMethodsChange)}
              className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">{method}</span>
          </label>
        ))}
      </Section>

      {/* Languages */}
      <Section title="Languages Spoken" sectionKey="languages" open={openSections.languages} onToggle={toggleSection}>
        {languagesOptions.map((lang) => (
          <label key={lang} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedLanguages.includes(lang)}
              onChange={() => toggleArrayFilter(lang, selectedLanguages, onLanguagesChange)}
              className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">{lang}</span>
          </label>
        ))}
      </Section>

      {/* Certifications */}
      <Section title="Certifications" sectionKey="certifications" open={openSections.certifications} onToggle={toggleSection}>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
          {certificationsOptions.map((cert) => (
            <label key={cert} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCertifications.includes(cert)}
                onChange={() => toggleArrayFilter(cert, selectedCertifications, onCertificationsChange)}
                className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
              />
              <span className="text-gray-700">{cert}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Availability */}
      <Section title="Availability" sectionKey="availability" open={openSections.availability} onToggle={toggleSection}>
        {availabilityOptions.map((avail) => (
          <label key={avail} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedAvailability.includes(avail)}
              onChange={() => toggleArrayFilter(avail, selectedAvailability, onAvailabilityChange)}
              className="rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">{avail}</span>
          </label>
        ))}
      </Section>
    </div>
  );
}
