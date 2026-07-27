
"use client";

import { useState } from "react";
import { Plumber } from "@/components/find/types";
import { FaCalendarAlt, FaClock, FaWrench, FaCommentDots } from "react-icons/fa";

export default function BookingWidget({ plumber }: { plumber: Plumber }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = () => {
    alert(`Booking request sent to ${plumber.companyName}!\n\nService: ${selectedService || "Not specified"}\nDate: ${selectedDate}\nTime: ${selectedTime}\nMessage: ${message || "None"}`);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-all hover:shadow-xl sm:p-6 lg:sticky lg:top-8">
      <h3 className="text-xl font-bold text-gray-900">📋 Book This Plumber</h3>
      <p className="mt-1 text-sm text-gray-500">Fill in your details and we&apos;ll connect you with {plumber.companyName}.</p>

      <div className="mt-5 space-y-4">
        {/* Service selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Needed</label>
          <div className="relative mt-1">
            <FaWrench className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
            >
              <option value="">Select a service</option>
              {plumber.services.slice(0, 5).map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
              {plumber.services.length > 5 && <option value="other">Other</option>}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
          <div className="relative mt-1">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
          <div className="relative mt-1">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
            >
              <option value="">Select time</option>
              <option>8:00 AM – 10:00 AM</option>
              <option>10:00 AM – 12:00 PM</option>
              <option>1:00 PM – 3:00 PM</option>
              <option>3:00 PM – 5:00 PM</option>
              <option>5:00 PM – 7:00 PM</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Information (optional)</label>
          <div className="relative mt-1">
            <FaCommentDots className="absolute left-3 top-3 text-gray-400" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Describe your issue or any special requests..."
              className="w-full rounded-2xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]"
            />
          </div>
        </div>

        <button
          onClick={handleBooking}
          className="w-full rounded-full bg-gradient-to-r from-[#FFD60A] to-[#B1A606] py-3 font-semibold text-white shadow-md transition hover:brightness-105 hover:shadow-lg active:scale-[0.98]"
        >
          Send Request →
        </button>
        <p className="text-center text-xs text-gray-400">
          ✅ No commitment • 📞 Free estimate • 🔒 Your data is safe
        </p>
      </div>
    </div>
  );
}
