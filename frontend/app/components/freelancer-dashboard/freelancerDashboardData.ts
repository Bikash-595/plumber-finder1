import {
  FaAddressBook, FaBell, FaBolt, FaBriefcase, FaCalendarAlt, FaCalendarCheck, FaChartLine, FaClock, FaCog, FaCommentDots, FaCreditCard,
  FaFileInvoiceDollar, FaHome, FaIdCard, FaImages, FaInfoCircle, FaMapMarkedAlt, FaMapMarkerAlt, FaNewspaper, FaPhoneAlt, FaQuestionCircle,
  FaRegUser, FaShareAlt, FaShieldAlt, FaStar, FaTag, FaThLarge, FaTools, FaUsers,
} from "react-icons/fa";

export type FreelancerSidebarState = "open" | "icons";

export const freelancerNavSections = [
  {
    label: "Command Center",
    items: [
      { label: "Dashboard", href: "/freelancer", icon: FaHome },
      { label: "Analytics", href: "/freelancer/analytics", icon: FaChartLine },
      { label: "Notifications", href: "/freelancer/notifications", icon: FaBell },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Bookings", href: "/freelancer/bookings", icon: FaCalendarCheck },
      { label: "Leads", href: "/freelancer/leads", icon: FaAddressBook },
      { label: "Jobs", href: "/freelancer/jobs", icon: FaBriefcase },
      { label: "Schedule", href: "/freelancer/schedule", icon: FaCalendarAlt },
      { label: "Messages", href: "/freelancer/messages", icon: FaCommentDots },
      { label: "Customers", href: "/freelancer/customers", icon: FaUsers },
      { label: "Quotes", href: "/freelancer/quotes", icon: FaFileInvoiceDollar },
      { label: "Availability", href: "/freelancer/availability", icon: FaClock },
      { label: "Saved Replies", href: "/freelancer/saved-replies", icon: FaBolt },
    ],
  },
  {
    // Every section of the public profile.
    label: "Business Profile",
    items: [
      { label: "All Profile Sections", href: "/freelancer/business-profile", icon: FaThLarge },
      { label: "My Profile", href: "/freelancer/profile", icon: FaRegUser },
      { label: "Your Profile & Photo", href: "/freelancer/business-profile/header-profile", icon: FaIdCard },
      { label: "Overview", href: "/freelancer/business-profile/overview", icon: FaInfoCircle },
      { label: "Services & Pricing", href: "/freelancer/business-profile/services", icon: FaTools },
      { label: "Work Gallery", href: "/freelancer/business-profile/gallery", icon: FaImages },
      { label: "Previous Projects", href: "/freelancer/business-profile/projects", icon: FaBriefcase },
      { label: "Reviews & Ratings", href: "/freelancer/business-profile/reviews", icon: FaStar },
      { label: "FAQs", href: "/freelancer/business-profile/faqs", icon: FaQuestionCircle },
      { label: "Service Areas", href: "/freelancer/business-profile/service-areas", icon: FaMapMarkedAlt },
      { label: "Google Maps", href: "/freelancer/business-profile/maps", icon: FaMapMarkerAlt },
      { label: "Opening Hours", href: "/freelancer/business-profile/opening-hours", icon: FaClock },
      { label: "Contact Information", href: "/freelancer/business-profile/contact", icon: FaPhoneAlt },
      { label: "Social Links", href: "/freelancer/business-profile/social-links", icon: FaShareAlt },
      { label: "Booking Settings", href: "/freelancer/business-profile/booking", icon: FaCalendarAlt },
      { label: "Special Offers", href: "/freelancer/business-profile/offers", icon: FaTag },
      { label: "Blogs", href: "/freelancer/business-profile/blogs", icon: FaNewspaper },
      { label: "Documents & Verification", href: "/freelancer/business-profile/verification", icon: FaShieldAlt },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Billing", href: "/freelancer/billing", icon: FaCreditCard },
      { label: "Settings", href: "/freelancer/settings", icon: FaCog },
    ],
  },
];
