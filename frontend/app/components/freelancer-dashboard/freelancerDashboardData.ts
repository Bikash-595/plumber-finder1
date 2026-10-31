import {
  FaAddressBook,
  FaBell,
  FaBriefcase,
  FaCalendarAlt,
  FaCalendarCheck,
  FaChartLine,
  FaCommentDots,
  FaCog,
  FaFileInvoiceDollar,
  FaHome,
  FaRegUser,
  FaStar,
  FaTag,
  FaTools,
} from "react-icons/fa";

export type FreelancerSidebarState = "open" | "icons" | "closed";

export const freelancerNavSections = [
  {
    label: "Workspace",
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
    ],
  },
  {
    label: "Profile",
    items: [
      { label: "Business Profile", href: "/freelancer/business-profile", icon: FaRegUser },
      { label: "Services", href: "/freelancer/business-profile/services", icon: FaTools },
      { label: "Reviews & Ratings", href: "/freelancer/business-profile/reviews", icon: FaStar },
      { label: "Special Offers", href: "/freelancer/business-profile/offers", icon: FaTag },
      { label: "Billing", href: "/freelancer/billing", icon: FaFileInvoiceDollar },
      { label: "Settings", href: "/freelancer/settings", icon: FaCog },
    ],
  },
];
