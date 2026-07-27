// app/add-business/page.tsx
"use client";

import { useState } from "react";
import { FaDollarSign, FaUsers, FaChartLine, FaShieldAlt, FaClock } from "react-icons/fa";

export default function AddBusinessPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    website: "",
    serviceAreas: "",
    description: "",
    licenseNumber: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    // Reset form after submission (optional)
    setFormData({
      businessName: "",
      email: "",
      phone: "",
      website: "",
      serviceAreas: "",
      description: "",
      licenseNumber: "",
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const benefits = [
    { icon: FaUsers, title: "Qualified Leads", description: "Get matched with homeowners actively seeking plumbing services in your area." },
    { icon: FaChartLine, title: "Grow Your Business", description: "Increase your bookings by 40% on average within the first 3 months." },
    { icon: FaDollarSign, title: "No Upfront Fees", description: "Pay only when you get a job. No subscription or hidden costs." },
    { icon: FaShieldAlt, title: "Verified Trust", description: "Build credibility with our verified badge and customer reviews." },
    { icon: FaClock, title: "Real-time Alerts", description: "Get notified instantly when a new lead matches your services." },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Get <span className="text-[#FFD60A]">Pro Leads</span> – Grow Your Plumbing Business
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Join thousands of plumbing professionals who use Plumber Finder to get qualified leads and expand their customer base.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Why partner with us?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:shadow-md">
                <benefit.icon className="mx-auto h-10 w-10 text-[#FFD60A]" />
                <h3 className="mt-3 font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD60A] text-white">1</div>
              <h3 className="mt-3 font-semibold">Sign Up</h3>
              <p className="text-sm text-gray-600">Create your professional profile in minutes.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD60A] text-white">2</div>
              <h3 className="mt-3 font-semibold">Get Verified</h3>
              <p className="text-sm text-gray-600">We verify your license and insurance.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD60A] text-white">3</div>
              <h3 className="mt-3 font-semibold">Receive Leads</h3>
              <p className="text-sm text-gray-600">Start receiving qualified customer requests.</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Apply Now</h2>
          {submitted && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              ✓ Application submitted! We&apos;ll review and contact you within 48 hours.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                placeholder="ABC Plumbing"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                  placeholder="contact@abcplumbing.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">License Number (optional)</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                placeholder="PL-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website (optional)</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                placeholder="https://www.abcplumbing.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Areas (cities/zip codes) *</label>
              <input
                type="text"
                required
                value={formData.serviceAreas}
                onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                placeholder="e.g., Chicago, IL; Evanston, IL; 60601"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tell us about your business *</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                placeholder="Describe your services, years of experience, team size, etc."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#FFD60A] px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}