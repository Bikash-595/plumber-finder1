import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

const contactMethods = [
  {
    icon: FaPhoneAlt,
    title: "Phone (24/7)",
    details: ["+1 (800) 555-PLUM", "+1 (800) 555-7586"],
    link: "tel:+18005557586",
    color: "text-[#FFD60A]",
  },
  {
    icon: FaEnvelope,
    title: "Email Support",
    details: ["hello@plumberfinder.com", "support@plumberfinder.com"],
    link: "mailto:hello@plumberfinder.com",
    color: "text-[#B1A606]",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Headquarters",
    details: ["123 Water Street, Suite 400", "New York, NY 10001"],
    link: "https://maps.google.com",
    color: "text-[#7B8F06]",
  },
  {
    icon: FaClock,
    title: "Business Hours",
    details: ["Mon-Fri: 8am - 8pm EST", "Sat-Sun: 10am - 4pm EST"],
    link: null,
    color: "text-gray-500",
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      {contactMethods.map((method, idx) => (
        <div
          key={idx}
          className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#FFD60A]/30"
        >
          <div className="flex items-start gap-4">
            <div className={`rounded-full bg-gray-100 p-3 ${method.color} transition group-hover:bg-[#FFD60A]/10`}>
              <method.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{method.title}</h3>
              {method.details.map((line, i) => (
                <p key={i} className="text-sm text-gray-600">{line}</p>
              ))}
              {method.link && (
                <a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-[#FFD60A] hover:underline"
                >
                  Get in touch →
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">Connect via Messaging Apps</h3>
        <div className="mt-3 flex gap-3">
          <a
            href="https://wa.me/18005557586"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm text-green-700 transition hover:bg-green-200"
          >
            <FaWhatsapp className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href="https://t.me/plumberfinder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 transition hover:bg-blue-200"
          >
            <FaTelegramPlane className="h-4 w-4" />
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}