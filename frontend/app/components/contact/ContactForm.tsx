"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCommentDots } from "react-icons/fa";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", service: "general", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-xl p-6 sm:p-8 transition hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
        <span className="text-[#FFD60A]">✉️</span> Send us a message
      </h2>
      <p className="mt-1 text-gray-500">Fill out the form and we’ll reply within 24 hours.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full rounded-full border border-gray-300 bg-gray-50/50 pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
          />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email Address"
            className="w-full rounded-full border border-gray-300 bg-gray-50/50 pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
          />
        </div>

        <div className="relative">
          <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (optional)"
            className="w-full rounded-full border border-gray-300 bg-gray-50/50 pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
          />
        </div>

        <div>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 bg-gray-50/50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
          >
            <option value="general">General Inquiry</option>
            <option value="emergency">Emergency Plumbing</option>
            <option value="quote">Request a Quote</option>
            <option value="partnership">Company Partnership</option>
            <option value="support">Customer Support</option>
          </select>
        </div>

        <div className="relative">
          <FaCommentDots className="absolute left-4 top-5 text-gray-400" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Tell us about your plumbing needs..."
            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-[#FFD60A] to-[#B1A606] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message →"}
        </button>

        {submitted && (
          <div className="rounded-full bg-green-100 p-2 text-center text-sm text-green-700">
            ✓ Message sent! We’ll get back to you soon.
          </div>
        )}
      </form>
    </div>
  );
}