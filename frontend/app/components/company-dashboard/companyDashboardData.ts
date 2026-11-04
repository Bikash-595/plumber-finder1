import { FaShareAlt,
  FaAddressBook,
  FaBell,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCalendarCheck,
  FaClock,
  FaChartLine,
  FaCog,
  FaCommentDots,
  FaFileInvoiceDollar,
  FaHome,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaCodeBranch,
  FaPhoneAlt,
  FaNewspaper,
  FaShieldAlt,
  FaEye,
  FaImages,
  FaIdCard,
  FaInfoCircle,
  FaThLarge,
  FaCrown,
  FaSearch,
  FaStar,
  FaTools,
  FaUserCog,
  FaUsers,
  FaQuestionCircle,
 
} from "react-icons/fa";
import { RiDiscountPercentLine } from "react-icons/ri";
import type { IconType } from "react-icons";

export type CompanySidebarState = "open" | "icons";

export type CompanyNavItem = {
  label: string;
  href: string;
  icon: IconType;
};

export const companyNavSections: { label: string; items: CompanyNavItem[] }[] = [
  {
    label: "Command Center",
    items: [
      { label: "Dashboard", href: "/company-dashboard", icon: FaHome },
      { label: "Analytics", href: "/company-dashboard/analytics", icon: FaChartLine },
      { label: "Notifications", href: "/company-dashboard/notifications", icon: FaBell },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Bookings", href: "/company-dashboard/bookings", icon: FaCalendarCheck },
      { label: "Leads", href: "/company-dashboard/leads", icon: FaAddressBook },
      { label: "Jobs", href: "/company-dashboard/jobs", icon: FaBriefcase },
      { label: "Schedule", href: "/company-dashboard/schedule", icon: FaCalendarAlt },
      { label: "Messages", href: "/company-dashboard/messages", icon: FaCommentDots },
      { label: "Customers", href: "/company-dashboard/customers", icon: FaUsers },
      { label: "Quotes", href: "/company-dashboard/quotes", icon: FaFileInvoiceDollar },
      { label: "Availability", href: "/company-dashboard/availability", icon: FaClock },
      { label: "Saved Replies", href: "/company-dashboard/saved-replies", icon: FaCommentDots },
    ],
  },
  {
    // Every section of the public profile, in the order customers see them.
    label: "Business Profile",
    items: [
      { label: "All Profile Sections", href: "/company-dashboard/business-profile", icon: FaThLarge },
      { label: "Company Profile", href: "/company-dashboard/profile", icon: FaBuilding },
      { label: "Header & Logo", href: "/company-dashboard/business-profile/header-profile", icon: FaIdCard },
      { label: "Company Overview", href: "/company-dashboard/business-profile/company-overview", icon: FaInfoCircle },
      { label: "Services & Pricing", href: "/company-dashboard/business-profile/services", icon: FaTools },
      { label: "Work Gallery", href: "/company-dashboard/business-profile/media", icon: FaImages },
      { label: "Previous Projects", href: "/company-dashboard/business-profile/projects", icon: FaBriefcase },
      { label: "Reviews & Ratings", href: "/company-dashboard/business-profile/reviews", icon: FaStar },
      { label: "Team Members", href: "/company-dashboard/business-profile/team", icon: FaUserCog },
      { label: "FAQs", href: "/company-dashboard/business-profile/faqs", icon: FaQuestionCircle },
      { label: "Service Areas", href: "/company-dashboard/business-profile/service-areas", icon: FaMapMarkedAlt },
      { label: "Google Maps", href: "/company-dashboard/business-profile/maps", icon: FaMapMarkerAlt },
      { label: "Branches", href: "/company-dashboard/business-profile/branches", icon: FaCodeBranch },
      { label: "Business Hours", href: "/company-dashboard/business-profile/business-hours", icon: FaClock },
      { label: "Contact Information", href: "/company-dashboard/business-profile/contact", icon: FaPhoneAlt },
      { label: "Social Links", href: "/company-dashboard/business-profile/social-links", icon: FaShareAlt },
      { label: "Booking Settings", href: "/company-dashboard/business-profile/booking", icon: FaCalendarAlt },
      { label: "Special Offers", href: "/company-dashboard/business-profile/offers", icon: RiDiscountPercentLine },
      { label: "SEO & Keywords", href: "/company-dashboard/business-profile/seo", icon: FaSearch },
      { label: "Blogs", href: "/company-dashboard/business-profile/blogs", icon: FaNewspaper },
      { label: "Documents & Verification", href: "/company-dashboard/business-profile/verification", icon: FaShieldAlt },
      { label: "Preview Profile", href: "/company-dashboard/business-profile/preview", icon: FaEye },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Premium & Billing", href: "/company-dashboard/premium", icon: FaCrown },
      { label: "Settings", href: "/company-dashboard/settings", icon: FaCog },
    ],
  },
];
