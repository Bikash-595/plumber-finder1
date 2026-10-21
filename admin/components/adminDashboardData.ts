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
      { label: "Overview", href: "/", icon: FaHome },
      { label: "Live Statistics", href: "/live-statistics", icon: FaChartLine },
      { label: "Revenue Analytics", href: "/revenue-analytics", icon: FaDollarSign },
      { label: "Booking Analytics", href: "/booking-analytics", icon: FaClipboardList },
      { label: "User Activity", href: "/user-activity", icon: FaUsers },
      { label: "New Registrations", href: "/new-registrations", icon: FaUserTie },
      { label: "Service Requests", href: "/service-requests", icon: FaBell },
      { label: "Pending Approvals", href: "/pending-approvals", icon: FaShieldAlt },
      { label: "Reports & Complaints", href: "/reports", icon: FaBullhorn },
    ],
  },
  {
    label: "User Controls",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: FaUsers,
        subItems: [
          { label: "All Users", href: "/users" },
          { label: "Active Users", href: "/users?tab=active" },
          { label: "Suspended Users", href: "/users?tab=suspended" },
          { label: "Verified Users", href: "/users?tab=verified" },
          { label: "Guest Users", href: "/users?tab=guest" },
          { label: "Premium Users", href: "/users?tab=premium" },
          { label: "Recently Joined", href: "/users?tab=recent" },
          { label: "Blocked Users", href: "/users?tab=blocked" },
          { label: "User Management", href: "/users?tab=management" },
          { label: "User Reviews", href: "/users?tab=reviews" },
          { label: "Wallet Transactions", href: "/users?tab=wallet" },
          { label: "Referral Activity", href: "/users?tab=referrals" },
          { label: "Notifications", href: "/users?tab=notifications" },
        ],
      },
    ],
  },
  {
    label: "Company Controls",
    items: [
      {
        label: "Companies",
        href: "/companies",
        icon: FaBuilding,
    
        subItems: [
          { label: "All Companies", href: "/companies" },
          { label: "Pending Approval", href: "/companies?tab=pending" },
          { label: "Verified Companies", href: "/companies?tab=verified" },
          { label: "Featured Companies", href: "/companies?tab=featured" },
          { label: "Premium Companies", href: "/companies?tab=premium" },
          { label: "Rejected Companies", href: "/companies?tab=rejected" },
          { label: "Suspended Companies", href: "/companies?tab=suspended" },
          { label: "Company Management", href: "/companies?tab=management" },
          { label: "Services", href: "/companies?tab=services" },
          { label: "Employee Verification", href: "/companies?tab=employees" },
          { label: "Company Analytics", href: "/companies?tab=analytics" },
          { label: "Subscription Plans", href: "/companies?tab=subscriptions" },
        ],
      },
    ],
  },
  {
    label: "Freelancer Controls",
    items: [
      {
        label: "Freelancers",
        href: "/freelancers",
        icon: FaUserTie,
        subItems: [
          { label: "All Freelancers", href: "/freelancers" },
          { label: "Pending Approval", href: "/freelancers?tab=pending" },
          { label: "Verified Freelancers", href: "/freelancers?tab=verified" },
          { label: "Top Rated Freelancers", href: "/freelancers?tab=top-rated" },
          { label: "Nearby Freelancers", href: "/freelancers?tab=nearby" },
          { label: "Online Freelancers", href: "/freelancers?tab=online" },
          { label: "Suspended Freelancers", href: "/freelancers?tab=suspended" },
          { label: "Work Management", href: "/freelancers?tab=work" },
          { label: "Earnings", href: "/freelancers?tab=earnings" },
          { label: "Ratings & Reviews", href: "/freelancers?tab=reviews" },
          { label: "Dispute Cases", href: "/freelancers?tab=disputes" },
        ],
      },
    ],
  },
  {
    label: "Booking Management",
    items: [
      {
        label: "Bookings",
        href: "/bookings",
        icon: FaClipboardList,
        stats: [
          { label: "Pending", value: "46" },
          { label: "Confirmed", value: "1,200" },
          { label: "Completed", value: "9,430" },
        ],
        subItems: [
          { label: "All Bookings", href: "/bookings" },
          { label: "Pending Bookings", href: "/bookings?tab=pending" },
          { label: "Confirmed Bookings", href: "/bookings?tab=confirmed" },
          { label: "Ongoing Services", href: "/bookings?tab=ongoing" },
          { label: "Completed Services", href: "/bookings?tab=completed" },
          { label: "Cancelled Services", href: "/bookings?tab=cancelled" },
          { label: "Emergency Bookings", href: "/bookings?tab=emergency" },
          { label: "Assign Plumber", href: "/bookings?tab=assign" },
          { label: "Reschedule Booking", href: "/bookings?tab=reschedule" },
          { label: "Refund Booking", href: "/bookings?tab=refund" },
        ],
      },
    ],
  },
  {
    label: "Payments",
    items: [
      {
        label: "Payments",
        href: "/payments",
        icon: FaDollarSign,
        stats: [
          { label: "Total Revenue", value: "$312K" },
          { label: "Pending Withdrawals", value: "14" },
          { label: "Refund Requests", value: "9" },
        ],
        subItems: [
          { label: "All Transactions", href: "/payments" },
          { label: "Successful Payments", href: "/payments?tab=successful" },
          { label: "Failed Payments", href: "/payments?tab=failed" },
          { label: "Refund Requests", href: "/payments?tab=refunds" },
          { label: "Pending Withdrawals", href: "/payments?tab=withdrawals" },
          { label: "Commission Settings", href: "/payments?tab=commission" },
          { label: "Subscription Revenue", href: "/payments?tab=subscriptions" },
        ],
      },
    ],
  },
  {
    label: "Reviews & Ratings",
    items: [
      {
        label: "Reviews",
        href: "/reviews",
        icon: FaStar,
        stats: [
          { label: "All Reviews", value: "12,390" },
          { label: "Positive", value: "10,840" },
          { label: "Reported", value: "220" },
        ],
        subItems: [
          { label: "All Reviews", href: "/reviews" },
          { label: "Positive Reviews", href: "/reviews?tab=positive" },
          { label: "Negative Reviews", href: "/reviews?tab=negative" },
          { label: "Reported Reviews", href: "/reviews?tab=reported" },
          { label: "Moderation", href: "/reviews?tab=moderation" },
          { label: "Dispute Handling", href: "/reviews?tab=disputes" },
        ],
      },
    ],
  },
  {
    label: "Service Categories",
    items: [
      {
        label: "Categories",
        href: "/categories",
        icon: FaListAlt,
        stats: [
          { label: "Active Categories", value: "16" },
          { label: "Emergency Services", value: "5" },
          { label: "Commercial Services", value: "4" },
        ],
        subItems: [
          { label: "Pipe Repair", href: "/categories?tab=pipe-repair" },
          { label: "Drain Cleaning", href: "/categories?tab=drain-cleaning" },
          { label: "Leak Detection", href: "/categories?tab=leak-detection" },
          { label: "Bathroom Installation", href: "/categories?tab=bathroom-installation" },
          { label: "Water Heater Repair", href: "/categories?tab=water-heater" },
          { label: "Sewer Repair", href: "/categories?tab=sewer-repair" },
          { label: "Emergency Plumbing", href: "/categories?tab=emergency" },
        ],
      },
    ],
  },
  {
    label: "Location Management",
    items: [
      {
        label: "Locations",
        href: "/locations",
        icon: FaMapMarkedAlt,
        stats: [
          { label: "Countries", value: "5" },
          { label: "States", value: "22" },
          { label: "Cities", value: "120" },
        ],
        subItems: [
          { label: "Countries", href: "/locations?tab=countries" },
          { label: "States", href: "/locations?tab=states" },
          { label: "Cities", href: "/locations?tab=cities" },
          { label: "ZIP Codes", href: "/locations?tab=zips" },
          { label: "Service Areas", href: "/locations?tab=areas" },
          { label: "Geo Controls", href: "/locations?tab=geo" },
        ],
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        label: "Promotions",
        href: "/marketing",
        icon: FaBullhorn,
        stats: [
          { label: "Active Campaigns", value: "12" },
          { label: "Coupons", value: "34" },
          { label: "Featured Listings", value: "18" },
        ],
        subItems: [
          { label: "Coupon Codes", href: "/marketing?tab=coupons" },
          { label: "Referral Programs", href: "/marketing?tab=referrals" },
          { label: "Seasonal Discounts", href: "/marketing?tab=discounts" },
          { label: "Featured Listings", href: "/marketing?tab=featured" },
          { label: "Homepage Banners", href: "/marketing?tab=banners" },
          { label: "Ad Integrations", href: "/marketing?tab=ads" },
          { label: "SEO Management", href: "/marketing?tab=seo" },
        ],
      },
    ],
  },
  {
    label: "Support & Complaints",
    items: [
      {
        label: "Support",
        href: "/support",
        icon: FaLifeRing,
        stats: [
          { label: "Open Tickets", value: "18" },
          { label: "Priority Cases", value: "6" },
          { label: "Fraud Reports", value: "3" },
        ],
        subItems: [
          { label: "Open Tickets", href: "/support?tab=open" },
          { label: "Closed Tickets", href: "/support?tab=closed" },
          { label: "Priority Tickets", href: "/support?tab=priority" },
          { label: "Escalated Cases", href: "/support?tab=escalated" },
          { label: "User Complaints", href: "/support?tab=user-complaints" },
          { label: "Company Complaints", href: "/support?tab=company-complaints" },
          { label: "Freelancer Complaints", href: "/support?tab=freelancer-complaints" },
          { label: "Fraud Reports", href: "/support?tab=fraud" },
        ],
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Settings", href: "/settings", icon: FaCog },
      { label: "Security", href: "/security", icon: FaShieldAlt },
      { label: "Notifications", href: "/notifications", icon: FaBell },
    ],
  },
];

export const adminQuickLinks = [
  { label: "Overview", href: "/" },
  { label: "Users", href: "/users" },
  { label: "Companies", href: "/companies" },
  { label: "Freelancers", href: "/freelancers" },
  { label: "Bookings", href: "/bookings" },
  { label: "Payments", href: "/payments" },
  { label: "Support", href: "/support" },
];
