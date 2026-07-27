import {
  FaBell,
  FaBuilding,
  FaBullhorn,
  FaChartBar,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaDollarSign,
  FaHome,
  FaLifeRing,
  FaListAlt,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export type AdminSidebarState = "open" | "icons" | "closed";

export type AdminNavSubItem = {
  label: string;
  href: string;
};

export type AdminNavItem = {
  label: string;
  href: string;
  icon: IconType;
  stats?: { label: string; value: string }[];
  subItems?: AdminNavSubItem[];
};

export const adminNavSections = [
  {
    label: "Dashboard",
    items: [
      { label: "Overview", href: "/admin", icon: FaHome },
      { label: "Live Statistics", href: "/admin/live-statistics", icon: FaChartLine },
      { label: "Revenue Analytics", href: "/admin/revenue-analytics", icon: FaDollarSign },
      { label: "Booking Analytics", href: "/admin/booking-analytics", icon: FaClipboardList },
      { label: "User Activity", href: "/admin/user-activity", icon: FaUsers },
      { label: "New Registrations", href: "/admin/new-registrations", icon: FaUserTie },
      { label: "Service Requests", href: "/admin/service-requests", icon: FaBell },
      { label: "Pending Approvals", href: "/admin/pending-approvals", icon: FaShieldAlt },
      { label: "Reports & Complaints", href: "/admin/reports", icon: FaBullhorn },
    ],
  },
  {
    label: "User Controls",
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: FaUsers,
        subItems: [
          { label: "All Users", href: "/admin/users" },
          { label: "Active Users", href: "/admin/users?tab=active" },
          { label: "Suspended Users", href: "/admin/users?tab=suspended" },
          { label: "Verified Users", href: "/admin/users?tab=verified" },
          { label: "Guest Users", href: "/admin/users?tab=guest" },
          { label: "Premium Users", href: "/admin/users?tab=premium" },
          { label: "Recently Joined", href: "/admin/users?tab=recent" },
          { label: "Blocked Users", href: "/admin/users?tab=blocked" },
          { label: "User Management", href: "/admin/users?tab=management" },
          { label: "User Reviews", href: "/admin/users?tab=reviews" },
          { label: "Wallet Transactions", href: "/admin/users?tab=wallet" },
          { label: "Referral Activity", href: "/admin/users?tab=referrals" },
          { label: "Notifications", href: "/admin/users?tab=notifications" },
        ],
      },
    ],
  },
  {
    label: "Company Controls",
    items: [
      {
        label: "Companies",
        href: "/admin/companies",
        icon: FaBuilding,
    
        subItems: [
          { label: "All Companies", href: "/admin/companies" },
          { label: "Pending Approval", href: "/admin/companies?tab=pending" },
          { label: "Verified Companies", href: "/admin/companies?tab=verified" },
          { label: "Featured Companies", href: "/admin/companies?tab=featured" },
          { label: "Premium Companies", href: "/admin/companies?tab=premium" },
          { label: "Rejected Companies", href: "/admin/companies?tab=rejected" },
          { label: "Suspended Companies", href: "/admin/companies?tab=suspended" },
          { label: "Company Management", href: "/admin/companies?tab=management" },
          { label: "Services", href: "/admin/companies?tab=services" },
          { label: "Employee Verification", href: "/admin/companies?tab=employees" },
          { label: "Company Analytics", href: "/admin/companies?tab=analytics" },
          { label: "Subscription Plans", href: "/admin/companies?tab=subscriptions" },
        ],
      },
    ],
  },
  {
    label: "Freelancer Controls",
    items: [
      {
        label: "Freelancers",
        href: "/admin/freelancers",
        icon: FaUserTie,
        subItems: [
          { label: "All Freelancers", href: "/admin/freelancers" },
          { label: "Pending Approval", href: "/admin/freelancers?tab=pending" },
          { label: "Verified Freelancers", href: "/admin/freelancers?tab=verified" },
          { label: "Top Rated Freelancers", href: "/admin/freelancers?tab=top-rated" },
          { label: "Nearby Freelancers", href: "/admin/freelancers?tab=nearby" },
          { label: "Online Freelancers", href: "/admin/freelancers?tab=online" },
          { label: "Suspended Freelancers", href: "/admin/freelancers?tab=suspended" },
          { label: "Work Management", href: "/admin/freelancers?tab=work" },
          { label: "Earnings", href: "/admin/freelancers?tab=earnings" },
          { label: "Ratings & Reviews", href: "/admin/freelancers?tab=reviews" },
          { label: "Dispute Cases", href: "/admin/freelancers?tab=disputes" },
        ],
      },
    ],
  },
  {
    label: "Booking Management",
    items: [
      {
        label: "Bookings",
        href: "/admin/bookings",
        icon: FaClipboardList,
        stats: [
          { label: "Pending", value: "46" },
          { label: "Confirmed", value: "1,200" },
          { label: "Completed", value: "9,430" },
        ],
        subItems: [
          { label: "All Bookings", href: "/admin/bookings" },
          { label: "Pending Bookings", href: "/admin/bookings?tab=pending" },
          { label: "Confirmed Bookings", href: "/admin/bookings?tab=confirmed" },
          { label: "Ongoing Services", href: "/admin/bookings?tab=ongoing" },
          { label: "Completed Services", href: "/admin/bookings?tab=completed" },
          { label: "Cancelled Services", href: "/admin/bookings?tab=cancelled" },
          { label: "Emergency Bookings", href: "/admin/bookings?tab=emergency" },
          { label: "Assign Plumber", href: "/admin/bookings?tab=assign" },
          { label: "Reschedule Booking", href: "/admin/bookings?tab=reschedule" },
          { label: "Refund Booking", href: "/admin/bookings?tab=refund" },
        ],
      },
    ],
  },
  {
    label: "Payments",
    items: [
      {
        label: "Payments",
        href: "/admin/payments",
        icon: FaDollarSign,
        stats: [
          { label: "Total Revenue", value: "$312K" },
          { label: "Pending Withdrawals", value: "14" },
          { label: "Refund Requests", value: "9" },
        ],
        subItems: [
          { label: "All Transactions", href: "/admin/payments" },
          { label: "Successful Payments", href: "/admin/payments?tab=successful" },
          { label: "Failed Payments", href: "/admin/payments?tab=failed" },
          { label: "Refund Requests", href: "/admin/payments?tab=refunds" },
          { label: "Pending Withdrawals", href: "/admin/payments?tab=withdrawals" },
          { label: "Commission Settings", href: "/admin/payments?tab=commission" },
          { label: "Subscription Revenue", href: "/admin/payments?tab=subscriptions" },
        ],
      },
    ],
  },
  {
    label: "Reviews & Ratings",
    items: [
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: FaStar,
        stats: [
          { label: "All Reviews", value: "12,390" },
          { label: "Positive", value: "10,840" },
          { label: "Reported", value: "220" },
        ],
        subItems: [
          { label: "All Reviews", href: "/admin/reviews" },
          { label: "Positive Reviews", href: "/admin/reviews?tab=positive" },
          { label: "Negative Reviews", href: "/admin/reviews?tab=negative" },
          { label: "Reported Reviews", href: "/admin/reviews?tab=reported" },
          { label: "Moderation", href: "/admin/reviews?tab=moderation" },
          { label: "Dispute Handling", href: "/admin/reviews?tab=disputes" },
        ],
      },
    ],
  },
  {
    label: "Service Categories",
    items: [
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FaListAlt,
        stats: [
          { label: "Active Categories", value: "16" },
          { label: "Emergency Services", value: "5" },
          { label: "Commercial Services", value: "4" },
        ],
        subItems: [
          { label: "Pipe Repair", href: "/admin/categories?tab=pipe-repair" },
          { label: "Drain Cleaning", href: "/admin/categories?tab=drain-cleaning" },
          { label: "Leak Detection", href: "/admin/categories?tab=leak-detection" },
          { label: "Bathroom Installation", href: "/admin/categories?tab=bathroom-installation" },
          { label: "Water Heater Repair", href: "/admin/categories?tab=water-heater" },
          { label: "Sewer Repair", href: "/admin/categories?tab=sewer-repair" },
          { label: "Emergency Plumbing", href: "/admin/categories?tab=emergency" },
        ],
      },
    ],
  },
  {
    label: "Location Management",
    items: [
      {
        label: "Locations",
        href: "/admin/locations",
        icon: FaMapMarkedAlt,
        stats: [
          { label: "Countries", value: "5" },
          { label: "States", value: "22" },
          { label: "Cities", value: "120" },
        ],
        subItems: [
          { label: "Countries", href: "/admin/locations?tab=countries" },
          { label: "States", href: "/admin/locations?tab=states" },
          { label: "Cities", href: "/admin/locations?tab=cities" },
          { label: "ZIP Codes", href: "/admin/locations?tab=zips" },
          { label: "Service Areas", href: "/admin/locations?tab=areas" },
          { label: "Geo Controls", href: "/admin/locations?tab=geo" },
        ],
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        label: "Promotions",
        href: "/admin/marketing",
        icon: FaBullhorn,
        stats: [
          { label: "Active Campaigns", value: "12" },
          { label: "Coupons", value: "34" },
          { label: "Featured Listings", value: "18" },
        ],
        subItems: [
          { label: "Coupon Codes", href: "/admin/marketing?tab=coupons" },
          { label: "Referral Programs", href: "/admin/marketing?tab=referrals" },
          { label: "Seasonal Discounts", href: "/admin/marketing?tab=discounts" },
          { label: "Featured Listings", href: "/admin/marketing?tab=featured" },
          { label: "Homepage Banners", href: "/admin/marketing?tab=banners" },
          { label: "Ad Integrations", href: "/admin/marketing?tab=ads" },
          { label: "SEO Management", href: "/admin/marketing?tab=seo" },
        ],
      },
    ],
  },
  {
    label: "Support & Complaints",
    items: [
      {
        label: "Support",
        href: "/admin/support",
        icon: FaLifeRing,
        stats: [
          { label: "Open Tickets", value: "18" },
          { label: "Priority Cases", value: "6" },
          { label: "Fraud Reports", value: "3" },
        ],
        subItems: [
          { label: "Open Tickets", href: "/admin/support?tab=open" },
          { label: "Closed Tickets", href: "/admin/support?tab=closed" },
          { label: "Priority Tickets", href: "/admin/support?tab=priority" },
          { label: "Escalated Cases", href: "/admin/support?tab=escalated" },
          { label: "User Complaints", href: "/admin/support?tab=user-complaints" },
          { label: "Company Complaints", href: "/admin/support?tab=company-complaints" },
          { label: "Freelancer Complaints", href: "/admin/support?tab=freelancer-complaints" },
          { label: "Fraud Reports", href: "/admin/support?tab=fraud" },
        ],
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Settings", href: "/admin/settings", icon: FaCog },
      { label: "Security", href: "/admin/security", icon: FaShieldAlt },
      { label: "Notifications", href: "/admin/notifications", icon: FaBell },
    ],
  },
];

export const adminQuickLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Companies", href: "/admin/companies" },
  { label: "Freelancers", href: "/admin/freelancers" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Support", href: "/admin/support" },
];
