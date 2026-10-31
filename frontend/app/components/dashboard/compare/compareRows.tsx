import type { Plumber } from "@/components/find/types";
import type { ListItem } from "@/components/utils/userApi";

export type Column = { item: ListItem; profile: Plumber | null | undefined };
export type CompareRow = {
  label: string;
  value: (column: Column) => React.ReactNode;
  /** Higher is better: the best column gets a "Best" badge. */
  score?: (column: Column) => number | undefined;
};

const list = (values?: string[], max = 6) => (values?.length ? (
  <span className="flex flex-wrap gap-1">
    {values.slice(0, max).map((value) => <span key={value} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{value}</span>)}
    {values.length > max && <span className="text-xs text-gray-500">+{values.length - max} more</span>}
  </span>
) : <span className="text-gray-400">Not listed</span>);
const yesNo = (value?: boolean) => (value === undefined ? <span className="text-gray-400">—</span> : value ? <span className="font-semibold text-emerald-700">Yes</span> : <span className="text-gray-500">No</span>);
const text = (value?: string | number | null) => (value === undefined || value === null || value === "" ? <span className="text-gray-400">—</span> : value);

// Rows use the full profile when it has loaded and fall back to the saved snapshot.
export const compareSections: { title: string; rows: CompareRow[] }[] = [
  {
    title: "Reputation & price",
    rows: [
      { label: "Rating", value: ({ item, profile }) => text((profile?.rating ?? item.rating)?.toFixed(1)), score: ({ item, profile }) => profile?.rating ?? item.rating },
      { label: "Reviews", value: ({ item, profile }) => text(profile?.reviewCount ?? item.reviewCount), score: ({ item, profile }) => profile?.reviewCount ?? item.reviewCount },
      { label: "Price range", value: ({ item, profile }) => text(profile?.priceRange || item.priceRange) },
      { label: "Current deal", value: ({ item, profile }) => text(profile?.discount || item.discount) },
      { label: "Response time", value: ({ profile }) => text(profile?.responseTime) },
    ],
  },
  {
    title: "Experience & trust",
    rows: [
      { label: "Verified", value: ({ profile }) => yesNo(profile?.isVerified) },
      { label: "Years in business", value: ({ profile }) => text(profile?.yearsInBusiness ? `${profile.yearsInBusiness} years` : undefined), score: ({ profile }) => profile?.yearsInBusiness },
      { label: "Licence", value: ({ profile }) => text(profile?.licenseNumber) },
      { label: "Insurance", value: ({ profile }) => text(profile?.insurance) },
      { label: "Warranty", value: ({ profile }) => text(profile?.warranty) },
      { label: "Certifications", value: ({ profile }) => list(profile?.certifications, 4) },
    ],
  },
  {
    title: "Services & availability",
    rows: [
      { label: "24/7 emergency", value: ({ profile }) => yesNo(profile?.isEmergency) },
      { label: "Services", value: ({ profile }) => list(profile?.services) },
      { label: "Location", value: ({ item, profile }) => text(profile?.location || item.location) },
      { label: "Team size", value: ({ profile }) => text(profile?.teamSize ? `${profile.teamSize} people` : undefined) },
    ],
  },
];

/** Index of the single best column for a row (ties and missing values give no winner). */
export function bestColumn(row: CompareRow, columns: Column[]) {
  if (!row.score || columns.length < 2) return -1;
  const scores = columns.map((column) => row.score!(column) ?? -Infinity);
  const top = Math.max(...scores);
  return top === -Infinity || scores.filter((score) => score === top).length > 1 ? -1 : scores.indexOf(top);
}
