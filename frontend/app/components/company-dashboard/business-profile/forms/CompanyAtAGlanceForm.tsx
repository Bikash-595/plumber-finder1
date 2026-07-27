"use client";

import { useState } from "react";
import { saveProfileDraft } from "../profileStore";

type AtAGlance = {
  foundedYear: string;
  yearsInBusiness: string;
  teamSize: string;
  licenseNumber: string;
  serviceAreaCount: string;
  averageCost: string;
  certifications: string;
  projectsCompleted: string;
  responseTime: string;
  insurance: string;
};

const initialValues: AtAGlance = {
  foundedYear: "2016",
  yearsInBusiness: "10",
  teamSize: "8",
  licenseNumber: "PL-90991",
  serviceAreaCount: "12",
  averageCost: "185",
  certifications: "OSHA, EPA",
  projectsCompleted: "240",
  responseTime: "Within 1 hour",
  insurance: "$2M liability",
};

export default function CompanyAtAGlanceForm() {
  const [values, setValues] = useState<AtAGlance>(initialValues);
  const [notice, setNotice] = useState("");
  const update = (name: keyof AtAGlance, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const save = (draft = false) => setNotice(saveProfileDraft("company-overview", values, draft));
  const field = (name: keyof AtAGlance, label: string, type: "text" | "number" = "text", hint?: string) => (
    <label key={name}>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-gray-400">{hint}</span>}
      <input type={type} min={type === "number" ? "0" : undefined} value={values[name]} onChange={(event) => update(name, event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
    </label>
  );

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Company overview</p>
    <h2 className="mt-2 text-2xl font-bold text-gray-900">Company at a Glance</h2>
    <p className="mt-2 max-w-3xl text-sm text-gray-500">These details are used in the “Company at a Glance” section on your public plumber profile.</p>

    <form onSubmit={(event) => { event.preventDefault(); save(); }} className="mt-7 space-y-7">
      <div>
        <h3 className="text-sm font-bold text-gray-900">Business details</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {field("foundedYear", "Founded year", "number")}
          {field("yearsInBusiness", "Years in business", "number")}
          {field("teamSize", "Team size", "number", "number of plumbers")}
          {field("licenseNumber", "License number")}
          {field("insurance", "Insurance coverage")}
          {field("responseTime", "Typical response time")}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-900">Public profile statistics</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {field("serviceAreaCount", "Service areas", "number", "number of cities")}
          {field("averageCost", "Average service cost", "number", "USD")}
          {field("projectsCompleted", "Projects completed", "number")}
          {field("certifications", "Certifications", "text", "separate with commas")}
        </div>
      </div>

      {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{notice}</p>}
      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
        <button type="submit" className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a]">Save overview</button>
        <button type="button" onClick={() => save(true)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Save as draft</button>
        <button type="button" onClick={() => { setValues(initialValues); setNotice(""); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Reset</button>
      </div>
    </form>
  </section>;
}
