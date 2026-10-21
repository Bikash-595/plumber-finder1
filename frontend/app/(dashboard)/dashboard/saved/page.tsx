import SavedList from "@/components/dashboard/SavedList";

export default function SavedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Plumbers</h1>
        <p className="mt-2 text-gray-600">Your favorite plumbers and services.</p>
      </div>
      <SavedList />
    </div>
  );
}
