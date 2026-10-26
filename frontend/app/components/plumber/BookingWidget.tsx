
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isCustomerSignedIn, userApi } from "@/components/utils/userApi";
import { Plumber } from "@/components/find/types";
import { FaCalendarAlt, FaClock, FaWrench, FaCommentDots, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function BookingWidget({ plumber }: { plumber: Plumber }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ tone: "success" | "error" | "login"; text: string } | null>(null);
  const [highlight, setHighlight] = useState(false);

  // "Book" on a service (Services section) picks it here.
  useEffect(() => {
    let timer = 0;
    const pick = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;
      setSelectedService(plumber.services.includes(name) ? name : "other");
      setResult(null);
      setHighlight(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHighlight(false), 1600);
    };
    window.addEventListener("plumberfinder:book-service", pick);
    return () => { window.removeEventListener("plumberfinder:book-service", pick); window.clearTimeout(timer); };
  }, [plumber.services]);

  // Signed-in customers send a real booking request (it appears in their dashboard); guests are asked to log in.
  const handleBooking = async () => {
    if (!isCustomerSignedIn()) return setResult({ tone: "login", text: "Log in with a customer account to send a booking request." });
    if (!selectedService) return setResult({ tone: "error", text: "Please choose the service you need." });
    if (!/\d{7,}/.test(phone.replace(/\D/g, ""))) return setResult({ tone: "error", text: "Enter a phone number the plumber can reach you on." });
    if (address.trim().length < 5) return setResult({ tone: "error", text: "Enter the address where the work is needed." });
    setBusy(true);
    setResult(null);
    try {
      // Freelancers and companies each receive their own requests to accept or decline.
      const { data } = await userApi.requestBooking({
        providerType: plumber.providerType ?? "company", providerId: plumber.id, providerName: plumber.companyName,
        service: selectedService === "other" ? "Other plumbing service" : selectedService,
        scheduledDate: selectedDate || undefined, timeSlot: selectedTime || undefined, details: message || undefined,
        phone: phone.trim(), address: address.trim(),
      });
      setResult({ tone: "success", text: `Request ${data.reference} sent to ${plumber.companyName}. You'll be notified when they accept it.` });
      setSelectedDate(""); setSelectedTime(""); setSelectedService(""); setMessage("");
    } catch (caught) {
      setResult({ tone: "error", text: caught instanceof Error ? caught.message : "Could not send the request." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id="booking" className={`scroll-mt-24 rounded-2xl border bg-white p-5 shadow-lg transition-all hover:shadow-xl sm:p-6 lg:sticky lg:top-32 ${highlight ? "border-[#FFD60A] ring-4 ring-[#FFD60A]/40" : "border-gray-200"}`}>
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
              {plumber.services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
              <option value="other">Something else</option>
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
              min={new Date().toISOString().slice(0, 10)}
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

        {/* Contact: shared with the plumber once they accept */}
        <div>
          <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
          <div className="relative mt-1">
            <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="booking-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 512-555-0100" className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]" />
          </div>
        </div>
        <div>
          <label htmlFor="booking-address" className="block text-sm font-medium text-gray-700">Service address <span className="text-red-500">*</span></label>
          <div className="relative mt-1">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="booking-address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, ZIP" className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]" />
          </div>
          <p className="mt-1 text-xs text-gray-400">Shared with {plumber.companyName} only after they accept.</p>
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
          type="button"
          onClick={handleBooking}
          disabled={busy}
          className="w-full rounded-full bg-gradient-to-r from-[#FFD60A] to-[#B1A606] py-3 font-semibold text-[#0b1f3b] shadow-md transition hover:brightness-105 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send Request →"}
        </button>
        {result && (
          <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.tone === "success" ? "bg-emerald-50 text-emerald-700" : result.tone === "login" ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-700"}`}>
            {result.text}{" "}
            {result.tone === "success" && <Link href="/dashboard/bookings" className="font-semibold underline">View bookings</Link>}
            {result.tone === "login" && <Link href="/login" className="font-semibold underline">Log in</Link>}
          </p>
        )}
        <p className="text-center text-xs text-gray-400">
          ✅ No commitment • 📞 Free estimate • 🔒 Your data is safe
        </p>
      </div>
    </div>
  );
}
