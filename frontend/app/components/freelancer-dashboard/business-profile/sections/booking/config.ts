import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// How customers can book you: instant booking, approval, emergencies, working days and cancellation policy.
// Saved to /api/freelancers/booking.
export const bookingConfig = {
  section: "freelancer-booking",
  apiEndpoint: "/freelancers/booking",
  title: "Booking Settings",
  description: "Control how customers can request appointments with you.",
  defaults: { instantBooking: true, approvalRequired: false, emergencyBooking: false, workingDays: "", timeSlots: "", cancellationPolicy: "" },
  fields: [
    { name: "instantBooking", label: "Instant Booking", type: "checkbox" },
    { name: "approvalRequired", label: "Approval Required", type: "checkbox" },
    { name: "emergencyBooking", label: "Emergency Booking", type: "checkbox" },
    { name: "workingDays", label: "Working Days" },
    { name: "timeSlots", label: "Timing notes (optional)", placeholder: "e.g. Evening visits on request" },
    { name: "cancellationPolicy", label: "Cancellation Policy", type: "textarea" },
  ] satisfies ProfileField[],
};
