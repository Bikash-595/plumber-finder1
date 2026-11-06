"use client";

import { FaCalendarTimes } from "react-icons/fa";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { useCompanyData } from "../companyApi";
import { growthApi, type Availability } from "../growthApi";
import AvailabilityForm from "@/components/company-dashboard/availability/company-availability/AvailabilityForm";

/** /company-dashboard/availability — when customers can book you. */
export default function CompanyAvailability() {
  const { data, error, loading, setData } = useCompanyData("company-availability", growthApi.availability);
  return (
    <div className="space-y-6">
      <PageHeader icon={FaCalendarTimes} title="Availability" description="Control when customers can book you: pause new requests, block days off, cap jobs per day and set minimum notice." />
      <Notice>{error}</Notice>
      {loading || !data ? <SkeletonRows rows={3} className="h-32" /> : <AvailabilityForm key={JSON.stringify(data)} initial={data} onSaved={setData} />}
    </div>
  );
}
