"use client";

import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaClock } from "react-icons/fa";

export default function BookingsPage() {
  const bookings = [
    {
      id: 1,
      plumber: "Elite Los Angeles Plumbing",
      service: "Pipe Repair & Replacement",
      date: "March 15, 2024",
      time: "10:00 AM - 12:00 PM",
      location: "123 Main St, Los Angeles, CA",
      status: "completed",
      price: "$250",
    },
    {
      id: 2,
      plumber: "Premier New York Services",
      service: "Faucet Installation",
      date: "March 20, 2024",
      time: "2:00 PM - 3:30 PM",
      location: "456 Park Ave, New York, NY",
      status: "scheduled",
      price: "$150",
    },
    {
      id: 3,
      plumber: "Modern Chicago Plumbing",
      service: "Water Heater Maintenance",
      date: "March 25, 2024",
      time: "9:00 AM - 10:00 AM",
      location: "789 Michigan Ave, Chicago, IL",
      status: "pending",
      price: "$120",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="h-4 w-4" />;
      case "scheduled":
        return <FaCalendarAlt className="h-4 w-4" />;
      case "pending":
        return <FaClock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">View and manage your plumbing service bookings.</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{booking.plumber}</h3>
                <p className="mt-1 text-sm text-gray-600">{booking.service}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="h-4 w-4 text-[#FFD60A]" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="h-4 w-4 text-[#FFD60A]" />
                    {booking.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="h-4 w-4 text-[#FFD60A]" />
                    {booking.location}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </div>
                <p className="text-2xl font-bold text-gray-900">{booking.price}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
              <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                View Details
              </button>
              {booking.status === "scheduled" && (
                <button className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
