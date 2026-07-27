"use client";

import { useState } from "react";
import LocationPicker from "../LocationPicker";

export default function ServiceAreasSection() {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("25");
  const [areas, setAreas] = useState("");
  return <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-bold text-gray-900">Service Areas</h2><p className="mt-2 text-sm text-gray-600">Set a primary location, service radius, and covered areas.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="md:col-span-2 text-sm font-semibold text-gray-700">Primary address<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="123 Main St, Dallas, TX" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Latitude<input value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="32.7767" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Longitude<input value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="-96.7970" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Service radius (miles)<input type="number" value={radius} onChange={(event) => setRadius(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-gray-700">Cities / areas covered<input value={areas} onChange={(event) => setAreas(event.target.value)} placeholder="Dallas, Plano, Irving" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" /></label></div><LocationPicker address={address} latitude={latitude} longitude={longitude} onChange={({ latitude: nextLatitude, longitude: nextLongitude }) => { setLatitude(nextLatitude); setLongitude(nextLongitude); }} /><button type="button" className="mt-5 rounded-xl bg-[#FFD60A] px-5 py-3 text-sm font-bold text-[#0b1f3b]">Save Service Area</button></section>;
}
