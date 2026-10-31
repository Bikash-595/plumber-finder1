/** "Load more" button under a paged list; hidden when there is nothing more to load. */
export default function LoadMore({ hasMore, loading, onClick, shown, noun = "items" }: { hasMore: boolean; loading: boolean; onClick: () => void; shown: number; noun?: string }) {
  if (!hasMore) return shown > 0 ? <p className="py-2 text-center text-xs text-gray-400">Showing all {shown} {noun}</p> : null;
  return (
    <div className="flex justify-center pt-2">
      <button type="button" onClick={onClick} disabled={loading} className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0b1f3b] hover:text-[#0b1f3b] disabled:opacity-60">
        {loading ? "Loading…" : `Load more ${noun}`}
      </button>
    </div>
  );
}
