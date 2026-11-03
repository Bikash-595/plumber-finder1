import { BookingSettingsForm } from "@/components/company-dashboard/business-profile/forms/BusinessProfileForms";
import TimeSlotsEditor from "@/components/company-dashboard/business-profile/booking/TimeSlotsEditor";

/** Booking Settings: how customers book, and the visit times they can choose. */
export default function Page() {
  return (
    <div className="space-y-6">
      <TimeSlotsEditor apiEndpoint="/companies/booking" />
      <BookingSettingsForm />
    </div>
  );
}
