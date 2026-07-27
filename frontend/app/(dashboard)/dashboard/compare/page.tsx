/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { plumbers } from "@/data/plumbers";
import Image from "next/image";
import {
  FaStar,
  FaCheck,
  FaTimes,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaShieldAlt,
  FaAward,
  FaUsers,
  FaCalendarAlt,
  FaThumbsUp,
  FaCertificate,
  FaWrench,
  FaTools,
  FaMedal,
} from "react-icons/fa";

export default function CompareCompaniesPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const selectedPlumbers = plumbers.filter(p => selectedIds.includes(p.id));

  const comparisonFeatures = [
    {
      category: "Basic Information",
      features: [
        { key: "companyName", label: "Company Name", icon: FaAward, format: (val: any) => val },
        { key: "rating", label: "Rating", icon: FaStar, format: (val: number) => `${val} ★` },
        { key: "reviewCount", label: "Reviews", icon: FaThumbsUp, format: (val: number) => `${val} reviews` },
        { key: "priceRange", label: "Price Range", icon: FaDollarSign, format: (val: any) => val },
        { key: "responseTime", label: "Response Time", icon: FaClock, format: (val: any) => val },
        { key: "location", label: "Location", icon: FaMapMarkerAlt, format: (val: any) => val },
      ]
    },
    {
      category: "Services & Availability",
      features: [
        { key: "isEmergency", label: "24/7 Emergency", icon: FaShieldAlt, format: (val: boolean) => val ? "✅ Yes" : "❌ No" },
        { key: "services", label: "Services Offered", icon: FaWrench, format: (val: string[]) => val?.join(", ") || "Not specified" },
        { key: "certifications", label: "Certifications", icon: FaCertificate, format: (val: string[]) => val?.join(", ") || "Not specified" },
        { key: "warranty", label: "Warranty", icon: FaMedal, format: (val: any) => val || "Not specified" },
        { key: "experience", label: "Years Experience", icon: FaCalendarAlt, format: (val: number) => `${val} years` },
      ]
    },
    {
      category: "Contact & Business",
      features: [
        { key: "phone", label: "Phone", icon: FaPhone, format: (val: any) => val },
        { key: "email", label: "Email", icon: FaEnvelope, format: (val: any) => val },
        { key: "website", label: "Website", icon: FaGlobe, format: (val: string) => val ? "Available" : "Not available" },
        { key: "teamSize", label: "Team Size", icon: FaUsers, format: (val: number) => `${val} members` },
        { key: "licenseNumber", label: "License Number", icon: FaCertificate, format: (val: any) => val },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-[#FFD60A]/5 to-[#FFD60A]/10 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compare Companies</h1>
            <p className="mt-1 text-gray-600">Select up to 3 plumbing companies to compare side by side</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
            <span className="text-sm font-medium text-gray-700">Selected:</span>
            <span className="rounded-full bg-[#FFD60A] px-2 py-1 text-xs font-bold text-gray-900">
              {selectedIds.length}/3
            </span>
          </div>
        </div>
      </div>

      {/* Company Selection */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Select Companies to Compare</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plumbers.slice(0, 8).map((plumber) => (
            <button
              key={plumber.id}
              onClick={() => toggleSelect(plumber.id)}
              disabled={!selectedIds.includes(plumber.id) && selectedIds.length >= 3}
              className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                selectedIds.includes(plumber.id)
                  ? "border-[#FFD60A] bg-gradient-to-br from-[#FFD60A]/10 to-[#FFD60A]/5 shadow-lg transform scale-[1.02]"
                  : selectedIds.length >= 3
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                  : "border-gray-200 bg-white hover:border-[#FFD60A]/50 hover:shadow-md hover:bg-[#FFD60A]/5"
              }`}
            >
              {selectedIds.includes(plumber.id) && (
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD60A] text-white">
                  <FaCheck className="h-3 w-3" />
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-white shadow-sm">
                  <Image
                    src={plumber.logo}
                    alt={plumber.companyName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-900 group-hover:text-[#B1A606]">
                    {plumber.companyName}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <FaStar className="h-4 w-4 text-[#FFD60A]" />
                      <span className="text-sm font-medium text-gray-700">{plumber.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({plumber.reviewCount} reviews)</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{plumber.priceRange}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedPlumbers.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            {comparisonFeatures.map((category, categoryIndex) => (
              <div key={category.category}>
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3">
                  <h3 className="font-semibold text-gray-800">{category.category}</h3>
                </div>
                <table className="min-w-full">
                  <tbody>
                    {category.features.map((feature, featureIndex) => {
                      const Icon = feature.icon;
                      return (
                        <tr key={feature.key} className={featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                          <td className="border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{feature.label}</span>
                            </div>
                          </td>
                          {selectedPlumbers.map((plumber) => {
                            const value = plumber[feature.key as keyof typeof plumber];
                            const formattedValue = feature.format ? feature.format(value) : String(value || "Not available");
                            return (
                              <td key={plumber.id} className="border-b border-gray-100 px-6 py-4">
                                <div className="text-sm text-gray-700">
                                  {formattedValue}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedPlumbers.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <button className="rounded-lg bg-[#FFD60A] px-6 py-3 font-semibold text-gray-900 shadow-sm hover:bg-[#B1A606] hover:shadow-md transition-all duration-200">
            Book with Selected Companies
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200">
            Save Comparison
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="rounded-lg border border-red-300 bg-white px-6 py-3 font-semibold text-red-600 shadow-sm hover:bg-red-50 hover:shadow-md transition-all duration-200"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
