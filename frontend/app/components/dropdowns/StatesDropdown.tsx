"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaLocationArrow,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

const usStates = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export function StatesDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredStates = usStates.filter((state) =>
    state.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Button */}
      <button className="flex items-center gap-2 px-2 py-1 rounded-md transition hover:text-yellow-400">

        {/* Location Icon */}
        {/* <FaMapMarkerAlt className="h-4 w-4" /> */}

        {/* Text */}
        <span>States</span>

        {/* Dynamic Arrow */}
        {open ? (
          <FaChevronUp className="h-3 w-3 transition duration-200" />
        ) : (
          <FaChevronDown className="h-3 w-3 transition duration-200" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
          <div className="w-[750px] bg-white rounded-2xl shadow-2xl p-5 animate-fadeIn">

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
              <FaLocationArrow className="text-yellow-500" />
              Select Your State
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* States Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
              {filteredStates.map((state) => (
                <Link
                  key={state}
                  href={`/states/${state.toLowerCase().replace(/\s/g, '-')}`}
                  className="group flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-yellow-50 hover:text-yellow-600"
                >
                  <FaMapMarkerAlt className="text-gray-400 text-xs group-hover:text-yellow-500 transition" />
                  {state}
                </Link>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}