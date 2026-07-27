import {
  FaAddressBook,
  FaBell,
  FaBriefcase,
  FaCalendarAlt,
  FaChartLine,
  FaCommentDots,
  FaCog,
  FaFileInvoiceDollar,
  FaHome,
  FaRegUser,
  FaStar,
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
      { label: "Leads", href: "/freelancer/leads", icon: FaAddressBook },
      { label: "Jobs", href: "/freelancer/jobs", icon: FaBriefcase },
      { label: "Schedule", href: "/freelancer/schedule", icon: FaCalendarAlt },
      { label: "Messages", href: "/freelancer/messages", icon: FaCommentDots },
    ],
  },
  {
    label: "Profile",
    items: [
      { label: "Profile", href: "/freelancer/profile", icon: FaRegUser },
      { label: "Services", href: "/freelancer/services", icon: FaTools },
      { label: "Reviews", href: "/freelancer/reviews", icon: FaStar },
      { label: "Billing", href: "/freelancer/billing", icon: FaFileInvoiceDollar },
      { label: "Settings", href: "/freelancer/settings", icon: FaCog },
    ],
  },
];
