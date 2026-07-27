"use client";

import { useState } from "react";

export default function ContactNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#FFD60A]/10 to-[#B1A606]/10 border border-gray-200 p-8 text-center shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 font-heading">Stay in the loop</h2>
      <p className="mt-2 text-gray-600">Get plumbing tips, special offers, and emergency alerts.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 outline-none focus:border-[#FFD60A]"
        />
        <button
          type="submit"
          className="rounded-full bg-[#FFD60A] px-6 py-2 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Subscribe
        </button>
      </form>
      {subscribed && (
        <p className="mt-3 text-sm text-green-600">✓ Thanks for subscribing!</p>
      )}
    </div>
  );
}