"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";

export type MapPin = { position: number; name: string; url: string; lat: number; lng: number };

function Fit({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 1) map.setView([pins[0].lat, pins[0].lng], 12);
    else if (pins.length) map.fitBounds(L.latLngBounds(pins.map((pin) => [pin.lat, pin.lng] as [number, number])), { padding: [28, 28], maxZoom: 13 });
  }, [map, pins]);
  return null;
}

/** OpenStreetMap with a marker (labelled with its rank) for each ranked provider that has a known location. Browser only. */
export default function RankingMap({ pins, height }: { pins: MapPin[]; height: number }) {
  return (
    <MapContainer center={[39.5, -98.35]} zoom={4} scrollWheelZoom={false} style={{ height, width: "100%" }} className="z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
      <Fit pins={pins} />
      {pins.map((pin) => (
        <CircleMarker key={pin.url} center={[pin.lat, pin.lng]} radius={11} pathOptions={{ color: "#fff", weight: 3, fillColor: "#0b1f3b", fillOpacity: 1 }} eventHandlers={{ click: () => window.location.assign(pin.url) }}>
          {/* One always-visible label per marker: its rank and name. */}
          <Tooltip direction="top" offset={[0, -10]} permanent><b>{pin.position}.</b> {pin.name}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
